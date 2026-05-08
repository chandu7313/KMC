import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
    ChevronRight,
    ShieldCheck,
    Droplets,
    BadgeIndianRupee,
    Phone,
    ArrowRight,
    CheckCircle2,
    ExternalLink,
    Wheat,
    Sun,
    Tractor,
    TreePine,
    Landmark,
    BookOpen,
    Wifi,
    Leaf,
} from "lucide-react";

const schemes = [
    {
        id: "pm-kisan",
        badge: "ACTIVE",
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: BadgeIndianRupee,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        title: "PM-KISAN",
        subtitle: "Direct Income Support",
        description:
            "Income support of ₹6,000 per year in three equal installments directly into your bank account for minimum financial stability.",
        link: "https://pmkisan.gov.in",
        tag: "₹6,000 / year",
        tagColor: "bg-amber-50 text-amber-700",
    },
    {
        id: "crop-insurance",
        badge: "PRIORITY",
        badgeColor: "bg-rose-100 text-rose-600 border-rose-200",
        icon: ShieldCheck,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-500",
        title: "PMFBY",
        subtitle: "Crop Insurance",
        description:
            "Comprehensive risk cover for your crops from pre-sowing to post-harvest against non-preventable natural risks like floods and drought.",
        link: "https://pmfby.gov.in",
        tag: "Up to ₹2L cover",
        tagColor: "bg-rose-50 text-rose-700",
    },
    {
        id: "irrigation-subsidy",
        badge: "ACTIVE",
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: Droplets,
        iconBg: "bg-sky-50",
        iconColor: "text-sky-500",
        title: "PMKSY",
        subtitle: "Irrigation Subsidy",
        description:
            "Up to 60% subsidy on drip and sprinkler irrigation systems to maximize water efficiency and crop quality.",
        link: "https://pmksy.gov.in",
        tag: "60% subsidy",
        tagColor: "bg-sky-50 text-sky-700",
    },
    {
        id: "kisan-credit",
        badge: "ACTIVE",
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: Landmark,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
        title: "Kisan Credit Card",
        subtitle: "Low-Interest Farm Credit",
        description:
            "Short-term credit at 4% interest rate per annum for crop cultivation, post-harvest expenses, and allied activities.",
        link: "https://www.rbi.org.in",
        tag: "4% interest p.a.",
        tagColor: "bg-violet-50 text-violet-700",
    },
    {
        id: "soil-health",
        badge: "ACTIVE",
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: Leaf,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        title: "Soil Health Card",
        subtitle: "Free Soil Analysis",
        description:
            "Free soil testing and personalized crop-wise nutrient recommendations to improve productivity and reduce input costs.",
        link: "https://soilhealth.dac.gov.in",
        tag: "Free Service",
        tagColor: "bg-green-50 text-green-700",
    },
    {
        id: "agri-infra",
        badge: "NEW",
        badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Tractor,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
        title: "AIF Scheme",
        subtitle: "Agriculture Infrastructure",
        description:
            "₹1 lakh crore financing for post-harvest management infrastructure and community farming assets with 3% interest subvention.",
        link: "https://agriinfra.dac.gov.in",
        tag: "3% interest relief",
        tagColor: "bg-indigo-50 text-indigo-700",
    },
    {
        id: "solar-pump",
        badge: "ACTIVE",
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: Sun,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
        title: "PM-KUSUM",
        subtitle: "Solar Pump Scheme",
        description:
            "90% subsidy for solar-powered water pumps to help farmers reduce electricity costs and ensure reliable irrigation.",
        link: "https://mnre.gov.in",
        tag: "90% subsidy",
        tagColor: "bg-orange-50 text-orange-700",
    },
    {
        id: "organic-farming",
        badge: "ACTIVE",
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: TreePine,
        iconBg: "bg-lime-50",
        iconColor: "text-lime-700",
        title: "PKVY",
        subtitle: "Organic Farming Mission",
        description:
            "Financial assistance of ₹50,000/hectare over 3 years for farmers adopting organic farming practices and getting certification.",
        link: "https://pgsindia-ncof.gov.in",
        tag: "₹50,000 / hectare",
        tagColor: "bg-lime-50 text-lime-700",
    },
    {
        id: "e-nam",
        badge: "NEW",
        badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Wifi,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
        title: "e-NAM",
        subtitle: "Online Produce Trading",
        description:
            "Sell your farm produce directly on the national e-marketplace to get the best price without middlemen.",
        link: "https://enam.gov.in",
        tag: "Direct Market Access",
        tagColor: "bg-teal-50 text-teal-700",
    },
];

