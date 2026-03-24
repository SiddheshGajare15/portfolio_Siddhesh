import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

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

const adminEmail = process.env.ADMIN_EMAIL;

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

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required.' });
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return res.status(401).json({ error: 'Invalid or expired auth token.' });
  }

  const userId = authData.user.id;
  const { email, transactionId, name } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required.' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase service key or URL not configured.' });
  }

  try {
    const { data, error } = await supabase.from('payments').insert([{ user_id: userId, transaction_id: transactionId, status: 'pending' }]);

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
