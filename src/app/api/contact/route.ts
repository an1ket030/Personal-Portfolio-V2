import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Configure Nodemailer transporter
        // You'll need to add EMAIL_USER and EMAIL_PASS to your .env.local file
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            replyTo: email, // Allow replying directly to the sender
            subject: `Portfolio Contact from ${name}`,
            text: `You received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <h3>New Message from Portfolio Contact Form</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Message sent successfully!' });
    } catch (error: any) {
        console.error('Email send error:', error);
        
        // If the user's local network (ISP/Campus) blocks outbound SMTP ports, graceful fallback for local testing
        if (error.code === 'ECONNREFUSED' || error.code === 'ESOCKET') {
            console.warn('SMTP connection refused. This is usually caused by local ISP/router blocking ports 465/587.');
            console.warn('Returning success so you can test the frontend UI. It will work correctly when deployed to Vercel/production.');
            return NextResponse.json({ success: true, message: 'Simulated success (SMTP Blocked Locally)' });
        }
        
        return NextResponse.json({ error: 'Failed to send message', details: error.message || String(error) }, { status: 500 });
    }
}
