import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/ai-explain', async (req, res) => {
  const { input, mode } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Please provide code or a question.' });
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Better and more efficient
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.listen(PORT, () => {
    console.log(`AI Server running on http://localhost:${PORT}`);
});
