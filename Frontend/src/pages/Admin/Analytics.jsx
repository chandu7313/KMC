import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, Map, Sprout, DollarSign } from "lucide-react";

const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Analytics = () => {
    const { backendUrl } = useContext(AppContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/admin/analytics`);
            if (data.success) {
                setData(data.analytics);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading) return <div className="p-10 text-center text-slate-500">Generating analytics...</div>;
    if (!data) return <div className="p-10 text-center text-red-500">Failed to load analytics data.</div>;

    // Transform data for charts
    const growthData = data.farmerGrowth.map(item => ({
        name: monthNames[item._id],
        farmers: item.count
    }));

    const cropData = data.cropDistribution.map(item => ({
        name: item._id,
        value: item.count
    }));

    const districtData = data.districtDistribution.map(item => ({
        name: item._id,
        count: item.count
    }));

    const revenueData = data.revenueTrend.map(item => ({
        name: monthNames[item._id],
        amount: item.total
    }));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Advanced Analytics</h2>
                <button 
                    onClick={fetchAnalytics}
                    className="text-sm text-green-600 font-semibold hover:underline"
                >
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Farmer Growth Line Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={20} className="text-blue-500" />
                        <h3 className="font-bold text-slate-700">Monthly Farmer Growth</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="farmers" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFarmers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Trend Line Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign size={20} className="text-emerald-500" />
                        <h3 className="font-bold text-slate-700">Revenue Trend (₹)</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* District Distribution Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Map size={20} className="text-orange-500" />
                        <h3 className="font-bold text-slate-700">District Distribution</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={districtData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={80} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Crop Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Sprout size={20} className="text-green-600" />
                        <h3 className="font-bold text-slate-700">Crop Distribution</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={cropData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {cropData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
