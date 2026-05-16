import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In production: send email via nodemailer or save to MongoDB
    // For now, just log and return success
    console.log('[Contact Form Submission]', { name, email, company, message })

    return NextResponse.json({ success: true, message: 'Message received!' })
  } catch (error) {
    console.error('[Contact API Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
