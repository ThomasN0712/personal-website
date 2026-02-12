import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/app/_lib/supabase';

// Validation schema
const unsubscribeSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { token } = unsubscribeSchema.parse(body);

    // Find subscriber by token
    const { data: subscriber, error: findError } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, status')
      .eq('token', token)
      .single();

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe link' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        { message: 'You are already unsubscribed' },
        { status: 200 }
      );
    }

    // Update subscriber status
    const { error: updateError } = await supabaseAdmin
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('token', token);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to unsubscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Successfully unsubscribed from Dodgers win notifications',
      email: subscriber.email 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Also support GET requests for direct link clicks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find subscriber by token
    const { data: subscriber, error: findError } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, status')
      .eq('token', token)
      .single();

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe link' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        { message: 'You are already unsubscribed' },
        { status: 200 }
      );
    }

    // Update subscriber status
    const { error: updateError } = await supabaseAdmin
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('token', token);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to unsubscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Successfully unsubscribed from Dodgers win notifications',
      email: subscriber.email 
    });

  } catch (error) {
    console.error('Unsubscribe GET API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
