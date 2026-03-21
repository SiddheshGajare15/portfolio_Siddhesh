import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load from server/.env
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing key:', apiKey ? 'Key found (starts with ' + apiKey.substring(0, 5) + '...)' : 'Key NOT found');

if (!apiKey) {
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function test() {
    try {
        console.log('Sending request to Gemini...');
        const result = await model.generateContent('Hello!');
        console.log('Response:', result.response.text());
    } catch (error) {
        console.error('ERROR DETECTED:', error);
    }
}

test();
