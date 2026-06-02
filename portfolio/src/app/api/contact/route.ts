import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate env vars are present
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_EMAIL) {
      console.error('[Contact API] Missing SMTP environment variables')
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 })
    }

    // Configure nodemailer transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // use 'gmail' service shortcut — handles TLS automatically
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
      },
    })

    // Setup email data
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email, // So you can reply directly to the sender
      subject: `New Portfolio Contact from ${name}${company ? ` at ${company}` : ''}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #00E5FF; padding-bottom: 10px;">📬 New Portfolio Contact</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 100px;">Name:</td>
              <td style="padding: 8px 0; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #333;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${company ? `<tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Company:</td>
              <td style="padding: 8px 0; color: #333;">${company}</td>
            </tr>` : ''}
          </table>
          <div style="background: white; padding: 16px; border-radius: 6px; border-left: 4px solid #00E5FF; margin-top: 16px;">
            <h4 style="color: #555; margin: 0 0 8px 0;">Message:</h4>
            <p style="color: #333; white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Sent from your portfolio website at anurag07.vercel.app</p>
        </div>
      `,
    }

    // Await the email send — so we can return proper errors if it fails
    await transporter.sendMail(mailOptions)

    console.log('[Contact Form Submission Success]', { name, email, company })
    return NextResponse.json({ success: true, message: 'Message sent successfully!' })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[Contact API Error]', errorMessage)
    return NextResponse.json(
      { error: `Failed to send email: ${errorMessage}` },
      { status: 500 }
    )
  }
}
