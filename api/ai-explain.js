import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Add basic CORS headers for serverless
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, mode } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Please provide code or a question.' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key not configured on server.' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

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

    // Using gemini-1.5-flash (stable)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response.text();

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return res.status(500).json({ error: 'Gemini AI Error: ' + (error.message || 'Unknown error') });
  }
}
