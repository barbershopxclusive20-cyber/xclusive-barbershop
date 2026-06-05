const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, lastname, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Xclusive Barbershop Web" <${process.env.GMAIL_USER}>`,
    to: 'barbershopxclusive20@gmail.com',
    replyTo: email,
    subject: `New message from ${name}${lastname ? ' ' + lastname : ''} — Xclusive Barbershop`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name} ${lastname || ''}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || '—'}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  });

  return res.status(200).json({ ok: true });
}
