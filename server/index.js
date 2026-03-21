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

app.listen(PORT, () => {
    console.log(`AI Server running on http://localhost:${PORT}`);
});
