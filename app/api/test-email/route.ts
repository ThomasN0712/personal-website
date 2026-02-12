import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, createDodgersWinEmail } from '@/app/_lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create a test email
    const testEmail = createDodgersWinEmail(
      'Dodgers 5 - Giants 2',
      'test-token-123',
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    );

    // Send the test email
    const result = await sendEmail({
      to: email,
      subject: testEmail.subject,
      htmlContent: testEmail.htmlContent,
      textContent: testEmail.textContent,
    });

    if (result.success) {
      return NextResponse.json({ 
        message: 'Test email sent successfully!',
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email: ' + result.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
