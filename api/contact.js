const nodemailer = require('nodemailer');

/* Simple in-memory rate limiter: max 5 requests per IP per 10 minutes */
const rateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const window = 10 * 60 * 1000;
  const max = 5;
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > window) {
    rateMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= max) return true;
  entry.count++;
  rateMap.set(ip, entry);
  return false;
}

/* Escape HTML to prevent XSS in email body */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* Validate email format */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  /* CORS — only allow from own domain */
  const origin = req.headers.origin || '';
  const allowed = ['https://xclusivebarbershop.net', 'https://www.xclusivebarbershop.net', 'https://xclusive-barbershop-ten.vercel.app'];
  if (origin && !allowed.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* Rate limiting */
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  /* Content-Type check */
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'Unsupported Media Type' });
  }

  const { name, lastname, email, phone, message } = req.body || {};

  /* Required field validation */
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  /* Length limits */
  if (name.length > 100 || (lastname && lastname.length > 100) || email.length > 254 || message.length > 3000 || (phone && phone.length > 30)) {
    return res.status(400).json({ error: 'Input exceeds maximum length' });
  }

  /* Email format */
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  /* Honeypot — if 'website' field is filled, it's a bot */
  if (req.body.website) {
    return res.status(200).json({ ok: true });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
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
      replyTo: esc(email),
      subject: `New message from ${esc(name)}${lastname ? ' ' + esc(lastname) : ''} — Xclusive Barbershop`,
      html: `
        <h2 style="color:#192d48">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${esc(name)} ${esc(lastname)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone) || '—'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${esc(message)}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
}
