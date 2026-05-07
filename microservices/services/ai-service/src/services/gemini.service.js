import { GoogleGenerativeAI } from '@google/generative-ai';
import { createLogger } from '@kissan/shared';

const logger = createLogger('ai-service');

const MODELS_TO_TRY = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

/**
 * Run Gemini text prompt with model fallback chain.
 */
export const generateFromText = async (prompt, options = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = options.models || MODELS_TO_TRY;
  let lastError = null;

  for (const modelName of models) {
    try {
      logger.info(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: options.json ? 'application/json' : 'text/plain',
          ...(options.generationConfig || {}),
        },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      logger.info(`✅ Success with ${modelName}`);
      return options.json ? JSON.parse(text) : text;
    } catch (err) {
      lastError = err;
      const is429 = err?.message?.includes('429') || err?.message?.includes('quota');
      const is404 = err?.message?.includes('404') || err?.message?.includes('not found');
      logger.warn(`⚠️ ${modelName} failed${is429 ? ' (rate limited)' : is404 ? ' (not found)' : ''}`);
      if (is429 || is404) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      break;
    }
  }

  throw new Error(`All Gemini models exhausted: ${lastError?.message}`);
};

/**
 * Run Gemini vision prompt (image + text) with model fallback chain.
 */
export const generateFromImage = async (prompt, imageBase64, mimeType = 'image/jpeg', options = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = options.models || MODELS_TO_TRY;

  const contentParts = [
    { text: prompt },
    { inlineData: { mimeType, data: imageBase64 } },
  ];

  let lastError = null;

  for (const modelName of models) {
    try {
      logger.info(`Trying vision model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: options.json ? 'application/json' : 'text/plain',
          ...(options.generationConfig || {}),
        },
      });
      const result = await model.generateContent(contentParts);
      const text = result.response.text();
      logger.info(`✅ Vision success with ${modelName}`);
      return options.json ? JSON.parse(text) : text;
    } catch (err) {
      lastError = err;
      const is429 = err?.message?.includes('429') || err?.message?.includes('quota');
      const is404 = err?.message?.includes('404') || err?.message?.includes('not found');
      logger.warn(`⚠️ ${modelName} vision failed${is429 ? ' (rate limited)' : ''}`);
      if (is429 || is404) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      break;
    }
  }

  throw new Error(`All Gemini vision models exhausted: ${lastError?.message}`);
};
