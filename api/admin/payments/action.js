import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import Twilio from 'twilio';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

async function notifyAdmin(subject, message) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminWhatsApp = process.env.ADMIN_WHATSAPP_TO;

  if (adminEmail && transporter) {
    try {
      await transporter.sendMail({ from: process.env.SMTP_USER, to: adminEmail, subject, text: message });
    } catch (err) { console.error('admin email notify failed', err); }
  }

  if (adminWhatsApp && twilioClient && process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await twilioClient.messages.create({
        body: `${subject}\n${message}`,
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: adminWhatsApp,
      });
    } catch (err) { console.error('admin whatsapp notify failed', err); }
  }
}

async function notifyUser(email, subject, text) {
  if (!email) return;
  const userNotifier = transporter;

  if (userNotifier) {
    try {
      await userNotifier.sendMail({ from: process.env.SMTP_USER, to: email, subject, text });
    } catch (err) { console.error('user email notify failed', err); }
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ error: 'id and status are required' });

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase credentials missing' });
  }

  try {
    const { data: payment, error: fetchErr } = await supabase.from('payments').select('*').eq('id', id).single();
    if (fetchErr) return res.status(404).json({ error: 'Payment not found' });

    const { error: updateErr } = await supabase.from('payments').update({ status }).eq('id', id);
    if (updateErr) return res.status(500).json({ error: updateErr.message });

    if (status === 'approved') {
      if (payment?.email) {
        await notifyUser(payment.email, 'Payment approved', 'Your premium access is now active.');
      }
      if (payment?.user_id) {
        await supabase.from('users').update({ is_premium: true }).eq('id', payment.user_id);
      }
    }

    await notifyAdmin('Payment status changed', `Payment ${id} is now ${status}`);

    return res.status(200).json({ success: true, payment: { ...payment, status } });
  } catch (err) {
    console.error('admin action error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
