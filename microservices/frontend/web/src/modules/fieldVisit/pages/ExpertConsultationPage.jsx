import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '@/app/layouts/Navbar';
import { Star, Clock, ArrowRight, MessageSquare, Search, Users } from "lucide-react";

const experts = [
    {
        id: 1,
        name: "Dr. Arvind Swami",
        specialty: "Soil Scientist",
        category: "Soil",
        badge: "TOP RATED",
        rating: 4.6,
        experience: 15,
        bio: "PhD in Soil Science from IARI. Specializes in micronutrient deficiency diagnosis and soil health restoration.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
        available: true,
    },
    {
        id: 2,
        name: "Meera Reddy",
        specialty: "Integrated Pest Expert",
        category: "Crops",
        badge: "BEST CHOICE",
        rating: 4.8,
        experience: 9,
        bio: "Certified IPM specialist with expertise in biological pest control and pesticide resistance management.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
        available: true,
    },
    {
        id: 3,
        name: "Vikram Singh",
        specialty: "Irrigation Specialist",
        category: "Inputs",
        badge: null,
        rating: 4.7,
        experience: 12,
        bio: "Expert in drip and sprinkler systems, water budgeting, and PMKSY subsidy documentation for farmers.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
        available: false,
    },
    {
        id: 4,
        name: "Dr. Ananya Ray",
        specialty: "Crop Pathologist",
        category: "Crops",
        badge: "TOP RATED",
        rating: 5.0,
        experience: 20,
        bio: "Over two decades of experience diagnosing crop diseases. Regular contributor to national agricultural journals.",
        image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&auto=format&fit=crop&q=80",
        available: true,
    },
    {
        id: 5,
        name: "Rajesh Kumar",
        specialty: "Fertilizer Consultant",
        category: "Inputs",
        badge: null,
        rating: 4.5,
        experience: 8,
        bio: "Specializes in balanced fertilization programs, bio-fertilizers, and cost-efficient nutrient management.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
        available: true,
    },
    {
        id: 6,
        name: "Dr. Sunita Patel",
        specialty: "Organic Farming Expert",
        category: "Crops",
        badge: "BEST CHOICE",
        rating: 4.9,
        experience: 14,
        bio: "Pioneer in certified organic transition planning. Helped 200+ farmers achieve PKVY certification.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
        available: true,
    },
];

const filters = ["All", "Soil", "Crops", "Inputs"];

const badgeStyles = {
    "TOP RATED": "bg-emerald-600 text-white",
    "BEST CHOICE": "bg-amber-500 text-white",
};

const ExpertConsultations = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = experts.filter((e) => {
        const matchCat = activeFilter === "All" || e.category === activeFilter;
        const matchSearch =
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.specialty.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#f4f6f2] pt-16">

                {/* ── Hero Section ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 py-10">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Users size={14} className="text-green-700" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-700">Expert Network</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-[#1a2a1a] leading-tight mb-2">
                                    Expert Consultations
                                </h1>
                                <p className="text-slate-500 font-medium text-sm lg:text-base max-w-lg">
                                    Connect with verified agricultural scientists and industry veterans to optimize your farm's productivity and health.
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative lg:w-80">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or specialty..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex gap-2 mt-6">
                            {filters.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                                        activeFilter === f
                                            ? "bg-[#1a2a1a] text-white border-[#1a2a1a] shadow-md"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Expert Cards Grid ── */}
                <div className="max-w-7xl mx-auto px-6 py-10">
                    {filtered.length === 0 ? (
                        <div className="py-24 text-center text-slate-400 font-medium">
                            No experts found matching "{search}"
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((expert) => (
                                <div
                                    key={expert.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                >
                                    {/* Photo */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={expert.image}
                                            alt={expert.name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                        {/* Badge */}
                                        {expert.badge && (
                                            <span className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeStyles[expert.badge]}`}>
                                                {expert.badge}
                                            </span>
                                        )}

                                        {/* Availability dot */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            <span className={`w-2 h-2 rounded-full ${expert.available ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                                            <span className="text-[9px] font-black text-white uppercase tracking-wider">
                                                {expert.available ? "Available" : "Busy"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <div>
                                                <h3 className="font-black text-[#1a2a1a] text-base">{expert.name}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mt-0.5">{expert.specialty}</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                                <Star size={11} className="text-amber-500 fill-amber-500" />
                                                <span className="text-xs font-black text-amber-700">{expert.rating}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mt-2 mb-3">
                                            <Clock size={12} />
                                            <span>{expert.experience} Years Experience</span>
                                        </div>

                                        <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
                                            {expert.bio}
                                        </p>

                                        <button
                                            disabled={!expert.available}
                                            className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                                                expert.available
                                                    ? "bg-[#1f6b1f] hover:bg-green-800 text-white shadow-md shadow-green-900/10"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            }`}
                                        >
                                            <MessageSquare size={14} />
                                            {expert.available ? "Talk to Expert" : "Currently Unavailable"}
                                            {expert.available && <ArrowRight size={13} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── CTA Banner ── */}
                    <div className="mt-10 bg-[#1a2a1a] rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-black text-white mb-1">Can't find what you need?</h3>
                            <p className="text-sm text-white/60 font-medium max-w-md">
                                Request a specialized consultancy call for rare crop diseases or large-scale estate planning.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/book-farm-visit")}
                            className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm px-8 py-3.5 rounded-xl transition-colors flex items-center gap-2 active:scale-[0.98] whitespace-nowrap"
                        >
                            Book Custom Session
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExpertConsultations;
