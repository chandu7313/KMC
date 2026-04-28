import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function listModels() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("No API key");
            return;
        }
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(m => console.log(m.name, "-", m.supportedGenerationMethods.join(', ')));
    } catch (e) {
        console.error(e);
    }
}

listModels();
