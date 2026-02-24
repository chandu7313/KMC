import { getFertilizerRecommendation } from './fertilizerService.js';
import { getCropSuitability } from './cropSuitabilityService.js';

export const analyzeSoil = (ph, n, p, k, om) => {
    const fertData = getFertilizerRecommendation(n, p, k, om);
    const { phStatus, crops, suitabilityPct } = getCropSuitability(ph);

    return {
        fertilizers: fertData.schedule.map(s => s.fertilizer).join(' + ') || 'Balanced — maintenance dose only',
        fertilizerSchedule: fertData.schedule,
        nutrientClassification: fertData.classification,
        crops,
        suitabilityPct,
        phStatus
    };
};
