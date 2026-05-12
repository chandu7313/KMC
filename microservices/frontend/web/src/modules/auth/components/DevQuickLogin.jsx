import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const roles = [
    {
        role: "super_admin",
        label: "Super Admin",
        icon: "👑",
        colorClasses: "bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700",
        ringClass: "ring-purple-300",
        description: "Full access — all modules",
    },
    {
        role: "tech_admin",
        label: "Tech Admin",
        icon: "⚙️",
        colorClasses: "bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-700",
        ringClass: "ring-slate-300",
        description: "System settings & API logs",
    },
    {
        role: "agri_expert",
        label: "Agri Expert",
        icon: "🌿",
        colorClasses: "bg-green-50 border-green-200 hover:bg-green-100 text-green-700",
        ringClass: "ring-green-300",
        description: "Soil & disease reports",
    },
    {
        role: "ecommerce_manager",
        label: "E-commerce",
        icon: "🛒",
        colorClasses: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700",
        ringClass: "ring-blue-300",
        description: "Products, orders & vendors",
    },
    {
        role: "order_manager",
        label: "Order Mgr",
        icon: "📦",
        colorClasses: "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700",
        ringClass: "ring-orange-300",
        description: "Orders & returns only",
    },
    {
        role: "support_agent",
        label: "Support",
        icon: "🎧",
        colorClasses: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100 text-cyan-700",
        ringClass: "ring-cyan-300",
        description: "Tickets & farmer support",
    },
    {
        role: "content_manager",
        label: "Content",
        icon: "✍️",
        colorClasses: "bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700",
        ringClass: "ring-pink-300",
        description: "Blogs & announcements",
    },
    {
        role: "finance_manager",
        label: "Finance",
        icon: "💰",
        colorClasses: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700",
        ringClass: "ring-amber-300",
        description: "Revenue & payment reports",
    },
    {
        role: "field_agent",
        label: "Field Agent",
        icon: "🚜",
        colorClasses: "bg-lime-50 border-lime-200 hover:bg-lime-100 text-lime-700",
        ringClass: "ring-lime-300",
        description: "Assigned farmers & delivery",
    },
];

const DevQuickLogin = () => {
    const [loadingRole, setLoadingRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

    const handleDevLogin = async (role) => {
        setLoadingRole(role);
        setError(null);
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/dev-login', { role });

            if (data.success) {
                setIsLoggedin(true);
                getUserData();
                navigate(data.user.dashboard);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Run seed script first.';
            setError(msg);
        } finally {
            setLoadingRole(null);
        }
    };

    return (
        <div className="mt-6 border-t border-dashed border-slate-200 pt-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 justify-center">
                <span className="text-[9px] font-mono font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded tracking-wider uppercase">
                    DEV MODE
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Quick Login — Click any role
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[10px] font-medium text-center">
                    ⚠️ {error}
                </div>
            )}

            {/* Role Grid — 3 columns */}
            <div className="grid grid-cols-3 gap-1.5">
                {roles.map((r) => (
                    <button
                        key={r.role}
                        onClick={() => handleDevLogin(r.role)}
                        disabled={loadingRole !== null}
                        className={`
                            relative flex flex-col items-start p-2.5 
                            rounded-xl border text-left transition-all 
                            duration-150 cursor-pointer
                            ${r.colorClasses}
                            ${loadingRole === r.role
                                ? `opacity-100 ring-2 ring-offset-1 ${r.ringClass}`
                                : 'hover:shadow-sm hover:-translate-y-0.5'}
                            ${loadingRole !== null && loadingRole !== r.role
                                ? 'opacity-30 cursor-not-allowed scale-[0.97]'
                                : ''}
                        `}
                    >
                        {/* Spinner overlay */}
                        {loadingRole === r.role && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl z-10">
                                <svg className="animate-spin h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </div>
                        )}

                        {/* Icon + Label */}
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-base leading-none">{r.icon}</span>
                            <span className="text-[10px] font-extrabold leading-tight truncate">
                                {r.label}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-[8px] opacity-60 leading-tight font-medium">
                            {r.description}
                        </p>

                        {/* Arrow */}
                        <span className="absolute top-1.5 right-2 text-[9px] opacity-30">→</span>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <p className="text-center text-[9px] text-slate-300 mt-2.5 font-medium tracking-wide">
                🔒 Hidden in production
            </p>
        </div>
    );
};

export default DevQuickLogin;