const GovernmentSchemes = () => {
    const navigate = useNavigate();
    const [checkingId, setCheckingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    const filters = ["ALL", "ACTIVE", "PRIORITY", "NEW"];

    const filtered = schemes.filter((s) => {
        const matchesFilter = activeFilter === "ALL" || s.badge === activeFilter;
        const matchesSearch =
            s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleCheck = (id, link) => {
        setCheckingId(id);
        setTimeout(() => {
            setCheckingId(null);
            window.open(link, "_blank");
        }, 700);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#f4f6f2] pt-16">

                {/* ── Hero Banner ── */}
                <div className="bg-[#1a2a1a] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=60')", backgroundSize: "cover", backgroundPosition: "center" }} />
                    <div className="relative max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row md:items-end gap-6 justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Landmark size={14} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Government Initiatives</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
                                Empowering Your <br />
                                <span className="text-emerald-400">Growth.</span>
                            </h1>
                            <p className="text-white/60 font-medium max-w-xl text-sm lg:text-base leading-relaxed">
                                Unlock specialized financial support and security designed for the modern estate.
                                Access verified government schemes curated for your specific crop and region.
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
                            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 text-center min-w-[110px]">
                                <p className="text-3xl font-black text-white">9+</p>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Schemes</p>
                            </div>
                            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 text-center min-w-[110px]">
                                <p className="text-3xl font-black text-emerald-400">₹5L+</p>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Max Benefit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* ── Left: Scheme Cards ── */}
                        <div className="flex-1 min-w-0">

                            {/* Search & Filters */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                <input
                                    type="text"
                                    placeholder="Search schemes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent shadow-sm"
                                />
                                <div className="flex gap-2">
                                    {filters.map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFilter(f)}
                                            className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${activeFilter === f
                                                ? "bg-[#1a2a1a] text-white border-[#1a2a1a] shadow-md"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid of Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filtered.length === 0 && (
                                    <div className="col-span-3 py-20 text-center text-slate-400 font-medium text-sm">
                                        No schemes found for "{searchTerm}"
                                    </div>
                                )}
                                {filtered.map((scheme) => (
                                    <div
                                        key={scheme.id}
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        {/* Icon & Badge */}
                                        <div className="flex items-start justify-between mb-5">
                                            <div className={`w-12 h-12 rounded-xl ${scheme.iconBg} flex items-center justify-center`}>
                                                <scheme.icon size={22} className={scheme.iconColor} />
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${scheme.badgeColor}`}>
                                                {scheme.badge}
                                            </span>
                                        </div>

                                        {/* Benefit Tag */}
                                        <span className={`self-start text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 ${scheme.tagColor}`}>
                                            {scheme.tag}
                                        </span>

                                        {/* Title */}
                                        <h2 className="text-base font-black text-[#1a2a1a] mb-0.5">{scheme.title}</h2>
                                        <p className="text-[11px] font-bold text-green-700 uppercase tracking-widest mb-3">{scheme.subtitle}</p>

                                        {/* Description */}
                                        <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5">
                                            {scheme.description}
                                        </p>

                                        {/* Guide + Button */}
                                        <div className="space-y-3 mt-auto">
                                            <button className="flex items-center gap-1.5 text-green-700 text-[11px] font-black uppercase tracking-widest hover:text-green-900 transition-colors group">
                                                <BookOpen size={12} />
                                                Step-by-Step Guide
                                                <ChevronRight size={11} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleCheck(scheme.id, scheme.link)}
                                                disabled={checkingId === scheme.id}
                                                className="w-full bg-[#1f6b1f] hover:bg-green-800 active:scale-[0.98] text-white py-3 rounded-xl font-black text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                                            >
                                                {checkingId === scheme.id ? (
                                                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking...</>
                                                ) : (
                                                    <><CheckCircle2 size={13} /> Check Eligibility</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Right Sidebar ── */}
                        <div className="lg:w-72 xl:w-80 flex-shrink-0 space-y-5">

                            {/* Banner Image */}
                            <div className="relative rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1589801258579-18e091f4ca26?w=800&auto=format&fit=crop&q=80"
                                    alt="Farmer in field"
                                    className="w-full h-44 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-5">
                                    <p className="text-white font-black text-lg leading-snug">
                                        Protecting your yield, <br />securing your future.
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Scheme Overview</p>
                                <div className="space-y-3">
                                    {[
                                        { label: "Active Schemes", value: "7", color: "text-emerald-600" },
                                        { label: "New This Season", value: "2", color: "text-blue-600" },
                                        { label: "Priority Schemes", value: "1", color: "text-rose-500" },
                                        { label: "Max Annual Benefit", value: "₹5L+", color: "text-amber-600" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
                                            <span className={`font-black text-sm ${stat.color}`}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-[#1a2a1a] rounded-2xl p-6 text-white">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                    <Phone size={18} className="text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-black mb-2 leading-snug">
                                    Need help with your application?
                                </h3>
                                <p className="text-xs text-white/60 font-medium mb-5 leading-relaxed">
                                    Our certified agricultural consultants will guide you through the documentation and filing for any scheme.
                                </p>
                                <button
                                    onClick={() => navigate("/book-farm-visit")}
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-black text-xs tracking-wide flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                                >
                                    <Phone size={13} />
                                    Consult Expert
                                    <ArrowRight size={13} className="ml-auto" />
                                </button>
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                    📌 All scheme information is sourced from official government portals. Verify eligibility at{" "}
                                    <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="underline font-bold inline-flex items-center gap-0.5">
                                        india.gov.in <ExternalLink size={9} />
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GovernmentSchemes;
