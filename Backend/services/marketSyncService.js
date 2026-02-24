import axios from "axios";
import MarketPrice from "../models/MarketPrice.js";
import MarketHistory from "../models/marketHistoryModel.js";

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const DATA_GOV_RESOURCE_ID = process.env.DATA_GOV_RESOURCE_ID;

/**
 * Fetches real-time market data from data.gov.in (Agmarknet)
 * Filters for a specific state and upserts into MongoDB
 */
export const syncMandiData = async () => {
    try {
        if (!DATA_GOV_API_KEY || !DATA_GOV_RESOURCE_ID) {
            console.warn("Missing DATA_GOV API credentials. Skipping real sync.");
            return { success: false, message: "API credentials missing" };
        }

        console.log("--- Starting Mandi Data Sync ---");

        // Fetch data from Data.gov.in
        // format=json, limit=1000 (adjust as needed)
        const url = `https://api.data.gov.in/resource/x?api-key=${DATA_GOV_API_KEY}&format=json&limit=1000`;

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

            // 1. Update/Insert current MarketPrice
            await MarketPrice.findOneAndUpdate(
                {
                    cropName: commodity,
                    district,
                    mandi: market,
                    arrivalDate
                },
                {
                    variety: variety || 'Standard',
                    minPrice: parseInt(min_price),
                    maxPrice: parseInt(max_price),
                    modalPrice: parseInt(modal_price),
                    source: "agmarknet"
                },
                { upsert: true, new: true }
            );

            // 2. Also update MarketHistory for analytics
            // (Only if it's the latest data for that day/crop/district)
            await MarketHistory.findOneAndUpdate(
                {
                    crop: commodity,
                    district,
                    date: {
                        $gte: new Date(arrivalDate).setHours(0, 0, 0, 0),
                        $lt: new Date(arrivalDate).setHours(23, 59, 59, 999)
                    }
                },
                { price: parseInt(modal_price) },
                { upsert: true }
            );

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
