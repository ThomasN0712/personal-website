import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

export async function sendEmail({ to, subject, htmlContent, textContent }: EmailData) {
  try {
    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textContent,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const result = await sesClient.send(command);
    console.log('Email sent successfully:', result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Template for Dodgers win notification email
export function createDodgersWinEmail(
  gameScore: string,
  unsubscribeToken: string,
  appUrl: string
) {
  const subject = "🎉 Dodgers Won! Your Panda Express Coupon is Ready";
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dodgers Win Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">🏆 Dodgers Won!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${gameScore}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">🍜 Your Panda Express Coupon is Ready!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          The Dodgers won at home, which means you can get a <strong>free entrée</strong> at Panda Express today!
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #059669;">How to Redeem:</h3>
          <ol style="margin: 0; padding-left: 20px;">
            <li>Visit any Panda Express location</li>
            <li>Show this email or mention "Dodgers win promotion"</li>
            <li>Enjoy your free entrée!</li>
          </ol>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://pandaexpress.com" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Find Panda Express Locations
        </a>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
        <p>
          This email was sent because you subscribed to Dodgers win alerts.<br>
          <a href="${appUrl}/unsubscribe?token=${unsubscribeToken}" style="color: #3b82f6;">Unsubscribe</a> | 
          <a href="${appUrl}" style="color: #3b82f6;">Visit Website</a>
        </p>
      </div>
    </body>
    </html>
  `;
  
  const textContent = `
    🎉 Dodgers Won! Your Panda Express Coupon is Ready
    
    ${gameScore}
    
    The Dodgers won at home, which means you can get a FREE ENTREE at Panda Express today!
    
    How to Redeem:
    1. Visit any Panda Express location
    2. Show this email or mention "Dodgers win promotion"
    3. Enjoy your free entrée!
    
    Find locations: https://pandaexpress.com
    
    ---
    This email was sent because you subscribed to Dodgers win alerts.
    Unsubscribe: ${appUrl}/unsubscribe?token=${unsubscribeToken}
    Visit Website: ${appUrl}
  `;
  
  return { subject, htmlContent, textContent };
}
