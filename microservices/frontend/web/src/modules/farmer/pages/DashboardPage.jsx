import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore } from '@/app/store/globalStore';
import {
  Stethoscope,
  FlaskConical,
  TrendingUp,
  ShoppingBag,
  HeadphonesIcon,
  CloudSun,
  Package,
  Landmark,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ChevronRight,
  Droplets,
  Thermometer,
  Wind,
  Sprout,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  MapPin,
  Calendar,
  Zap,
  Star,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────
const quickLinks = [
  { id: 'crop-doctor', label: 'Crop Doctor', icon: Stethoscope, path: '/crop-doctor', color: 'bg-rose-500', light: 'bg-rose-50 text-rose-600', desc: 'Diagnose diseases' },
  { id: 'soil-test', label: 'Soil Testing', icon: FlaskConical, path: '/soil-crop-analysis', color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600', desc: 'Test your soil' },
  { id: 'market-prices', label: 'Market Prices', icon: TrendingUp, path: '/market-prices', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600', desc: 'Live mandi rates' },
  { id: 'agri-shop', label: 'Agri Shop', icon: ShoppingBag, path: '/marketplace', color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600', desc: 'Buy inputs' },
  { id: 'expert-help', label: 'Expert Help', icon: HeadphonesIcon, path: '/expert-consultations', color: 'bg-teal-500', light: 'bg-teal-50 text-teal-600', desc: 'Talk to experts' },
  { id: 'weather', label: 'Weather', icon: CloudSun, path: '/whether-insights', color: 'bg-sky-500', light: 'bg-sky-50 text-sky-600', desc: '7-day forecast' },
  { id: 'my-orders', label: 'My Orders', icon: Package, path: '/my-orders', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600', desc: 'Track orders' },
  { id: 'govt-schemes', label: 'Govt. Schemes', icon: Landmark, path: '/government-schemes', color: 'bg-green-600', light: 'bg-green-50 text-green-700', desc: 'PM KISAN & more' },
];

const marketPrices = [
  { crop: 'Wheat', price: '₹2,450', change: '+₹120', dir: 'up', market: 'Ludhiana' },
  { crop: 'Cotton', price: '₹6,400', change: '+₹240', dir: 'up', market: 'Bathinda' },
  { crop: 'Rice', price: '₹2,100', change: '-₹50', dir: 'down', market: 'Amritsar' },
  { crop: 'Maize', price: '₹1,960', change: '+₹80', dir: 'up', market: 'Patiala' },
  { crop: 'Soybean', price: '₹4,800', change: '-₹30', dir: 'down', market: 'Jalandhar' },
];

const alerts = [
  { id: 1, type: 'warning', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 border-amber-200', title: 'Pest Alert', desc: 'Pink bollworm risk high in your zone. Apply pesticide before Sunday.', time: '2h ago' },
  { id: 2, type: 'success', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', title: 'Order Shipped', desc: 'Your fertilizer order #KMC-4821 is out for delivery. ETA: Tomorrow.', time: '5h ago' },
  { id: 3, type: 'info', icon: Info, color: 'text-blue-500 bg-blue-50 border-blue-200', title: 'Soil Test Due', desc: 'Your scheduled soil test is due next week. Book a sample pickup now.', time: '1d ago' },
];

const cropTimeline = [
  { stage: 'Sowing', date: 'Oct 5', done: true },
  { stage: 'Germination', date: 'Oct 18', done: true },
  { stage: 'Vegetative', date: 'Nov 10', done: false, current: true },
  { stage: 'Flowering', date: 'Dec 5', done: false },
  { stage: 'Harvest', date: 'Jan 20', done: false },
];

const tips = [
  'Water your wheat crop in the early morning to reduce evaporation by up to 30%.',
  'Apply neem-based pesticides this week to protect against pink bollworm.',
  'Check your soil pH before the next fertilizer cycle for best results.',
  'Consider intercropping with legumes to boost soil nitrogen naturally.',
];

// ─── Sub-components ──────────────────────────────────────────────

const WeatherWidget = ({ district }) => (
  <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-sky-200">
    <div className="flex items-center justify-between mb-3">
      <div>
        <p className="text-sky-200 text-xs font-semibold uppercase tracking-wider">Today's Weather</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={11} className="text-sky-300" />
          <p className="text-sky-200 text-xs">{district || 'Ludhiana'}, Punjab</p>
        </div>
      </div>
      <CloudSun size={36} className="text-yellow-300" />
    </div>
    <div className="flex items-end gap-3">
      <span className="text-5xl font-black">28°</span>
      <div className="pb-1">
        <p className="text-sky-100 font-semibold text-sm">Partly Cloudy</p>
        <p className="text-sky-300 text-xs">Feels like 31°C</p>
      </div>
    </div>
    <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
      <div className="flex items-center gap-1.5 text-sky-100 text-xs font-medium">
        <Droplets size={13} className="text-sky-300" />
        Humidity 65%
      </div>
      <div className="flex items-center gap-1.5 text-sky-100 text-xs font-medium">
        <Wind size={13} className="text-sky-300" />
        Wind 12 km/h
      </div>
      <div className="flex items-center gap-1.5 text-sky-100 text-xs font-medium">
        <Thermometer size={13} className="text-sky-300" />
        Low 19°C
      </div>
    </div>
  </div>
);

const FarmStatusWidget = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-slate-800 text-sm">My Farm Status</h3>
      <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase">Wheat • Season 2</span>
    </div>
    {/* Soil Health */}
    <div className="space-y-3 mb-5">
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1"><Droplets size={12} className="text-blue-400" />Soil Moisture</span>
          <span className="text-blue-600">72%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: '72%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1"><Sprout size={12} className="text-green-500" />Crop Health</span>
          <span className="text-green-600">Good</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '85%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1"><Zap size={12} className="text-amber-500" />Nutrient Level</span>
          <span className="text-amber-600">Medium</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" style={{ width: '58%' }} />
        </div>
      </div>
    </div>
    {/* Crop Stage Timeline */}
    <div className="border-t border-slate-100 pt-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Crop Stage</p>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
        <div className="space-y-3">
          {cropTimeline.map((stage, i) => (
            <div key={i} className="flex items-center gap-3 relative pl-7">
              <div className={`absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10 ${
                stage.done
                  ? 'bg-[#186036] border-[#186036] text-white'
                  : stage.current
                  ? 'bg-white border-[#186036] text-[#186036] shadow-md shadow-green-200'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {stage.done ? '✓' : i + 1}
              </div>
              <div className="flex-1 flex justify-between items-center">
                <span className={`text-xs font-semibold ${stage.current ? 'text-[#186036]' : stage.done ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stage.stage} {stage.current && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full ml-1">Now</span>}
                </span>
                <span className="text-[10px] text-slate-400">{stage.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MarketWidget = ({ navigate }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-slate-800 text-sm">Today's Prices</h3>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      </div>
      <button
        onClick={() => navigate('/market-prices')}
        className="text-xs text-[#186036] font-bold flex items-center gap-0.5 hover:underline"
      >
        View All <ChevronRight size={13} />
      </button>
    </div>
    <div className="divide-y divide-slate-50">
      {marketPrices.map((item, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-800">{item.crop}</p>
            <p className="text-[10px] text-slate-400">{item.market} Mandi</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-slate-900">{item.price}<span className="text-xs text-slate-400 font-medium">/qtl</span></p>
            <div className={`flex items-center gap-0.5 justify-end text-[10px] font-bold ${item.dir === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {item.dir === 'up' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {item.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AlertsWidget = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
      <div className="flex items-center gap-2">
        <Bell size={15} className="text-slate-600" />
        <h3 className="font-bold text-slate-800 text-sm">Alerts & Actions</h3>
      </div>
      <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">3 New</span>
    </div>
    <div className="divide-y divide-slate-50">
      {alerts.map((alert) => (
        <div key={alert.id} className={`flex gap-3 px-5 py-3.5 border-l-4 ${alert.color}`}>
          <alert.icon size={17} className={alert.color.split(' ')[0]} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-800">{alert.title}</p>
              <span className="text-[10px] text-slate-400 shrink-0">{alert.time}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{alert.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DailyTip = ({ tip }) => (
  <div className="bg-gradient-to-br from-[#1f2d1f] to-[#2d4a2d] rounded-2xl p-5 flex gap-4 items-start shadow-lg">
    <div className="w-10 h-10 bg-[#8ceb78]/20 rounded-xl flex items-center justify-center shrink-0">
      <Star size={18} className="text-[#8ceb78]" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-[#8ceb78] uppercase tracking-widest mb-1">KMC Daily Tip</p>
      <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
    </div>
  </div>
);

const SubsidyBanner = ({ navigate }) => (
  <div
    onClick={() => navigate('/government-schemes')}
    className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-lg hover:shadow-amber-200 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <Landmark size={20} className="text-white" />
      </div>
      <div>
        <p className="text-white font-bold text-sm">PM-KISAN Subsidy</p>
        <p className="text-white/80 text-xs">Next installment in 12 days</p>
      </div>
    </div>
    <ChevronRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
  </div>
);

// ─── Main Dashboard Page ─────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const { userData } = useGlobalStore();
  const [tipIndex] = useState(Math.floor(Math.random() * tips.length));
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Farmer';

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#186036] to-[#1f2d1f] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -right-4 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-green-300 text-sm font-semibold">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5">{firstName} Ji 🌾</h1>
            <p className="text-white/60 text-sm mt-1.5 max-w-sm">
              Your farm is in good condition today. Wheat is in vegetative stage — check the soil moisture!
            </p>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2.5 rounded-xl">
              <Calendar size={15} className="text-green-300" />
              <span className="text-sm font-semibold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <button
              onClick={() => navigate('/soil-crop-analysis')}
              className="bg-[#8ceb78] hover:bg-[#7ddc6a] active:scale-95 text-[#1f2d1f] px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md whitespace-nowrap"
            >
              + New Report
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Links Grid ────────────────────────────── */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              id={`quick-link-${link.id}`}
              onClick={() => navigate(link.path)}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${link.light} group-hover:scale-110 transition-transform`}>
                <link.icon size={20} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Tip */}
          <DailyTip tip={tips[tipIndex]} />

          {/* Market Prices */}
          <MarketWidget navigate={navigate} />

          {/* Alerts & Actions */}
          <AlertsWidget />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather */}
          <WeatherWidget district={userData?.district} />

          {/* PM KISAN Banner */}
          <SubsidyBanner navigate={navigate} />

          {/* Farm Status */}
          <FarmStatusWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
