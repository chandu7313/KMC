export const getCropSuitability = (ph) => {
    let phStatus = 'Neutral';
    let suitabilityPct = 95;
    let crops = ['Wheat', 'Maize', 'Pulses'];

    if (ph < 6.0) {
        phStatus = 'Acidic';
        suitabilityPct = 80;
        crops = ['Groundnut', 'Millets', 'Tea', 'Potato'];
    } else if (ph > 7.5) {
        phStatus = 'Alkaline';
        suitabilityPct = 85;
        crops = ['Cotton', 'Pulses', 'Sorghum', 'Barley'];
    } else {
        phStatus = 'Neutral';
        suitabilityPct = 95;
        crops = ['Rice', 'Wheat', 'Maize', 'Soybean'];
    }

    return { phStatus, crops, suitabilityPct };
};
