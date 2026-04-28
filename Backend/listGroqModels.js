import Groq from 'groq-sdk';
import 'dotenv/config';

async function listModels() {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const models = await groq.models.list();
        console.log("Available Groq Models:");
        models.data.forEach(m => console.log(m.id));
    } catch (e) {
        console.error(e);
    }
}

listModels();
