import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { supabaseAdmin } from '@/app/_lib/supabase';
import { sendEmail, createDodgersWinEmail } from '@/app/_lib/email';

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  preference_days: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { email, preference_days } = subscribeSchema.parse(body);

    // Generate unique token for unsubscribe functionality
    const token = randomBytes(32).toString('hex');

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('subscribers')
      .select('email, status')
      .eq('email', email)
      .single();

    if (existingUser) {
      if (existingUser.status === 'subscribed') {
        return NextResponse.json(
          { error: 'Email is already subscribed to notifications' },
          { status: 409 }
        );
      } else {
        // Reactivate unsubscribed user
        const { error: updateError } = await supabaseAdmin
          .from('subscribers')
          .update({ 
            status: 'subscribed',
            token: token,
            unsubscribed_at: null,
            preference_days: preference_days 
          })
          .eq('email', email);

        if (updateError) {
          console.error('Database update error:', updateError);
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        return NextResponse.json({ 
          message: 'Successfully reactivated your subscription!' 
        });
      }
    }

    // Insert new subscriber
    const { error: insertError } = await supabaseAdmin
      .from('subscribers')
      .insert([
        {
          email,
          token,
          status: 'subscribed',
          preference_days: preference_days
        }
      ]);

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Successfully subscribed! You\'ll get notified when the Dodgers win at home.' 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
