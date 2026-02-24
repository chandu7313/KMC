export const classifyNutrient = (val, target) => {
    const pct = (val / target) * 100;
    if (pct < 60) return 'Low';
    if (pct < 90) return 'Medium';
    return 'High';
};

export const getFertilizerRecommendation = (n, p, k, om) => {
    const targets = { n: 50, p: 30, k: 200, om: 3.0 };

    const nLevel = classifyNutrient(n, targets.n);
    const pLevel = classifyNutrient(p, targets.p);
    const kLevel = classifyNutrient(k, targets.k);
    const omLevel = classifyNutrient(om, targets.om);

    const schedule = [];

    // Nitrogen Schedule
    if (nLevel === 'Low') {
        schedule.push({
            nutrient: 'Nitrogen',
            fertilizer: 'Urea (46% N)',
            quantity: '50kg per acre',
            timing: 'Split into 3 doses: Basal (at sowing), Top dressing (25-30 days), and Panicle initiation (50-60 days)'
        });
    } else if (nLevel === 'Medium') {
        schedule.push({
            nutrient: 'Nitrogen',
            fertilizer: 'Urea (46% N)',
            quantity: '30kg per acre',
            timing: 'Split into 2 doses: Basal and Top dressing'
        });
    }

    // Phosphorus Schedule
    if (pLevel === 'Low') {
        schedule.push({
            nutrient: 'Phosphorus',
            fertilizer: 'DAP (18-46-0)',
            quantity: '30kg per acre',
            timing: 'Full basal dose at the time of sowing/planting'
        });
    }

    // Potassium Schedule
    if (kLevel === 'Low') {
        schedule.push({
            nutrient: 'Potassium',
            fertilizer: 'MOP (0-0-60)',
            quantity: '25kg per acre',
            timing: 'Basal dose at sowing or split (50% basal, 50% at flowering for some crops)'
        });
    }

    // Organic Matter Schedule
    if (omLevel === 'Low') {
        schedule.push({
            nutrient: 'Organic Matter',
            fertilizer: 'FYM (Farm Yard Manure)',
            quantity: '5-8 tons per acre',
            timing: 'Broadcasting and mixing with soil 15-20 days before sowing'
        });
    }

    return {
        schedule,
        classification: {
            nitrogen: nLevel,
            phosphorus: pLevel,
            potassium: kLevel,
            organicMatter: omLevel
        }
    };
};
