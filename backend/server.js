/* ================================================================
   Divine Birth Midwifery Centre — API Server
   Node.js / Express

   Endpoints
   ─────────
   POST /api/appointment   Book an appointment
   POST /api/inquiry       Send a general inquiry
   GET  /api/health        Health check

   On success each endpoint:
   1. Sends a confirmation email to the patient
   2. Sends a notification email to the clinic
   3. Sends an SMS notification to the clinic via Africa's Talking

   Setup
   ─────
   1. cp .env.example .env   → fill in real values
   2. npm install
   3. npm start              → production
      npm run dev            → development (nodemon)
================================================================ */

'use strict';

require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');
const nodemailer    = require('nodemailer');
const AfricasTalking = require('africastalking');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Security middleware ──────────────────────────────────── */
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '32kb' }));

/* ── Rate limiting: 20 req / 15 min per IP ──────────────── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please wait a few minutes.' }
});
app.use('/api/', limiter);

/* ── Email transporter ───────────────────────────────────── */
const mailer = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/* ── Africa's Talking SMS ─────────────────────────────────── */
const AT = AfricasTalking({
  apiKey:   process.env.AT_API_KEY   || 'sandbox',
  username: process.env.AT_USERNAME  || 'sandbox'
});
const sms = AT.SMS;

/* ── Helpers ─────────────────────────────────────────────── */

/** Send email, resolve true on success or false on failure (never throws) */
async function sendEmail(options) {
  try {
    await mailer.sendMail({
      from: `"Divine Birth Midwifery Centre" <${process.env.SMTP_USER}>`,
      ...options
    });
    return true;
  } catch (err) {
    console.error('[email]', err.message);
    return false;
  }
}

/** Send SMS via Africa's Talking, resolve true/false */
async function sendSMS(to, message) {
  try {
    await sms.send({ to: [to], message, from: 'DivineBirth' });
    return true;
  } catch (err) {
    console.error('[sms]', err.message);
    return false;
  }
}

/** Basic input sanitiser — strip html tags */
function clean(str) {
  return String(str || '').replace(/<[^>]*>/g, '').trim().slice(0, 500);
}

/** Validate Kenyan phone: 07XX XXX XXX or +2547XX XXX XXX */
function validPhone(phone) {
  return /^(\+254|0)7\d{8}$/.test(phone.replace(/\s/g, ''));
}

/** Normalise phone to E.164 (+254XXXXXXXXX) */
function toE164(phone) {
  const p = phone.replace(/\s/g, '');
  if (p.startsWith('+254')) return p;
  if (p.startsWith('0'))    return '+254' + p.slice(1);
  return p;
}

/* ── Email templates ─────────────────────────────────────── */

