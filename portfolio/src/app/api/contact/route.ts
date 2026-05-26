import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Setup email data
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // sender address
      to: process.env.CONTACT_EMAIL, // list of receivers
      subject: `New Portfolio Contact from ${name}${company ? ` at ${company}` : ''}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    // Send the email in the background to reduce response latency
    transporter.sendMail(mailOptions).then(() => {
      console.log('[Contact Form Submission Success]', { name, email, company })
    }).catch((error) => {
      console.error('[Contact Form Email Error]', error)
    });

    console.log('[Contact Form Received]', { name, email, company, message })

    return NextResponse.json({ success: true, message: 'Message received!' })
  } catch (error) {
    console.error('[Contact API Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
