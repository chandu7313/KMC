import { RefreshCcw, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

const MarketPrices = () => {
  const { backendUrl } = useContext(AppContext);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [districts, setDistricts] = useState([]);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        crop: search,
        district: districtFilter === "All Districts" ? "" : districtFilter
      };
      const { data } = await axios.get(`${backendUrl}/api/market`, { params });
      if (data.success) {
        setPrices(data.prices);
        
        // Extract unique districts for the filter if not already set
        if (districts.length === 0) {
            const uniqueDistricts = [...new Set(data.prices.map(p => p.district))];
            setDistricts(uniqueDistricts);
        }
      }
    } catch (error) {
      console.error("Error fetching market prices", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, search, districtFilter, districts.length]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

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

        <select 
            className="border border-slate-200 rounded-xl px-4 py-3 outline-none"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option>All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <button 
            onClick={fetchPrices}
            className="flex items-center gap-2 border-2 border-green-700 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-700 hover:text-white transition"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
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
            {loading ? (
                <tr><td colSpan="7" className="text-center py-20 text-slate-400">Fetching latest prices...</td></tr>
            ) : prices.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-20 text-slate-400">No market data available</td></tr>
            ) : prices.map((item, index) => (
              <tr key={item._id} className="hover:bg-[#faf9f3] transition">
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
                  {new Date(item.lastUpdated).toLocaleDateString()}
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
