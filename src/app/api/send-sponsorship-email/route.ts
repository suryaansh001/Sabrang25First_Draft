import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, contactPerson, email, phone, sponsorshipAmount, preferredTiming } = body;

    // Validate required fields
    if (!companyName || !contactPerson || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter for Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    });

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 New Sponsorship Inquiry</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sabrang 2025 - Noorvana: From Color to Cosmos</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Partnership Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555; width: 40%;">Company Name:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Contact Person:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${contactPerson}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;"><a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a></td>
            </tr>
            ${sponsorshipAmount ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Sponsorship Amount:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">₹${parseInt(sponsorshipAmount).toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            ${preferredTiming ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Preferred Call Time:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${preferredTiming}</td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; text-align: center;">
            <h3 style="color: white; margin: 0 0 10px 0;">🚀 Next Steps</h3>
            <p style="color: white; margin: 0; font-size: 14px;">Please reach out to ${contactPerson} to discuss partnership opportunities for Sabrang 2025.</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #888;">
            <p>This inquiry was submitted through the Sabrang 2025 "Why Sponsor Us" page.</p>
            <p>Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER, // Where to send the inquiries
      subject: `🎯 New Sponsorship Inquiry from ${companyName} - Sabrang 2025`,
      html: htmlContent,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send acknowledgment email to the inquirer
    const acknowledgmentOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Thank you for your interest in Sabrang 2025 Partnership`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Thank You, ${contactPerson}!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sabrang 2025 - Noorvana: From Color to Cosmos</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Partnership Inquiry Received</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Dear ${contactPerson},
            </p>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for your interest in partnering with <strong>Sabrang 2025</strong>! We have received your sponsorship inquiry for <strong>${companyName}</strong> and are excited about the possibility of collaborating with you.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin: 0 0 10px 0;">🚀 What's Next?</h3>
              <ul style="color: #555; margin: 0; padding-left: 20px;">
                <li>Our partnerships team will review your inquiry within 24-48 hours</li>
                <li>We'll reach out to discuss partnership opportunities and benefits</li>
                <li>You'll receive our detailed sponsorship deck with complete information</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              If you have any immediate questions, please don't hesitate to contact us directly.
            </p>
            
            <div style="margin-top: 30px; text-align: center;">
              <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 8px; color: white;">
                <h3 style="margin: 0 0 10px 0;">📞 Contact Information</h3>
                <p style="margin: 0; font-size: 14px;">For urgent inquiries, reach us at:<br/>
                Email: partnerships@sabrang.com<br/>
                Phone: +91 XXXX XXXXXX</p>
              </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #888;">
              <p>Thank you for considering Sabrang 2025 as your partnership platform!</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(acknowledgmentOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
