/**
 * Soil analysis engine — extracted from monolith services/soilAnalysisService.js.
 * Pure logic — no DB, no I/O.
 */
export const analyzeSoil = (ph, nitrogen, phosphorus, potassium, organicMatter = 0) => {
  // pH Status
  let phStatus;
  if (ph < 5.5) phStatus = 'Strongly Acidic';
  else if (ph < 6.5) phStatus = 'Moderately Acidic';
  else if (ph <= 7.5) phStatus = 'Neutral (Ideal)';
  else if (ph <= 8.5) phStatus = 'Moderately Alkaline';
  else phStatus = 'Strongly Alkaline';

  // Nutrient classification
  const classifyNutrient = (val, low, med) => {
    if (val < low) return 'Low';
    if (val < med) return 'Medium';
    return 'High';
  };

  const nutrientClassification = {
    nitrogen: classifyNutrient(nitrogen, 240, 480),
    phosphorus: classifyNutrient(phosphorus, 11, 25),
    potassium: classifyNutrient(potassium, 110, 280),
    organicMatter: organicMatter < 0.5 ? 'Low' : organicMatter < 0.75 ? 'Medium' : 'High',
  };

  // Fertilizer recommendations
  const fertilizers = [];
  if (nutrientClassification.nitrogen === 'Low') fertilizers.push('Urea (46-0-0) — 50-60 kg/acre');
  else if (nutrientClassification.nitrogen === 'Medium') fertilizers.push('Urea — 30-40 kg/acre');

  if (nutrientClassification.phosphorus === 'Low') fertilizers.push('DAP (18-46-0) — 50 kg/acre');
  else if (nutrientClassification.phosphorus === 'Medium') fertilizers.push('SSP (0-16-0) — 25-30 kg/acre');

  if (nutrientClassification.potassium === 'Low') fertilizers.push('MOP (0-0-60) — 40-50 kg/acre');
  else if (nutrientClassification.potassium === 'Medium') fertilizers.push('MOP — 20-30 kg/acre');

  if (ph < 5.5) fertilizers.push('Apply Lime — 200-400 kg/acre to correct acidity');
  else if (ph > 8.5) fertilizers.push('Apply Gypsum — 200-300 kg/acre to correct alkalinity');

  if (nutrientClassification.organicMatter === 'Low') fertilizers.push('Apply FYM (Farm Yard Manure) — 5-8 tonnes/acre');

  // Suitable crops
  const crops = [];
  if (ph >= 6.0 && ph <= 7.5) crops.push('Rice', 'Wheat', 'Maize', 'Tomato', 'Potato');
  else if (ph >= 5.5 && ph < 6.0) crops.push('Tea', 'Potato', 'Sweet Potato', 'Pineapple');
  else if (ph > 7.5 && ph <= 8.5) crops.push('Cotton', 'Sugarcane', 'Barley', 'Chickpea');
  else crops.push('Consult local agricultural officer for specific recommendations');

  if (potassium > 280) crops.push('Banana', 'Sugarcane');
  if (nitrogen > 480) crops.push('Leafy Vegetables', 'Cabbage', 'Spinach');

  // Suitability percentage
  let score = 0;
  if (ph >= 6.0 && ph <= 7.5) score += 30;
  else if (ph >= 5.5 && ph <= 8.0) score += 20;
  else score += 5;

  if (nutrientClassification.nitrogen !== 'Low') score += 20;
  else score += 5;

  if (nutrientClassification.phosphorus !== 'Low') score += 20;
  else score += 5;

  if (nutrientClassification.potassium !== 'Low') score += 15;
  else score += 5;

  if (nutrientClassification.organicMatter !== 'Low') score += 15;
  else score += 5;

  return {
    phStatus,
    nutrientClassification,
    fertilizers: fertilizers.join('; '),
    crops: [...new Set(crops)],
    suitabilityPct: Math.min(score, 100),
  };
};
