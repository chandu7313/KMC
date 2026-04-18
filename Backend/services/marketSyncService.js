import axios from "axios";
import { MarketPrice, MarketHistory } from '../models/index.js';
import { Op } from 'sequelize';

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const DATA_GOV_RESOURCE_ID = process.env.DATA_GOV_RESOURCE_ID;

/**
 * Fetches real-time market data from data.gov.in (Agmarknet)
 * Filters for a specific state and upserts into Supabase
 */
export const syncMandiData = async () => {
    try {
        if (!DATA_GOV_API_KEY || !DATA_GOV_RESOURCE_ID) {
            console.warn("Missing DATA_GOV API credentials. Skipping real sync.");
            return { success: false, message: "API credentials missing" };
        }

        console.log("--- Starting Mandi Data Sync ---");

        // Fetch data from Data.gov.in
        const url = `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}?api-key=${DATA_GOV_API_KEY}&format=json&limit=1000`;

        const response = await axios.get(url);

        if (!response.data || !response.data.records) {
            throw new Error("Invalid API response structure");
        }

        const records = response.data.records;
        const filteredRecords = records.filter(r => r.state === "Telangana"); // Example state filter

        console.log(`Fetched ${records.length} records. Filtered to ${filteredRecords.length} for Telangana.`);

        let updatedCount = 0;

        for (const record of filteredRecords) {
            const {
                commodity,
                district,
                market,
                min_price,
                max_price,
                modal_price,
                arrival_date,
                variety
            } = record;

            // Parse arrival date (expected DD/MM/YYYY)
            const [day, month, year] = arrival_date.split('/');
            const arrivalDate = new Date(`${year}-${month}-${day}`);

            // 1. Update/Insert current MarketPrice (upsert by crop+district+mandi+date)
            // First check if exists
            const existing = await MarketPrice.findOne({
                where: {
                    cropName: commodity,
                    district: district,
                    mandi: market,
                    arrivalDate: arrivalDate
                }
            });

            if (existing) {
                await existing.update({
                    variety: variety || 'Standard',
                    minPrice: parseInt(min_price),
                    maxPrice: parseInt(max_price),
                    modalPrice: parseInt(modal_price),
                    source: "agmarknet"
                });
            } else {
                await MarketPrice.create({
                    cropName: commodity,
                    district,
                    mandi: market,
                    arrivalDate: arrivalDate,
                    variety: variety || 'Standard',
                    minPrice: parseInt(min_price),
                    maxPrice: parseInt(max_price),
                    modalPrice: parseInt(modal_price),
                    source: "agmarknet"
                });
            }

            // 2. Also update MarketHistory for analytics
            const dayStart = new Date(arrivalDate);
            dayStart.setHours(0, 0, 0, 0);

            const existingHistory = await MarketHistory.findOne({
                where: {
                    crop: commodity,
                    district: district,
                    date: dayStart
                }
            });

            if (existingHistory) {
                await existingHistory.update({
                    price: parseInt(modal_price)
                });
            } else {
                await MarketHistory.create({
                    crop: commodity,
                    district,
                    date: dayStart,
                    price: parseInt(modal_price)
                });
            }

            updatedCount++;
        }

        console.log(`Successfully synced ${updatedCount} records.`);
        return {
            success: true,
            message: `Mandi data synced successfully. Processed ${updatedCount} records.`,
            count: updatedCount
        };

    } catch (error) {
        console.error("Mandi Sync Error:", error.message);
        return {
            success: false,
            message: error.message
        };
    }
};
