import axios from 'axios';
import { createLogger } from '@kissan/shared';

const logger = createLogger('ai-service');

/**
 * Detect disease via Plant.id API.
 * Matches monolith services/plantIdService.js behavior.
 */
export const detectDiseaseWithPlantId = async (base64Image) => {
  const apiKey = process.env.PLANT_API_KEY;
  const apiUrl = process.env.PLANT_ID_API_URL || 'https://plant.id/api/v3/health_assessment';

  if (!apiKey) {
    logger.warn('PLANT_API_KEY not set — skipping Plant.id');
    return { success: false, message: 'Plant.id API key not configured' };
  }

  try {
    const response = await axios.post(apiUrl, {
      images: [`data:image/jpeg;base64,${base64Image}`],
      latitude: 20.5937,
      longitude: 78.9629,
      similar_images: true,
    }, {
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    const result = response.data?.result;
    if (!result) return { success: false, message: 'No result from Plant.id' };

    const isPlant = result.is_plant?.probability > 0.5;
    const isHealthy = result.is_healthy?.probability > 0.6;

    let diseaseName = 'Unknown';
    let confidence = 0;

    if (result.disease?.suggestions?.length > 0) {
      const top = result.disease.suggestions[0];
      diseaseName = top.name;
      confidence = Math.round((top.probability || 0) * 100);
    }

    return { success: true, isPlant, isHealthy, diseaseName, confidence };
  } catch (error) {
    logger.error('Plant.id API error:', { error: error.message });
    return { success: false, message: error.message };
  }
};