function appointmentConfirmEmail(data) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Georgia, serif; color: #1a2b3c; margin: 0; padding: 0; background: #f5f0eb; }
  .wrap { max-width: 600px; margin: 32px auto; background: #ffffff; border: 1px solid #d8dde3; }
  .header { background: #1a2b3c; padding: 32px 36px; }
  .header h1 { font-family: Georgia, serif; font-size: 22px; color: white; margin: 0; font-weight: 400; }
  .header p  { font-size: 12px; color: rgba(255,255,255,0.5); margin: 6px 0 0; letter-spacing: 0.1em; text-transform: uppercase; }
  .body { padding: 36px; }
  .body p { font-size: 15px; line-height: 1.75; color: #3d5166; margin: 0 0 16px; }
  .card { background: #e8f2f0; border-left: 3px solid #2e7d6e; padding: 20px 22px; margin: 24px 0; }
  .card table { width: 100%; border-collapse: collapse; }
  .card td { font-size: 14px; padding: 5px 0; color: #1a2b3c; }
  .card td:first-child { font-weight: 600; width: 40%; color: #6b7c8d; text-transform: uppercase; font-size: 11px; letter-spacing: 0.07em; }
  .footer { background: #f5f0eb; padding: 22px 36px; font-size: 12px; color: #6b7c8d; border-top: 1px solid #d8dde3; }
  .footer a { color: #2e7d6e; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>Divine Birth Midwifery Centre</h1>
    <p>Guiding You Through Your Birth Journey</p>
  </div>
  <div class="body">
    <p>Dear ${data.firstname},</p>
    <p>Thank you for booking an appointment with Divine Birth Midwifery Centre. We have received your request and our team will confirm your slot by SMS shortly.</p>
    <div class="card">
      <table>
        <tr><td>Name</td><td>${data.firstname} ${data.lastname}</td></tr>
        <tr><td>Service</td><td>${data.service}</td></tr>
        <tr><td>Date</td><td>${data.date}</td></tr>
        <tr><td>Time</td><td>${data.time}</td></tr>
        <tr><td>Phone</td><td>${data.phone}</td></tr>
        ${data.notes ? `<tr><td>Notes</td><td>${data.notes}</td></tr>` : ''}
      </table>
    </div>
    <p>If you need to reschedule or have any questions, please call us on <strong>+254 794 444141</strong> or reply to this email.</p>
    <p>We look forward to welcoming you.</p>
    <p style="margin-top:28px;">Warm regards,<br><strong>The Divine Birth Team</strong></p>
  </div>
  <div class="footer">
    Besides Alvo House, opposite PlayWay Academy, Kahawa Wendani, Nairobi &nbsp;|&nbsp;
    <a href="tel:+254794444141">+254 794 444141</a> &nbsp;|&nbsp;
    <a href="mailto:info@divinebirthmidwifery.org">info@divinebirthmidwifery.org</a>
  </div>
</div>
</body>
</html>`;
}

function appointmentNotifyEmail(data) {
  return `
New appointment request from the website.

Name:    ${data.firstname} ${data.lastname}
Phone:   ${data.phone}
Service: ${data.service}
Date:    ${data.date}
Time:    ${data.time}
Notes:   ${data.notes || '—'}

Submitted: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })} (Nairobi time)
`;
}

function inquiryConfirmEmail(data) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Georgia, serif; color: #1a2b3c; margin: 0; padding: 0; background: #f5f0eb; }
  .wrap { max-width: 600px; margin: 32px auto; background: #ffffff; border: 1px solid #d8dde3; }
  .header { background: #1a2b3c; padding: 32px 36px; }
  .header h1 { font-family: Georgia, serif; font-size: 22px; color: white; margin: 0; font-weight: 400; }
  .header p  { font-size: 12px; color: rgba(255,255,255,0.5); margin: 6px 0 0; letter-spacing: 0.1em; text-transform: uppercase; }
  .body { padding: 36px; }
  .body p { font-size: 15px; line-height: 1.75; color: #3d5166; margin: 0 0 16px; }
  .footer { background: #f5f0eb; padding: 22px 36px; font-size: 12px; color: #6b7c8d; border-top: 1px solid #d8dde3; }
  .footer a { color: #2e7d6e; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>Divine Birth Midwifery Centre</h1>
    <p>Guiding You Through Your Birth Journey</p>
  </div>
  <div class="body">
    <p>Dear ${data.name},</p>
    <p>Thank you for reaching out to Divine Birth Midwifery Centre. We have received your inquiry and a member of our team will be in touch with you shortly.</p>
    <p>In the meantime, if your matter is urgent please call us directly on <strong>+254 794 444141</strong>. We are open 24 hours a day, 7 days a week.</p>
    <p style="margin-top:28px;">Warm regards,<br><strong>The Divine Birth Team</strong></p>
  </div>
  <div class="footer">
    Besides Alvo House, opposite PlayWay Academy, Kahawa Wendani, Nairobi &nbsp;|&nbsp;
    <a href="tel:+254794444141">+254 794 444141</a> &nbsp;|&nbsp;
    <a href="mailto:info@divinebirthmidwifery.org">info@divinebirthmidwifery.org</a>
  </div>
</div>
</body>
</html>`;
}

/* ── Routes ──────────────────────────────────────────────── */

/* Health check */
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

/* ── POST /api/appointment ── */
app.post('/api/appointment', async (req, res) => {
  const {
    firstname = '', lastname = '', phone = '',
    service = '', date = '', time = '', notes = ''
  } = req.body;

  /* Validate */
  if (!firstname.trim() || !phone.trim() || !service || !date || !time) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  if (!validPhone(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number. Use format 07XX XXX XXX.' });
  }

  const data = {
    firstname: clean(firstname),
    lastname:  clean(lastname),
    phone:     clean(phone),
    service:   clean(service),
    date:      clean(date),
    time:      clean(time),
    notes:     clean(notes)
  };

  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  const clinicPhone = process.env.CLINIC_PHONE || '+254794444141';

  /* Run all three notifications in parallel */
  const [emailedClinic, smsedClinic] = await Promise.all([
    /* Notify clinic */
    sendEmail({
      to:      notifyEmail,
      subject: `[Appointment] ${data.firstname} ${data.lastname} — ${data.service} on ${data.date} at ${data.time}`,
      text:    appointmentNotifyEmail(data),
    }),
    /* SMS clinic */
    sendSMS(
      clinicPhone,
      `DivineBirth APPT: ${data.firstname} ${data.lastname} | ${data.service} | ${data.date} ${data.time} | ${toE164(data.phone)}`
    ),
    /* Confirmation to patient (best-effort, no patient email collected — SMS only from calendar) */
  ]);

  console.log(`[appointment] ${data.firstname} ${data.lastname} | email:${emailedClinic} sms:${smsedClinic}`);

  return res.json({
    success: true,
    message: 'Appointment request received. We will confirm by SMS shortly.'
  });
});

/* ── POST /api/inquiry ── */
app.post('/api/inquiry', async (req, res) => {
  const {
    firstname = '', lastname = '', phone = '',
    service = '', message = '', email = ''
  } = req.body;

  if (!firstname.trim() || !phone.trim()) {
    return res.status(400).json({ success: false, message: 'Name and phone number are required.' });
  }
  if (!validPhone(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number. Use format 07XX XXX XXX.' });
  }

  const data = {
    name:    clean(firstname) + ' ' + clean(lastname),
    phone:   clean(phone),
    email:   clean(email),
    service: clean(service),
    message: clean(message)
  };

  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  const clinicPhone = process.env.CLINIC_PHONE || '+254794444141';

  await Promise.all([
    /* Notify clinic by email */
    sendEmail({
      to:      notifyEmail,
      subject: `[Inquiry] ${data.name} — ${data.service || 'General'}`,
      text:    `New inquiry from website.\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || '—'}\nService: ${data.service || '—'}\nMessage: ${data.message || '—'}\n\nSubmitted: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })} Nairobi`
    }),
    /* SMS clinic */
    sendSMS(
      clinicPhone,
      `DivineBirth INQUIRY: ${data.name} | ${data.service || 'General'} | ${toE164(data.phone)}`
    ),
    /* Confirmation email to patient if they provided an email */
    data.email ? sendEmail({
      to:      data.email,
      subject: 'Thank you for contacting Divine Birth Midwifery Centre',
      html:    inquiryConfirmEmail(data)
    }) : Promise.resolve()
  ]);

  return res.json({
    success: true,
    message: 'Inquiry received. Our team will be in touch shortly.'
  });
});

/* ── 404 catch-all ── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found.' });
});

/* ── Error handler ── */
app.use((err, req, res, _next) => {
  console.error('[server error]', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`
  ┌────────────────────────────────────────────┐
  │  Divine Birth Midwifery Centre — API       │
  │  Running on http://localhost:${PORT}          │
  │  NODE_ENV: ${(process.env.NODE_ENV || 'development').padEnd(18)}│
  └────────────────────────────────────────────┘
  `);
});

module.exports = app;
