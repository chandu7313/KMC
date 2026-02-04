import { RefreshCcw, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const marketData = [
  { crop: "Cotton", variety: "J-34", district: "Rajkot", unit: "Quintal", price: 6200, change: 3.8 },
  { crop: "Cotton", variety: "Shankar-6", district: "Nagpur", unit: "Quintal", price: 6050, change: 2.1 },
  { crop: "Groundnut", variety: "TG-37A", district: "Junagadh", unit: "Quintal", price: 5800, change: 2.1 },
  { crop: "Maize", variety: "Yellow", district: "Davangere", unit: "Quintal", price: 2100, change: -0.8 },
  { crop: "Mustard", variety: "RH-30", district: "Alwar", unit: "Quintal", price: 5200, change: 4.2 },
  { crop: "Pulses", variety: "Chana", district: "Latur", unit: "Quintal", price: 4800, change: 1.2 },
  { crop: "Rice", variety: "Sona Masoori", district: "Guntur", unit: "Quintal", price: 3200, change: 0.5 },
  { crop: "Rice", variety: "Basmati", district: "Karnal", unit: "Quintal", price: 3800, change: -1.2 },
  { crop: "Soybean", variety: "JS-9560", district: "Dewas", unit: "Quintal", price: 4100, change: 0 },
  { crop: "Sugarcane", variety: "Co-0238", district: "Muzaffarnagar", unit: "Quintal", price: 350, change: 1.5 },
  { crop: "Wheat", variety: "Sharbati", district: "Indore", unit: "Quintal", price: 2450, change: 2.5 },
];

const MarketPrices = () => {
  const [search, setSearch] = useState("");

  const filtered = marketData.filter((item) =>
    item.crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white min-h-screen py-20 px-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-6xl font-serif font-bold text-[#1f2d1f] mb-4">
          Market Prices
        </h2>
        <p className="text-lg text-slate-600">
          Real-time mandi prices updated daily. Last updated: 4 Feb 2026, 3:04 pm
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4 mb-10">
        <input
          type="text"
          placeholder="Search crops, variety, or district..."
          className="flex-1 min-w-[250px] border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="border border-slate-200 rounded-xl px-4 py-3 outline-none">
          <option>All Crops</option>
        </select>

        <select className="border border-slate-200 rounded-xl px-4 py-3 outline-none">
          <option>All Districts</option>
        </select>

        <button className="flex items-center gap-2 border-2 border-green-700 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-700 hover:text-white transition">
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">

          <thead className="bg-[#f8f6ed] text-slate-700 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">Crop</th>
              <th className="px-6 py-4">Variety</th>
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Unit</th>
              <th className="px-6 py-4">Price (₹)</th>
              <th className="px-6 py-4">Change</th>
              <th className="px-6 py-4">Last Updated</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.map((item, index) => (
              <tr key={index} className="hover:bg-[#faf9f3] transition">
                <td className="px-6 py-4 font-medium">{item.crop}</td>
                <td className="px-6 py-4">{item.variety}</td>
                <td className="px-6 py-4">{item.district}</td>
                <td className="px-6 py-4">{item.unit}</td>
                <td className="px-6 py-4 font-semibold">
                  ₹{item.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {item.change > 0 && (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <ArrowUp size={14} /> {item.change}%
                    </span>
                  )}
                  {item.change < 0 && (
                    <span className="flex items-center gap-1 text-red-600 font-semibold">
                      <ArrowDown size={14} /> {Math.abs(item.change)}%
                    </span>
                  )}
                  {item.change === 0 && (
                    <span className="text-slate-500 font-semibold">0%</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  3/2/2026
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </section>
    <Footer/>
    </>
  );
};

export default MarketPrices;
