

/**
 * Send base64 image to Plant.id API for initial disease detection and health assessment.
 * @param {string} base64Image - The image to analyze
 * @returns {Promise<Object>} The detection result including diseaseName, isHealthy, and isPlant status
 */
export const detectDiseaseWithPlantId = async (base64Image) => {
    const url = process.env.PLANT_ID_API_URL || 'https://plant.id/api/v3';
    const apiKey = process.env.PLANT_API_KEY;
    
    if (!apiKey) {
        throw new Error('Plant.id API key is missing.');
    }

    try {
        const response = await fetch(`${url}/health_assessment?details=description,treatment`, {
            method: 'POST',
            headers: {
                'Api-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                images: [base64Image],
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Plant.id API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // Extract relevant information
        const result = data.result;
        
        // Check if it's actually a plant
        const isPlant = result.is_plant ? result.is_plant.binary : true; // default true if not provided
        
        // Check if healthy
        const isHealthy = result.is_healthy ? result.is_healthy.binary : false;
        
        // Extract disease name
        let diseaseName = null;
        if (!isHealthy && result.disease && result.disease.suggestions && result.disease.suggestions.length > 0) {
            diseaseName = result.disease.suggestions[0].name;
        } else if (isHealthy) {
            diseaseName = 'Healthy Crop';
        }

        return {
            success: true,
            isPlant,
            isHealthy,
            diseaseName,
            rawResult: data
        };

    } catch (error) {
        console.error('PlantIdService Error:', error);
        return { success: false, message: error.message };
    }
};
