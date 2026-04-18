import { MarketHistory } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Fetch last 30 days data and calculate averages and trends
 */
export const getTrend = async (crop, district) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const history = await MarketHistory.findAll({
            where: {
                crop: crop,
                district: district,
                date: { [Op.gte]: thirtyDaysAgo }
            },
            order: [['date', 'ASC']]
        });

        if (!history || history.length === 0) {
            return {
                success: false,
                message: "No historical data found for this crop and district"
            };
        }

        const prices = history.map(h => Number(h.price));
        const lastPrice = prices[prices.length - 1];

        // 7-day average
        const last7Days = prices.slice(-7);
        const avg7 = last7Days.reduce((a, b) => a + b, 0) / last7Days.length;

        // 30-day average
        const avg30 = prices.reduce((a, b) => a + b, 0) / prices.length;

        // Percentage change (Last Price vs Start of 30-day window)
        const startPrice = prices[0];
        const pctChange = ((lastPrice - startPrice) / startPrice) * 100;

        // Determine trend
        let trend = "Stable";
        const threshold = 0.02; // 2% threshold
        const ratio = avg7 / avg30;

        if (ratio > 1 + threshold) trend = "Up";
        else if (ratio < 1 - threshold) trend = "Down";

        return {
            success: true,
            crop,
            district,
            currentPrice: lastPrice,
            avg7: Math.round(avg7),
            avg30: Math.round(avg30),
            pctChange: parseFloat(pctChange.toFixed(2)),
            trend,
            dataPoints: history.length
        };
    } catch (error) {
        console.error("Get Trend Error:", error);
        throw error;
    }
};

/**
 * Provide recommendation based on trend data
 */
export const getRecommendation = (trendData) => {
    if (!trendData || !trendData.success) return { recommendation: "Monitor", reason: "Insufficient data" };

    const { trend, pctChange } = trendData;

    let recommendation = "Monitor";
    let reason = "Market is stable. Observe for stronger signals before selling.";

    if (trend === "Up" || pctChange > 5) {
        recommendation = "Hold";
        reason = "Prices are on a rising trend. Holding for 3-5 more days could yield better profits.";
    } else if (trend === "Down" || pctChange < -5) {
        recommendation = "Sell Now";
        reason = "Prices are currently falling. Selling now will safeguard you against further decline.";
    }

    return {
        recommendation,
        reason,
        confidence: trendData.dataPoints > 10 ? "High" : "Moderate"
    };
};
