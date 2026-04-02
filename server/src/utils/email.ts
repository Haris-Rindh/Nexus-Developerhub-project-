import nodemailer from 'nodemailer';

/**
 * Mock email sender for 2FA OTP functionality.
 * In a real environment, you would add SMTP_HOST, SMTP_USER, etc., to your .env file.
 */
export const sendEmailOTP = async (to: string, otp: string) => {
  try {
    // Generate a testing account on Ethereal if real credentials are not provided
    let transporter;
    
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback Mock for Development
      console.log(`\n--- MOCK EMAIL INTERCEPTED ---`);
      console.log(`To: ${to}`);
      console.log(`Subject: Your Nexus Platform Verification Code`);
      console.log(`Body: Your 2FA code is: ${otp}`);
      console.log(`------------------------------\n`);
      return;
    }

    const mailOptions = {
      from: '"Nexus Security" <security@nexus-platform.com>',
      to,
      subject: 'Your Nexus 2FA Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nexus Platform Security</h2>
          <p>You requested to log in. Here is your two-factor authentication code:</p>
          <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};