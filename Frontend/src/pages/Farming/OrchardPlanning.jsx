
import { useState } from "react";
import Navbar from "../../components/Navbar";

const OrchardPlanning = () => {
  const [landSize, setLandSize] = useState("");
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState(null);

  const cropData = {
    Mango: { spacing: 10, yieldPerAcre: 4000, costPerAcre: 60000 },
    Guava: { spacing: 6, yieldPerAcre: 3000, costPerAcre: 45000 },
    Pomegranate: { spacing: 5, yieldPerAcre: 5000, costPerAcre: 70000 },
  };

  const calculatePlan = () => {
    if (!landSize || !crop) return;

    const acres = parseFloat(landSize);
    const data = cropData[crop];

    const treesPerAcre = Math.floor(4047 / (data.spacing * data.spacing));
    const totalTrees = treesPerAcre * acres;
    const estimatedYield = data.yieldPerAcre * acres;
    const estimatedCost = data.costPerAcre * acres;

    setResult({
      totalTrees,
      estimatedYield,
      estimatedCost,
    });
  };

  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-4">
          Smart Orchard Planning
        </h2>
        <p className="text-lg text-slate-600">
          Plan your orchard scientifically to maximize productivity and profitability.
        </p>
      </div>

      {/* Planner Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-slate-100 p-10">

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Land Size (in acres)
            </label>
            <input
              type="number"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              placeholder="Enter land size"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Select Crop
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
            >
              <option value="">Choose crop</option>
              {Object.keys(cropData).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculatePlan}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Generate Orchard Plan
        </button>

        {/* Results */}
        {result && (
          <div className="mt-10 bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-xl font-semibold mb-4 text-green-800">
              Estimated Orchard Plan
            </h3>

            <div className="space-y-3 text-slate-700">
              <p>
                🌳 Total Trees Required:{" "}
                <span className="font-semibold">
                  {result.totalTrees}
                </span>
              </p>
              <p>
                📦 Estimated Annual Yield:{" "}
                <span className="font-semibold">
                  {result.estimatedYield} kg
                </span>
              </p>
              <p>
                💰 Estimated Initial Investment:{" "}
                <span className="font-semibold">
                  ₹{result.estimatedCost}
                </span>
              </p>
            </div>

            <button className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
              Book Expert Consultation
            </button>
          </div>
        )}

      </div>
    </section>
    </>
  );
};

export default OrchardPlanning;
