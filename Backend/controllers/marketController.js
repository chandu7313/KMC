import { MarketPrice } from '../models/index.js';
import { syncMandiData } from "../services/marketSyncService.js";
import { getTrend, getRecommendation } from "../services/marketAnalyticsService.js";
import { clearMarketCache } from "../middleware/marketMiddleware.js";
import { Op } from 'sequelize';

// Get all market prices with filtering
export const getMarketPrices = async (req, res) => {
    try {
        const { crop, district } = req.query;
        let where = {};

        if (crop) where.cropName = { [Op.iLike]: `%${crop}%` };
        if (district) where.district = { [Op.iLike]: `%${district}%` };

        const prices = await MarketPrice.findAll({
            where,
            order: [['arrivalDate', 'DESC']]
        });

        res.json({ success: true, prices });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add new market price
export const addMarketPrice = async (req, res) => {
    try {
        const { cropName, variety, district, mandi, unit, price, minPrice, maxPrice, arrivalDate } = req.body;

        const newPrice = await MarketPrice.create({
            cropName,
            variety,
            district,
            mandi,
            modalPrice: price,
            minPrice,
            maxPrice,
            arrivalDate: arrivalDate || new Date()
        });

        // Invalidate cache for this crop
        clearMarketCache(cropName);

        res.json({ success: true, message: "Market price added successfully", price: newPrice });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update market price
export const updateMarketPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Define valid fields to update
        const dbUpdate = {};
        if (updateData.cropName !== undefined) dbUpdate.cropName = updateData.cropName;
        if (updateData.variety !== undefined) dbUpdate.variety = updateData.variety;
        if (updateData.district !== undefined) dbUpdate.district = updateData.district;
        if (updateData.mandi !== undefined) dbUpdate.mandi = updateData.mandi;
        if (updateData.minPrice !== undefined) dbUpdate.minPrice = updateData.minPrice;
        if (updateData.maxPrice !== undefined) dbUpdate.maxPrice = updateData.maxPrice;
        if (updateData.modalPrice !== undefined) dbUpdate.modalPrice = updateData.modalPrice;
        if (updateData.arrivalDate !== undefined) dbUpdate.arrivalDate = updateData.arrivalDate;

        const marketPrice = await MarketPrice.findByPk(id);

        if (!marketPrice) {
            return res.json({ success: false, message: "Market price not found" });
        }

        await marketPrice.update(dbUpdate);

        // Invalidate cache for this crop
        clearMarketCache(marketPrice.cropName);

        res.json({ success: true, message: "Market price updated successfully", price: marketPrice });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete market price
export const deleteMarketPrice = async (req, res) => {
    try {
        const { id } = req.params;

        // Get crop name first for cache invalidation
        const existing = await MarketPrice.findByPk(id, { attributes: ['cropName'] });

        if (!existing) {
            return res.json({ success: false, message: "Market price not found" });
        }

        await existing.destroy();

        clearMarketCache(existing.cropName);

        res.json({ success: true, message: "Market price deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Sync market data (Simulation)
export const syncMarketData = async (req, res) => {
    try {
        const result = await syncMandiData();
        res.json(result);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Price Trends and Recommendation
export const getMarketAnalytics = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const trendData = await getTrend(crop, district);
        const recommendation = getRecommendation(trendData);

        res.json({
            success: true,
            crop,
            district,
            trends: trendData.success ? trendData : null,
            recommendation
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get District Comparison for a Crop
export const getCropComparison = async (req, res) => {
    try {
        const { crop } = req.params;
        const prices = await MarketPrice.findAll({
            where: { cropName: crop },
            order: [['modalPrice', 'DESC']]
        });
        
        res.json({ success: true, prices });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/market/realtime?crop=Rice&district=Gadwal
export const getRealTimePrice = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const priceData = await MarketPrice.findOne({
            where: {
                cropName: { [Op.iLike]: `%${crop}%` },
                district: { [Op.iLike]: `%${district}%` }
            },
            order: [['arrivalDate', 'DESC']]
        });

        if (!priceData) {
            return res.json({ success: false, message: "No real-time data found for this combination" });
        }

        res.json({ success: true, data: priceData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/market/trend?crop=Rice&district=Gadwal
export const getMarketTrend = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const trendData = await getTrend(crop, district);
        res.json(trendData);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/market/recommendation?crop=Rice&district=Gadwal
export const getAdvisoryRecommendation = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const trendData = await getTrend(crop, district);
        const recommendation = getRecommendation(trendData);

        res.json({
            success: true,
            crop,
            district,
            ...recommendation
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
