import React, { useState, useEffect } from 'react';
import Navbar from "../../layouts/components/Navbar";
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  Mountain, Droplet, Target, Lightbulb, 
  MessageSquare, Waves, CloudRain, Leaf, 
  Grid, DollarSign, HelpCircle, 
  Wrench, GraduationCap, Medal, 
  Store, Globe, Camera, X, CheckCircle, ChevronLeft, ChevronRight, UploadCloud
} from 'lucide-react';

const initialFormData = {
  land: { acres: "", location: "" },
  water: { type: "" },
  goal: "",
  skill: "",
  market: "",
  media: []
};

const STEPS = [
    { num: 1, label: 'LAND' },
    { num: 2, label: 'WATER' },
    { num: 3, label: 'GOAL' },
    { num: 4, label: 'SKILL' },
    { num: 5, label: 'MARKET' },
    { num: 6, label: 'MEDIA' },
];

const PlanEstateForm = () => {
    // ---- STATE MANAGEMENT ----
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [mediaPreviews, setMediaPreviews] = useState([]);

    // Restore from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('orchardPlanDraft');
        if (saved) {
            try {
                // Parse saved data but exclude actual File blobs which can't be stringified easily
                const parsed = JSON.parse(saved);
                setFormData({ ...parsed, media: [] }); // Reset media to prevent parsing errors
            } catch (e) { console.error("Draft load error", e) }
        }
    }, []);

    // Save to localStorage dynamically
    useEffect(() => {
        const dataToSave = { ...formData, media: [] }; // Omit media file blobs from storage
        localStorage.setItem('orchardPlanDraft', JSON.stringify(dataToSave));
    }, [formData]);

    // ---- HANDLERS ----
    const updateForm = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: field ? { ...prev[section], [field]: value } : value
        }));
        setErrors({}); // clear inline errors
    };

    const handleMediaUpload = (e) => {
        const files = Array.from(e.target.files);
        // Validations: Max 2MB, JPG/PNG only
        const validFiles = files.filter(f => {
            if (f.size > 2 * 1024 * 1024) {
                toast.error(`${f.name} exceeds 2MB limit`);
                return false;
            }
            if (!f.type.match('image/jpeg|image/png')) {
                toast.error(`${f.name} is not a valid JPEG/PNG`);
                return false;
            }
            return true;
        });

        if (formData.media.length + validFiles.length > 4) {
            toast.error("Maximum 4 images allowed");
            return;
        }

        const newMedia = [...formData.media, ...validFiles];
        setFormData(prev => ({ ...prev, media: newMedia }));
        
        // Generate Previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setMediaPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeMedia = (index) => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }));
        setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // ---- NAVIGATION & VALIDATION ----
    const validateStep = (step) => {
        let currentErrors = {};
        let isValid = true;

        if (step === 1) {
            const acres = parseFloat(formData.land.acres);
            if (!formData.land.acres || isNaN(acres) || acres <= 0) {
                currentErrors.acres = "Please enter a valid acreage (> 0).";
                isValid = false;
            }
            if (!formData.land.location.trim()) {
                currentErrors.location = "Location is required.";
                isValid = false;
            }
        } else if (step === 2) {
            if (!formData.water.type) {
                toast.error("Please select a water availability option.");
                isValid = false;
            }
        } // Step 3, 4, 5 can technically be skipped or validated similarly if we want strictness, but we will enforce them.
        else if (step === 3 && !formData.goal) {
            toast.error("Please select a primary goal.");
            isValid = false;
        }
        else if (step === 4 && !formData.skill) {
            toast.error("Please select your skill level.");
            isValid = false;
        }
        else if (step === 5 && !formData.market) {
            toast.error("Please select a market preference.");
            isValid = false;
        }

        setErrors(currentErrors);
        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSaveDraft = () => {
        toast.success("Draft saved successfully to your browser!");
    };

    // ---- SUBMIT ----
    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;
        
        setIsLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('acres', formData.land.acres);
            submitData.append('location', formData.land.location);
            submitData.append('waterType', formData.water.type);
            submitData.append('goal', formData.goal);
            submitData.append('skillLevel', formData.skill);
            submitData.append('marketPreference', formData.market);
            
            // Tie to user if auth is configured locally, default to user empty if not implemented
            submitData.append('userId', 'user'); 

            if (formData.media && formData.media.length > 0) {
                formData.media.forEach(file => submitData.append('media', file));
            }

            const response = await axios.post('http://localhost:4000/api/orchard/request', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true 
            });

            if (response.data.success) {
                setIsSuccess(true);
                localStorage.removeItem('orchardPlanDraft');
                toast.success("Expert Plan Request Submitted!");
            } else {
                toast.error(response.data.message || "Failed to submit request.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // ---- DYNAMIC RENDER HELPERS ----
    const renderExpertTips = () => {
        let tips = [
            { type: "YIELD TIP", color: "#a64257", text: "Inter-cropping with legumes during the first 3 years can increase soil nitrogen by 15%." }
        ];

        if (formData.water.type === 'Rain-fed') {
            tips.push({ type: "WATER SMART", color: "#297f3b", text: "Given your rain-fed landscape, constructing minor contour trenches will maximize monsoon retention." });
        } else if (formData.water.type === 'Borewell') {
            tips.push({ type: "WATER SMART", color: "#297f3b", text: "Monitor borewell salinity levels quarterly to prevent root burn out during high evaporation cycles." });
        } else {
            tips.push({ type: "WATER SMART", color: "#297f3b", text: "Drip irrigation is mandatory for expert-level citrus planning in arid zones mapping your canal limits." });
        }
        return tips;
    };

    const renderRecommendationPreview = () => {
        if (currentStep < 3) return null;
        
        let insight = "Based on your input, we are evaluating combinations.";
        let crop = "...";

        if (formData.water.type === 'Rain-fed') {
            insight = "With natural irrigation limits, we recommend drought-resilient crops native to your soil profile.";
            crop = formData.goal === 'MAX PROFIT' ? "Pomegranate + Contour Trenching" : "Custard Apple / Guava";
        } else {
            if (formData.goal === 'MAX PROFIT') {
                insight = "High-density planting is viable with your water surplus. Focus on short-maturity cycles.";
                crop = "High-Density Mango + Drip";
            } else if (formData.goal === 'MIXED ORCHARD') {
                insight = "Layered multi-canopy framing can work beautifully here for continuous harvest income.";
                crop = "Citrus + Papaya Perimeter";
            } else {
                insight = "Classic single-crop focus ensuring optimized pesticide and nutrient tracking.";
                crop = "Citrus / Sweet Orange";
            }
        }

        return (
            <div className="bg-gradient-to-r from-[#eef8eb] to-[#e6f4f1] rounded-[24px] p-6 shadow-sm border border-green-100 mb-8 animate-in fade-in slide-in-from-bottom border-l-4 border-l-green-600">
                <h3 className="text-xs font-black text-green-800 uppercase tracking-widest mb-1 flex items-center gap-2"><CheckCircle size={14}/> Live Auto-Recommendation</h3>
                <p className="text-sm text-slate-700 font-semibold mb-3">{insight}</p>
                <div className="inline-block bg-white px-4 py-2 rounded-lg text-sm font-bold text-green-900 border border-green-200">
                    Suggested Focus: <span className="text-green-600 italic font-black">{crop}</span>
                </div>
            </div>
        );
    };

    if (isSuccess) {
        return (
            <div className="bg-white min-h-screen font-sans flex items-center justify-center pt-24">
                <Navbar />
                <div className="max-w-lg text-center p-8 bg-[#f9faf9] rounded-3xl border border-green-100 shadow-2xl">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6">
                        <CheckCircle size={56} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Request Submitted!</h2>
                    <p className="text-slate-600 font-medium mb-8">
                        Our Senior Agri-Advisors have received your profile and are currently computing your site feasibility data. An expert will contact you within 24 hours.
                    </p>
                    <button 
                        onClick={() => window.location.href = "/"}
                        className="bg-green-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-800 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen font-sans pb-20">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28">
                {/* Headers */}
                <div className="mb-12">
                    <h1 className="text-[40px] font-black text-[#1a1a1a] tracking-tight mb-2">Plan Your Estate</h1>
                    <p className="text-[#666666] text-lg font-medium">Complete the details below to receive a high-yield agricultural strategy tailored to your land.</p>
                </div>

                {/* Progress Stepper */}
                <div className="relative mb-16 max-w-5xl">
                    <div className="absolute top-[22px] left-0 w-full h-[2px] bg-slate-100 -z-10"></div>
                    <div 
                        className="absolute top-[22px] left-0 h-[2px] bg-green-700 -z-10 transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                    ></div>
                    <div className="flex justify-between items-start">
                        {STEPS.map((step, idx) => {
                            const isActive = step.num === currentStep;
                            const isCompleted = step.num < currentStep;
                            return (
                                <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => step.num < currentStep && setCurrentStep(step.num)}>
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold mb-3 shadow-sm transition-colors duration-300
                                        ${isActive ? 'bg-[#1e612a] text-white ring-4 ring-green-100' : isCompleted ? 'bg-green-500 text-white' : 'bg-[#f0f0f0] text-[#888888]'}`}
                                    >
                                        {isCompleted ? <CheckCircle size={20}/> : step.num}
                                    </div>
                                    <span className={`text-[11px] font-black tracking-widest uppercase transition-colors ${isActive || isCompleted ? 'text-[#1e612a]' : 'text-[#888888]'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Main Form Router */}
                    <div className="lg:col-span-8 bg-[#f6f6f6] rounded-[24px] p-8 md:p-10 shadow-sm border border-slate-100 relative min-h-[500px]">
                        
                        {currentStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="flex items-center gap-3 text-[22px] font-bold text-[#222222] mb-6">
                                    <Mountain className="text-[#1e612a]" size={24} /> Step 1: Land Characteristics
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#444444] mb-2">Total Acres <span className="text-red-500">*</span></label>
                                        <input 
                                            type="number" step="0.1" min="0"
                                            value={formData.land.acres}
                                            onChange={(e) => updateForm('land', 'acres', e.target.value)}
                                            placeholder="e.g. 5.5" 
                                            className={`w-full bg-[#eeeeee] border rounded-xl px-5 py-4 text-[#333333] placeholder-[#999999] focus:outline-none focus:bg-white transition-all font-medium ${errors.acres ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-[#1e612a]'}`}
                                        />
                                        {errors.acres && <p className="text-red-500 text-xs font-bold mt-2">{errors.acres}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#444444] mb-2">Location (Village/District) <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            value={formData.land.location}
                                            onChange={(e) => updateForm('land', 'location', e.target.value)}
                                            placeholder="e.g. Nashik, Maharashtra" 
                                            className={`w-full bg-[#eeeeee] border rounded-xl px-5 py-4 text-[#333333] placeholder-[#999999] focus:outline-none focus:bg-white transition-all font-medium ${errors.location ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-[#1e612a]'}`}
                                        />
                                        {errors.location && <p className="text-red-500 text-xs font-bold mt-2">{errors.location}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="flex items-center gap-3 text-[22px] font-bold text-[#222222] mb-6">
                                    <Droplet className="text-[#1e612a]" size={24} fill="#1e612a" /> Step 2: Water Availability
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {['Borewell', 'Canal / River', 'Rain-fed'].map((type) => (
                                        <div 
                                            key={type}
                                            onClick={() => updateForm('water', 'type', type)}
                                            className={`cursor-pointer rounded-[20px] py-8 flex flex-col items-center justify-center gap-3 transition-colors ${
                                                formData.water.type === type ? 'bg-[#297f3b] text-white shadow-lg ring-2 ring-green-300 ring-offset-2' : 'bg-[#eaeaea] text-[#333333] hover:bg-[#e0e0e0]'
                                            }`}
                                        >
                                            {type === 'Rain-fed' ? <CloudRain size={28} /> : <Waves size={28} />}
                                            <span className="font-bold">{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="flex items-center gap-3 text-[22px] font-bold text-[#222222] mb-6">
                                    <Target className="text-[#1e612a]" size={24} /> Step 3: What is your primary goal?
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { title: 'FRUIT FOCUSED', icon: <Leaf size={20}/> },
                                        { title: 'MIXED ORCHARD', icon: <Grid size={20}/> },
                                        { title: 'MAX PROFIT', icon: <DollarSign size={20}/> },
                                        { title: "DON'T KNOW", icon: <HelpCircle size={20}/> }
                                    ].map((opt) => (
                                        <div 
                                            key={opt.title}
                                            onClick={() => updateForm('goal', null, opt.title)}
                                            className={`cursor-pointer rounded-2xl py-6 flex flex-col items-center justify-center gap-2 transition-all ${
                                                formData.goal === opt.title ? 'bg-[#297f3b] text-white shadow-lg scale-105' : 'bg-[#eaeaea] text-[#333333] hover:bg-[#e0e0e0]'
                                            }`}
                                        >
                                            {opt.icon}
                                            <span className="font-black text-[10px] sm:text-[11px] text-center px-1 uppercase tracking-wider">{opt.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="flex items-center gap-3 text-[22px] font-bold text-[#222222] mb-6">
                                    <GraduationCap className="text-[#1e612a]" size={24} /> Step 4: Your Skill Level
                                </h3>
                                <div className="flex flex-col gap-4 max-w-lg mx-auto">
                                    {[
                                        { level: 'Beginner', desc: 'New to agriculture, willing to learn.' },
                                        { level: 'Intermediate', desc: 'Some experience, adapting to modern tech.' },
                                        { level: 'Expert', desc: 'Years of field mastery, highly optimized.' }
                                    ].map((opt) => (
                                        <div 
                                            key={opt.level}
                                            onClick={() => updateForm('skill', null, opt.level)}
                                            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-center justify-between ${
                                                formData.skill === opt.level ? 'border-green-600 bg-green-50 shadow-md' : 'border-transparent bg-[#eaeaea] hover:bg-[#e0e0e0]'
                                            }`}
                                        >
                                            <div>
                                                <h4 className="font-bold text-slate-900">{opt.level}</h4>
                                                <p className="text-xs text-slate-500 font-medium">{opt.desc}</p>
                                            </div>
                                            {formData.skill === opt.level && <CheckCircle className="text-green-600" size={24} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="flex items-center gap-3 text-[22px] font-bold text-[#222222] mb-6">
                                    <Store className="text-[#1e612a]" size={24} /> Step 5: Market Preference
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { title: 'Local', icon: <Store size={28}/> },
                                        { title: 'Export', icon: <Globe size={28}/> },
                                        { title: 'No idea', icon: <HelpCircle size={28}/> }
                                    ].map((opt) => (
                                        <div 
                                            key={opt.title}
                                            onClick={() => updateForm('market', null, opt.title)}
                                            className={`cursor-pointer rounded-[20px] py-8 flex flex-col items-center justify-center gap-3 transition-colors ${
                                                formData.market === opt.title ? 'bg-[#297f3b] text-white shadow-lg ring-2 ring-green-300 ring-offset-2' : 'bg-[#eaeaea] text-[#333333] hover:bg-[#e0e0e0]'
                                            }`}
                                        >
                                            {opt.icon}
                                            <span className="font-bold">{opt.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 6 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="flex items-center gap-3 text-[22px] font-bold text-[#222222] mb-2">
                                    <Camera className="text-[#1e612a]" size={24} /> Step 6: Visual Media (Optional)
                                </h3>
                                <p className="text-sm text-[#666666] font-medium mb-6 ml-9">Share up to 4 photos of your land footprint, soil complexion, or topography.</p>
                                
                                <div className="max-w-lg mb-8">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#cccccc] hover:border-green-500 rounded-2xl bg-[#eeeeee] hover:bg-green-50/50 cursor-pointer transition-colors group">
                                        <input type="file" multiple accept="image/png, image/jpeg" className="hidden" onChange={handleMediaUpload}/>
                                        <UploadCloud className="text-slate-400 group-hover:text-green-500 mb-2" size={32}/>
                                        <span className="font-bold text-slate-700 text-sm">Click to upload JPG/PNG (Max 2MB)</span>
                                    </label>
                                </div>

                                {/* Previews */}
                                {mediaPreviews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {mediaPreviews.map((src, idx) => (
                                            <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm group">
                                                <img src={src} className="w-full h-full object-cover" alt="Preview"/>
                                                <button onClick={() => removeMedia(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X size={12}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Action Buttons */}
                        <div className="absolute left-8 right-8 bottom-8 flex flex-col sm:flex-row justify-between items-center sm:justify-between pt-8 border-t border-[#e5e5e5] mt-12 bg-[#f6f6f6]">
                            
                            {/* Nav left */}
                            <div className="flex gap-4 w-full sm:w-auto">
                                <button 
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`flex items-center justify-center gap-1 font-bold py-3 px-5 rounded-[12px] transition-colors w-full sm:w-auto ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed bg-transparent' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                >
                                    <ChevronLeft size={18}/> Prev
                                </button>
                                <button 
                                    onClick={handleSaveDraft}
                                    className="w-full sm:w-auto bg-[#c4eab4] hover:bg-[#aee09c] text-[#1e612a] font-bold py-3 px-6 rounded-[12px] transition-colors shadow-sm"
                                >
                                    Save Draft
                                </button>
                            </div>
                            
                            {/* Nav Right */}
                            {currentStep < 6 ? (
                                <button 
                                    onClick={nextStep}
                                    className="w-full sm:w-auto mt-4 sm:mt-0 bg-[#175b22] hover:bg-[#114b1a] text-white font-bold py-3 px-8 rounded-[12px] shadow-lg shadow-green-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Next <ChevronRight size={18}/>
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto mt-4 sm:mt-0 bg-[#175b22] hover:bg-[#114b1a] text-white font-bold py-3 px-8 rounded-[12px] shadow-lg shadow-green-900/20 transition-all active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:active:scale-100"
                                >
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        "Request Expert Plan"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Widgets */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Recommendation Preview Engine */}
                        {renderRecommendationPreview()}

                        {/* Expert Tips (Dynamic) */}
                        <div className="bg-[#f6f6f6] rounded-[24px] p-6 shadow-sm border border-slate-100">
                            <h3 className="flex items-center gap-2 font-bold text-lg text-[#222222] mb-5">
                                <Lightbulb className="text-[#1e612a]" size={20} fill="#1e612a" /> Expert Tips
                            </h3>
                            <div className="space-y-4">
                                {renderExpertTips().map((tip, idx) => (
                                    <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border-l-4 transition-all" style={{ borderLeftColor: tip.color }}>
                                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: tip.color }}>{tip.type}</div>
                                        <p className="text-sm font-semibold text-[#444444] leading-relaxed">
                                            {tip.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Need Help Green Card */}
                        <div className="bg-[#297f3b] rounded-[24px] p-8 text-white relative overflow-hidden shadow-xl shadow-green-900/10">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl flex-shrink-0 pointer-events-none"></div>
                            
                            <h3 className="font-bold text-xl mb-3 relative z-10">Need Help?</h3>
                            <p className="text-[#c4eab4] text-sm mb-6 relative z-10">
                                Our Lead Consultants are ready to help you finalize your land details.
                            </p>
                            
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-slate-300">
                                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Anil Sharma" className="w-full h-full object-cover"/>
                                </div>
                                <div>
                                    <h4 className="font-bold">Anil Sharma</h4>
                                    <p className="text-xs text-[#aee09c]">Senior Agri-Advisor</p>
                                </div>
                            </div>

                            <button onClick={() => toast.info('Connecting you to an agent...')} className="w-full bg-white hover:bg-slate-50 text-[#1e612a] font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 relative z-10 active:scale-95">
                                <MessageSquare size={18} /> Talk to Expert
                            </button>
                        </div>

                        {/* Hero Sub-Image */}
                        <div className="rounded-[24px] overflow-hidden relative shadow-lg h-56 border border-slate-200">
                            <img src="https://images.unsplash.com/photo-1506106673646-d24ebfec05cc?auto=format&fit=crop&q=80&w=600" alt="Citrus Estate" className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-5 right-5">
                                <span className="text-white text-xs font-bold shadow-sm">
                                    Dream Goal: High-Density Citrus Estate
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanEstateForm;
