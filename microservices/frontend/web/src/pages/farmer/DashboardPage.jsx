import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Sun, 
    Thermometer,
    FlaskConical,
    Store,
    ShoppingBag,
    Headphones,
    CloudSun,
    Megaphone,
    ChevronRight,
    Mountain,
    Activity,
    Truck,
    LayoutGrid,
    Users,
    FileText,
    TrendingUp,
    Sprout,
    AlertCircle,
    RotateCw,
    Bug,
    CloudRain
} from 'lucide-react';
import { useFarmerDashboard } from '../../features/farmer-dashboard/hooks/useFarmerDashboard';

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const { dashboard, marketPrices, isLoading, isError, error, refetch, markAlertRead, markAllRead } = useFarmerDashboard();

    if (isLoading) {
        return (
            <div className="bg-[#f9fafb] min-h-screen pb-24 md:pb-8 font-sans w-full max-w-2xl mx-auto xl:max-w-7xl animate-pulse">
                <div className="px-4 pt-4 md:px-8 md:pt-8 space-y-6">
                    <div className="bg-slate-300 rounded-2xl h-40 w-full"></div>
                    <div className="space-y-3">
                        <div className="h-6 bg-slate-300 rounded w-1/4"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-slate-300 rounded-xl"></div>)}
                        </div>
                    </div>
                    <div className="h-16 bg-slate-300 rounded-xl w-full"></div>
                    <div className="space-y-3">
                        <div className="h-6 bg-slate-300 rounded w-1/3"></div>
                        <div className="flex gap-4">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-28 w-[140px] bg-slate-300 rounded-xl shrink-0"></div>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-[#f9fafb] min-h-screen font-sans w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8">
                <AlertCircle size={48} className="text-rose-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Unavailable</h2>
                <p className="text-sm text-slate-500 text-center mb-6">{error?.message || 'Failed to load dashboard data.'}</p>
                <button onClick={refetch} className="flex items-center gap-2 bg-[#16a34a] text-white px-6 py-2 rounded-lg font-bold">
                    <RotateCw size={18} /> Retry
                </button>
            </div>
        );
    }

    const d = dashboard || {};
    const farmer = d.farmer || {};
    const greeting = d.greeting || {};
    const weather = d.weather || null;
    const season = d.activeSeason;
    const status = d.farmStatus;
    const alerts = d.alerts?.items || [];
    const schemes = d.schemes || [];

    const getAlertIcon = (type) => {
        switch(type) {
            case 'pest': return <Bug size={18} />;
            case 'weather': return <CloudRain size={18} />;
            case 'order': return <Truck size={18} />;
            default: return <Activity size={18} />;
        }
    };

    return (
        <div className="bg-[#f9fafb] min-h-screen pb-24 md:pb-8 font-sans w-full max-w-2xl mx-auto xl:max-w-7xl">
            <div className="px-4 pt-4 md:px-8 md:pt-8 space-y-6">
                
                {/* ─── GREEN HERO BANNER ────────────────────────── */}
                <div className="bg-[#185824] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl md:text-2xl font-bold">Good {greeting.timeOfDay}, {farmer.name?.split(' ')[0] || 'Farmer'} ji</h2>
                            <Sprout size={20} className="text-yellow-400" />
                        </div>

                        {/* Weather Card */}
                        {weather ? (
                            <div className="bg-[#246b32] rounded-xl p-4 mb-4 flex items-center gap-4 border border-white/10 shadow-inner">
                                {weather.icon && <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather" className="w-12 h-12" />}
                                {!weather.icon && <Sun size={32} className="text-yellow-400" />}
                                <div>
                                    <div className="text-2xl font-bold leading-none mb-1">{weather.temperature}°C</div>
                                    <div className="text-xs text-white/80 font-medium capitalize">{weather.condition} • {weather.humidity}% Humidity</div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#246b32] rounded-xl p-4 mb-4 flex items-center gap-4 border border-white/10 shadow-inner">
                                <CloudSun size={32} className="text-white/50" />
                                <div>
                                    <div className="text-sm font-bold leading-none mb-1">Weather Unavailable</div>
                                    <div className="text-xs text-white/80 font-medium">Please check connection</div>
                                </div>
                            </div>
                        )}

                        {/* Tip of the day */}
                        <div className="border-l-2 border-white pl-3 py-1">
                            <p className="text-xs md:text-sm text-white/90 font-medium italic">
                                <span className="font-bold not-italic">Tip of the day:</span> {greeting.dailyTip || greeting.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── QUICK ACTIONS ────────────────────────────── */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 px-1">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                        {/* Crop Doctor */}
                        <div 
                            onClick={() => navigate('/farmer/support')} 
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-3">
                                <Activity strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Crop Doctor</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Detect Disease</p>
                        </div>

                        {/* Soil Test */}
                        <div 
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                                <FlaskConical strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Soil Test</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Check Health</p>
                        </div>

                        {/* Market Price */}
                        <div 
                            onClick={() => navigate('/market-prices')}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
                                <Store strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Market Price</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Today's Rates</p>
                        </div>

                        {/* Shop */}
                        <div 
                            onClick={() => navigate('/marketplace')}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                                <ShoppingBag strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Shop</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Buy Products</p>
                        </div>

                        {/* Expert Help */}
                        <div 
                            onClick={() => navigate('/farmer/support')}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-3">
                                <Headphones strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Expert Help</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Talk to Expert</p>
                        </div>

                        {/* Weather */}
                        <div 
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-3">
                                <CloudSun strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Weather</h4>
                            <p className="text-[10px] text-slate-500 font-medium">7 Day Forecast</p>
                        </div>
                    </div>
                </div>

                {/* ─── GOVT SUBSIDY BANNER ──────────────────────── */}
                {schemes.length > 0 && (
                    <div className="bg-[#fbbf24] rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:scale-95 transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-600 text-amber-50 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                <Megaphone size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#78350f] text-sm md:text-base">{schemes[0].name}</h4>
                                <p className="text-[11px] md:text-xs text-[#92400e] font-medium leading-tight mt-0.5">
                                    {schemes[0].daysLeft !== null ? `Next installment in ${schemes[0].daysLeft} days.` : 'Enrollment active.'}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="text-[#92400e] shrink-0 ml-2" size={20} />
                    </div>
                )}

                {/* ─── TODAY'S MANDI RATES ──────────────────────── */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-bold text-slate-800">Today's Mandi Rates</h3>
                        <span onClick={() => navigate('/market-prices')} className="text-xs font-bold text-[#16a34a] cursor-pointer">View All</span>
                    </div>
                    {marketPrices && marketPrices.length > 0 ? (
                        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            {marketPrices.map(price => (
                                <div key={price.id} className={`bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 p-4 min-w-[140px] shrink-0 ${price.change < 0 ? 'border-l-rose-500' : price.change > 0 ? 'border-l-[#16a34a]' : 'border-l-amber-400'}`}>
                                    <p className="text-xs font-medium text-slate-500 mb-1">{price.crop_name}</p>
                                    <p className="text-xl font-bold text-slate-900 mb-1">₹{price.modal_price}<span className="text-[10px] text-slate-400 font-medium">/q</span></p>
                                    <p className={`text-[10px] font-bold flex items-center gap-1 ${price.change < 0 ? 'text-rose-500' : price.change > 0 ? 'text-[#16a34a]' : 'text-slate-400'}`}>
                                        {price.change < 0 ? '↓' : price.change > 0 ? '↑' : '—'} {Math.abs(price.change)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-4 text-center border border-slate-100">
                            <p className="text-sm text-slate-500">No market prices available for your region.</p>
                        </div>
                    )}
                </div>

                {/* ─── MY FARM STATUS ─────────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center gap-2 mb-6">
                        <Mountain size={18} className="text-[#16a34a]" />
                        <h3 className="font-bold text-slate-800 text-sm">My Farm Status</h3>
                    </div>
                    
                    {season ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL AREA</p>
                                    <p className="font-bold text-slate-900 text-sm">{season.area} {season.areaUnit}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ACTIVE CROP</p>
                                    <p className="font-bold text-slate-900 text-sm">{season.cropName}</p>
                                </div>
                            </div>

                            {status ? (
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CROP HEALTH</p>
                                        <p className={`text-[11px] font-bold ${status.cropHealthScore >= 70 ? 'text-[#16a34a]' : status.cropHealthScore >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                                            {status.cropHealthScore}/100 ({status.cropHealthStatus})
                                        </p>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className={`h-2 rounded-full ${status.cropHealthScore >= 70 ? 'bg-[#166534]' : status.cropHealthScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${status.cropHealthScore}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500">No health readings yet.</p>
                                    <button className="text-xs font-bold text-[#16a34a] mt-1">Add Reading</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-sm text-slate-500 mb-2">You don't have an active crop season.</p>
                            <button className="bg-[#16a34a] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Add Crop</button>
                        </div>
                    )}
                </div>

                {/* ─── RECENT ACTIVITY ──────────────────────────── */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-bold text-slate-800">Recent Activity</h3>
                        {d.alerts?.unreadCount > 0 && (
                            <span onClick={() => markAllRead()} className="text-xs font-bold text-[#16a34a] cursor-pointer">Mark all read</span>
                        )}
                    </div>
                    
                    {alerts.length > 0 ? alerts.map(alert => (
                        <div key={alert.id} onClick={() => !alert.is_read && markAlertRead(alert.id)} className={`bg-white rounded-xl shadow-sm border ${alert.is_read ? 'border-slate-100 opacity-70' : 'border-[#16a34a]'} p-4 flex gap-4 cursor-pointer transition-opacity`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert.priority === 'urgent' ? 'bg-rose-100 text-rose-500' : alert.priority === 'high' ? 'bg-amber-100 text-amber-500' : 'bg-green-100 text-green-500'}`}>
                                {getAlertIcon(alert.alert_type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    {alert.message}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-xl p-6 text-center border border-slate-100 shadow-sm">
                            <Activity className="mx-auto text-slate-300 mb-2" size={32} />
                            <p className="text-sm text-slate-500 font-medium">No recent activity</p>
                        </div>
                    )}
                </div>

            </div>

            {/* ─── MOBILE BOTTOM NAVIGATION ─────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className="w-10 h-10 bg-[#166534] rounded-xl flex items-center justify-center text-white shadow-sm">
                        <LayoutGrid size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#166534]">Dashboard</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Users size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Portfolios</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <FileText size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Reports</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <TrendingUp size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Analytics</span>
                </div>
            </div>

        </div>
    );
};

export default FarmerDashboard;
