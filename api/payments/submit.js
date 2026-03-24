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

const adminEmail = process.env.ADMIN_EMAIL;
const adminWhatsApp = process.env.ADMIN_WHATSAPP_TO;

async function notifyAdmin(subject, message) {
  if (adminEmail && transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject,
        text: message,
      });
    } catch (err) {
      console.error('admin email notify failed', err);
    }
  }

  if (adminWhatsApp && twilioClient && process.env.TWILIO_WHATSAPP_FROM) {
    try {
      await twilioClient.messages.create({
        body: `${subject}\n${message}`,
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: adminWhatsApp,
      });
    } catch (err) {
      console.error('admin whatsapp notify failed', err);
    }
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

  const { email, transactionId, name } = req.body;

  if (!email || !transactionId) {
    return res.status(400).json({ error: 'Email and transaction ID are required.' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase service key or URL not configured.' });
  }

  try {
    const { data, error } = await supabase.from('payments').insert([{ email, transaction_id: transactionId, status: 'pending', user_name: name || null }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await notifyAdmin('New payment submitted', `Name: ${name || 'unknown'}\nEmail: ${email}\nTXID: ${transactionId}`);

    return res.status(200).json({ success: true, payment: data?.[0] ?? null });
  } catch (err) {
    console.error('submit payment error', err);
    return res.status(500).json({ error: 'Server error while submitting payment.' });
  }
}
