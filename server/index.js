import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';
import Twilio from 'twilio';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Notification settings
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
const ADMIN_WHATSAPP_TO = process.env.ADMIN_WHATSAPP_TO; // e.g. "whatsapp:+911234567890"

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN ? new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

async function notifyAdmin(subject, text) {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS && ADMIN_EMAIL) {
    try {
      await transporter.sendMail({
        from: SMTP_USER,
        to: ADMIN_EMAIL,
        subject,
        text,
      });
    } catch (err) {
      console.error('Error sending admin email:', err);
    }
  }

  if (twilioClient && TWILIO_WHATSAPP_FROM && ADMIN_WHATSAPP_TO) {
    try {
      await twilioClient.messages.create({
        body: `${subject}\n${text}`,
        from: TWILIO_WHATSAPP_FROM,
        to: ADMIN_WHATSAPP_TO,
      });
    } catch (err) {
      console.error('Error sending admin WhatsApp:', err);
    }
  }
}


app.post('/api/ai-explain', async (req, res) => {
  const { input, mode } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Please provide code or a question.' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key missing on server.' });
  }

  try {
    const systemPrompt = "You are an expert AI Code Explainer and Interview Assistant. Your goal is to help students understand coding problems, Java snippets, and technical interview queries. Use Markdown formatting for headings and code blocks.";
    let userPrompt = "";

    if (mode === 'explain') {
      userPrompt = `Explain the following code or problem in simple terms. Provide a step-by-step breakdown:\n\n${input}`;
    } else if (mode === 'approach') {
      userPrompt = `Describe the logical approach and algorithm needed to solve this problem. If there is an optimized solution, mention it briefly:\n\n${input}`;
    } else {
      userPrompt = `Help me with the following interview-related query or code analysis:\n\n${input}`;
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response.text();

    res.json({ response });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ error: 'Gemini AI Error: ' + (error.message || 'Unknown error') });
  }
});

// Mock Database (In real case, use MongoDB or SQL)
let payments = [];
let users = [
  { id: 1, name: "Siddhesh Gajare", email: "siddhesh@example.com", isPremium: false }
];

app.get('/api/admin/payments', (req, res) => {
  res.json(payments);
});

app.post('/api/payments/submit', async (req, res) => {
  const { name, email, transactionId } = req.body;
  const newPayment = {
    id: Date.now(),
    name,
    email,
    transactionId,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  payments.push(newPayment);

  // Send admin notification whenever a new payment is logged
  await notifyAdmin(
    'New Premium Payment Submitted',
    `A new payment submission has been recorded:\n\nName: ${name}\nEmail: ${email}\nTransaction ID: ${transactionId}\nStatus: pending\nTime: ${newPayment.timestamp}`
  );

  res.json({ success: true, payment: newPayment });
});

app.post('/api/admin/payments/action', async (req, res) => {
  const { id, status } = req.body;
  const payment = payments.find(p => p.id === id);
  if (payment) {
    payment.status = status;

    await notifyAdmin(
      `Payment Status Updated: ${status}`,
      `Payment for user ${payment.name} (${payment.email}) with TX ID ${payment.transactionId} is now ${status}.`
    );

    if (status === 'approved') {
      // optional: notify user about approval
      if (payment.email && SMTP_HOST && SMTP_USER && SMTP_PASS) {
        try {
          await transporter.sendMail({
            from: SMTP_USER,
            to: payment.email,
            subject: 'Your premium payment is approved',
            text: `Thank you for your payment. Your premium access has been activated.`,
          });
        } catch (err) {
          console.error('Error sending user approval email:', err);
        }
      }
      // If you have user phone number for WhatsApp, send notification too
      const userWhatsApp = payment.whatsapp || null; // link this from your app if available
      if (userWhatsApp && twilioClient && TWILIO_WHATSAPP_FROM) {
        try {
          await twilioClient.messages.create({
            body: `Your payment has been approved. Premium access is active.`,
            from: TWILIO_WHATSAPP_FROM,
            to: `whatsapp:${userWhatsApp}`,
          });
        } catch (err) {
          console.error('Error sending user WhatsApp approval:', err);
        }
      }
    }

    return res.json({ success: true, payment });
  } else {
    res.status(404).json({ error: 'Payment not found' });
  }
});

app.listen(PORT, () => {
    console.log(`AI Server running on http://localhost:${PORT}`);
});
