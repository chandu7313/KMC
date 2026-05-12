import { useState } from "react";
import Navbar from '@/app/layouts/Navbar';

const cropDatabase = [
  {
    name: "Wheat",
    soil: "Loamy",
    season: "Rabi",
    water: "Medium",
    yield: "18-22 quintals/acre",
  },
  {
    name: "Rice",
    soil: "Clay",
    season: "Kharif",
    water: "High",
    yield: "22-30 quintals/acre",
  },
  {
    name: "Cotton",
    soil: "Black",
    season: "Kharif",
    water: "Medium",
    yield: "10-15 quintals/acre",
  },
  {
    name: "Groundnut",
    soil: "Sandy",
    season: "Kharif",
    water: "Low",
    yield: "8-12 quintals/acre",
  },
];

const CropSelection = () => {
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [water, setWater] = useState("");
  const [result, setResult] = useState([]);

  const handleSearch = () => {
    const filtered = cropDatabase.filter(
      (crop) =>
        (soil ? crop.soil === soil : true) &&
        (season ? crop.season === season : true) &&
        (water ? crop.water === water : true)
    );
    setResult(filtered);
  };

  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6 min-h-screen">

      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-4">
          Smart Crop Selection
        </h2>
        <p className="text-lg text-slate-600">
          Choose crops based on your soil type, season, and water availability.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border p-8 grid md:grid-cols-3 gap-6 mb-10">

        <select
          value={soil}
          onChange={(e) => setSoil(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">Select Soil Type</option>
          <option>Loamy</option>
          <option>Clay</option>
          <option>Black</option>
          <option>Sandy</option>
        </select>

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">Select Season</option>
          <option>Rabi</option>
          <option>Kharif</option>
        </select>

        <select
          value={water}
          onChange={(e) => setWater(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">Water Availability</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="text-center mb-12">
        <button
          onClick={handleSearch}
          className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Find Suitable Crops
        </button>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {result.map((crop, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border shadow-sm p-6"
          >
            <h3 className="text-2xl font-semibold text-green-800 mb-3">
              {crop.name}
            </h3>
            <p className="text-slate-600 mb-2">
              Soil: {crop.soil}
            </p>
            <p className="text-slate-600 mb-2">
              Season: {crop.season}
            </p>
            <p className="text-slate-600 mb-2">
              Water Need: {crop.water}
            </p>
            <p className="font-semibold text-slate-800">
              Expected Yield: {crop.yield}
            </p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default CropSelection;
