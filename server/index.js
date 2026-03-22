import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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

// Visitor Count Route for Local Dev
app.get('/api/visitor-count', async (req, res) => {
    // For local dev, we return a mock count if Supabase isn't configured
    // This resolves the ECONNREFUSED issues in vite proxy
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.json({ count: 1240, mode: 'local-mock' });
    }

    try {
        const ip = req.ip || req.headers['x-forwarded-for'];
        const ipHash = Buffer.from(ip).toString('base64');

        // Increment count (UPSERT)
        await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({ ip_hash: ipHash })
        });

        // Get total
        const countRes = await fetch(`${SUPABASE_URL}/rest/v1/visits?select=count`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'count=exact'
            }
        });

        const contentRange = countRes.headers.get('content-range');
        const count = contentRange ? parseInt(contentRange.split('/')[1]) : 0;
        
        res.json({ count });
    } catch (err) {
        console.error("Local Visitor Count Error:", err);
        res.json({ count: 1240, error: 'fallback' });
    }
});

app.listen(PORT, () => {
    console.log(`AI Server running on http://localhost:${PORT}`);
});
