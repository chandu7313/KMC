import { CloudSun, CloudRain, Sun, Wind } from "lucide-react";
import Navbar from '@/app/layouts/Navbar';

const weatherInsights = [
  {
    condition: "Sunny & Dry",
    icon: <Sun className="text-yellow-500" size={28} />,
    advice: "Increase irrigation frequency. Mulching recommended to retain soil moisture.",
    crops: "Best for: Cotton, Groundnut, Millets",
  },
  {
    condition: "Rainy / High Humidity",
    icon: <CloudRain className="text-blue-500" size={28} />,
    advice: "Monitor fungal infections. Ensure proper drainage to prevent root rot.",
    crops: "Suitable for: Paddy, Sugarcane",
  },
  {
    condition: "Cloudy & Mild",
    icon: <CloudSun className="text-gray-600" size={28} />,
    advice: "Ideal for transplanting seedlings. Apply balanced fertilizers.",
    crops: "Good for: Vegetables, Pulses",
  },
  {
    condition: "Windy Conditions",
    icon: <Wind className="text-green-600" size={28} />,
    advice: "Secure young plants. Avoid spraying pesticides during high wind.",
    crops: "Protect: Banana, Maize",
  },
];

const WeatherInsights = () => {
  return (
    <>
    <Navbar/>
    <section className="bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6">

      <div className="max-w-6xl mx-auto mb-14 text-center">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-4">
          Weather-Based Crop Advisory
        </h2>
        <p className="text-lg text-slate-600">
          Smart recommendations based on current weather conditions.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {weatherInsights.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">
              {item.condition}
            </h3>
            <p className="text-slate-600 text-sm mb-3">
              {item.advice}
            </p>
            <p className="text-green-700 text-sm font-medium">
              {item.crops}
            </p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default WeatherInsights;
