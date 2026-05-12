import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    ArrowLeft, ArrowRight, HelpCircle, Check, Home as HomeIcon,
    Droplets, CloudRain, Waves, CircleDot, Layers,
    Info, Tractor, Sprout, Wheat, Leaf
} from 'lucide-react';

// Soil images
import redSoilImg from '@/assets/soil-images/red_soil.png';
import blackSoilImg from '@/assets/soil-images/black_soil.png';
import sandySoilImg from '@/assets/soil-images/sandy_soil.png';
import claySoilImg from '@/assets/soil-images/clay_soil.png';
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';

const TOTAL_STEPS = 7;

const FarmerOnboardingSurvey = () => {
    const navigate = useNavigate();
    const { backendUrl, getUserData, setUserData } = useGlobalStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [slideDirection, setSlideDirection] = useState('next');
    const [isAnimating, setIsAnimating] = useState(false);
    const contentRef = useRef(null);

    // Survey state
    const [surveyData, setSurveyData] = useState({
        language: 'te',
        farmName: '',
        farmSize: '',
        farmSizeUnit: 'acres',
        farmingExperience: '',
        landOwnership: '',
        soilType: '',
        waterSource: '',
        primaryCrops: [],
    });

    const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

    const updateField = (field, value) => {
        setSurveyData(prev => ({ ...prev, [field]: value }));
    };

    const toggleCrop = (crop) => {
        setSurveyData(prev => ({
            ...prev,
            primaryCrops: prev.primaryCrops.includes(crop)
                ? prev.primaryCrops.filter(c => c !== crop)
                : [...prev.primaryCrops, crop]
        }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return !!surveyData.language;
            case 2: return !!surveyData.farmName && !!surveyData.farmSize && !!surveyData.farmingExperience;
            case 3: return !!surveyData.landOwnership;
            case 4: return !!surveyData.soilType;
            case 5: return !!surveyData.waterSource;
            case 6: return surveyData.primaryCrops.length > 0;
            case 7: return true;
            default: return false;
        }
    };

    const goNext = () => {
        if (!canProceed() || isAnimating) return;
        if (currentStep < TOTAL_STEPS) {
            setSlideDirection('next');
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 250);
        }
    };

    const goBack = () => {
        if (currentStep > 1 && !isAnimating) {
            setSlideDirection('prev');
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 250);
        } else if (currentStep === 1) {
            navigate('/');
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const payload = {
                ...surveyData,
                farmSize: Number(surveyData.farmSize),
            };
            const { data } = await axios.post(backendUrl + `${API.SURVEY}/submit`, { surveyData: payload });
            if (data.success) {
                toast.success('🎉 Profile setup complete! Welcome to KMC.');
                await getUserData();
                navigate('/');
            } else {
                toast.error(data.message || 'Failed to save survey');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Scroll to top on step change
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep]);

    // ─── STEP RENDERERS ────────────────────────────

    const renderStep1 = () => (
        <div className="survey-step-content">
            {/* Hero Image */}
            <div className="survey-hero-banner">
                <img
                    src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800"
                    alt="Green farmland"
                    className="survey-hero-img"
                />
                <div className="survey-hero-overlay">
                    <div className="survey-hero-icon">
                        <Tractor size={28} color="#fff" />
                    </div>
                </div>
            </div>

            <div className="survey-step-body" style={{ textAlign: 'center' }}>
                <h2 className="survey-app-title">Modern Estate</h2>
                <p className="survey-subtitle">Choose Your Language</p>

                <div className="survey-options-list" style={{ marginTop: '24px' }}>
                    {[
                        { value: 'te', label: 'తెలుగు', sub: 'Telugu', icon: '🇮🇳', color: '#1a237e' },
                        { value: 'hi', label: 'हिंदी', sub: 'Hindi', icon: '🇮🇳', color: '#4a148c' },
                        { value: 'en', label: 'English', sub: 'Global', icon: '🌐', color: '#1b5e20' },
                    ].map(lang => (
                        <button
                            key={lang.value}
                            className={`survey-option-card ${surveyData.language === lang.value ? 'selected' : ''}`}
                            onClick={() => updateField('language', lang.value)}
                        >
                            <div className="survey-option-icon-circle" style={{ background: `${lang.color}18` }}>
                                <span style={{ fontSize: '20px' }}>{lang.icon}</span>
                            </div>
                            <div className="survey-option-text">
                                <span className="survey-option-label">{lang.label}</span>
                                <span className="survey-option-sub">{lang.sub}</span>
                            </div>
                            <div className={`survey-radio ${surveyData.language === lang.value ? 'active' : ''}`}>
                                {surveyData.language === lang.value && <Check size={12} strokeWidth={3} />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="survey-step-content">
            <div className="survey-step-body">
                <h2 className="survey-question-title">Tell us about your farm</h2>
                <p className="survey-question-sub">Help us personalize your experience</p>

                <div className="survey-form-group">
                    <label className="survey-form-label">Farm Name</label>
                    <input
                        type="text"
                        className="survey-form-input"
                        placeholder="e.g., Green Valley Farm"
                        value={surveyData.farmName}
                        onChange={e => updateField('farmName', e.target.value)}
                    />
                </div>

                <div className="survey-form-row">
                    <div className="survey-form-group" style={{ flex: 2 }}>
                        <label className="survey-form-label">Farm Size</label>
                        <input
                            type="number"
                            className="survey-form-input"
                            placeholder="e.g., 12.5"
                            value={surveyData.farmSize}
                            onChange={e => updateField('farmSize', e.target.value)}
                        />
                    </div>
                    <div className="survey-form-group" style={{ flex: 1 }}>
                        <label className="survey-form-label">Unit</label>
                        <select
                            className="survey-form-input"
                            value={surveyData.farmSizeUnit}
                            onChange={e => updateField('farmSizeUnit', e.target.value)}
                        >
                            <option value="acres">Acres</option>
                            <option value="hectares">Hectares</option>
                            <option value="guntas">Guntas</option>
                        </select>
                    </div>
                </div>

                <div className="survey-form-group">
                    <label className="survey-form-label">Farming Experience</label>
                    <div className="survey-chip-grid">
                        {[
                            { value: '0-2', label: '0-2 Years', emoji: '🌱' },
                            { value: '3-5', label: '3-5 Years', emoji: '🌿' },
                            { value: '5-10', label: '5-10 Years', emoji: '🌾' },
                            { value: '10+', label: '10+ Years', emoji: '🏆' },
                        ].map(exp => (
                            <button
                                key={exp.value}
                                className={`survey-chip ${surveyData.farmingExperience === exp.value ? 'selected' : ''}`}
                                onClick={() => updateField('farmingExperience', exp.value)}
                            >
                                <span>{exp.emoji}</span> {exp.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Insight */}
                <div className="survey-insight-card">
                    <div className="survey-insight-icon"><Info size={16} /></div>
                    <div>
                        <p className="survey-insight-title">CONSULTANCY INSIGHT</p>
                        <p className="survey-insight-text">Your farm details help us recommend the right crop plans and government schemes for your region.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="survey-step-content">
            <div className="survey-step-body">
                <h2 className="survey-question-title">Is the land yours or leased?</h2>
                <p className="survey-question-sub">Tell us how you use this land</p>

                <div className="survey-options-list" style={{ marginTop: '24px' }}>
                    {[
                        { value: 'own', label: 'Own Land', sub: 'You hold the legal title to the farming plot', icon: <HomeIcon size={22} />, color: '#dcfce7' },
                        { value: 'leased', label: 'Leased Land', sub: 'You operate the farm through a rental agreement', icon: <Layers size={22} />, color: '#fef3c7' },
                        { value: 'both', label: 'Both', sub: 'A mix of owned property and additional leased area', icon: <Layers size={22} />, color: '#fce7f3' },
                    ].map(opt => (
                        <button
                            key={opt.value}
                            className={`survey-option-card ${surveyData.landOwnership === opt.value ? 'selected' : ''}`}
                            onClick={() => updateField('landOwnership', opt.value)}
                        >
                            <div className="survey-option-icon-circle" style={{ background: opt.color }}>
                                {opt.icon}
                            </div>
                            <div className="survey-option-text">
                                <span className="survey-option-label">{opt.label}</span>
                                <span className="survey-option-sub">{opt.sub}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="survey-insight-card">
                    <div className="survey-insight-icon"><Info size={16} /></div>
                    <div>
                        <p className="survey-insight-title">CONSULTANCY INSIGHT</p>
                        <p className="survey-insight-text">Land ownership status helps us tailor financial support and subsidy recommendations specific to your agricultural tenure.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="survey-step-content">
            <div className="survey-step-body">
                <h2 className="survey-question-title">What type of soil do you have?</h2>
                <p className="survey-question-sub">Tap the one that looks like your soil</p>

                <div className="survey-soil-grid">
                    {[
                        { value: 'red', label: 'Red Soil', img: redSoilImg },
                        { value: 'black', label: 'Black Soil', img: blackSoilImg },
                        { value: 'sandy', label: 'Sandy Soil', img: sandySoilImg },
                        { value: 'clay', label: 'Clay Soil', img: claySoilImg },
                    ].map(soil => (
                        <button
                            key={soil.value}
                            className={`survey-soil-card ${surveyData.soilType === soil.value ? 'selected' : ''}`}
                            onClick={() => updateField('soilType', soil.value)}
                        >
                            <div className="survey-soil-img-wrap">
                                <img src={soil.img} alt={soil.label} className="survey-soil-img" />
                                {surveyData.soilType === soil.value && (
                                    <div className="survey-soil-check">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                            <span className={`survey-soil-label ${surveyData.soilType === soil.value ? 'active' : ''}`}>{soil.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    className={`survey-idk-btn ${surveyData.soilType === 'unknown' ? 'selected' : ''}`}
                    onClick={() => updateField('soilType', 'unknown')}
                >
                    <span className="survey-idk-icon">?</span>
                    <span>I don't know</span>
                    <ArrowRight size={16} className="survey-idk-arrow" />
                </button>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="survey-step-content">
            <div className="survey-step-body">
                <h2 className="survey-question-title">Where does your water come from?</h2>
                <p className="survey-question-sub">How do you irrigate your farm</p>

                <div className="survey-options-list" style={{ marginTop: '20px' }}>
                    {[
                        { value: 'borewell', label: 'Borewell', sub: 'Groundwater extraction via motor pump', icon: <Droplets size={20} /> },
                        { value: 'canal', label: 'Canal', sub: 'Structured irrigation from river sources', icon: <Waves size={20} /> },
                        { value: 'rain', label: 'Rain Only', sub: 'Monsoon dependent, no artificial supply', icon: <CloudRain size={20} /> },
                        { value: 'pond', label: 'Pond or Tank', sub: 'Localized surface water storage', icon: <CircleDot size={20} /> },
                        { value: 'multiple', label: 'Multiple Sources', sub: 'Combined methods of water supply', icon: <Layers size={20} /> },
                    ].map(opt => (
                        <button
                            key={opt.value}
                            className={`survey-option-card ${surveyData.waterSource === opt.value ? 'selected' : ''}`}
                            onClick={() => updateField('waterSource', opt.value)}
                        >
                            <div className="survey-option-icon-circle" style={{ background: '#f0f4f8' }}>
                                {opt.icon}
                            </div>
                            <div className="survey-option-text">
                                <span className="survey-option-label">{opt.label}</span>
                                <span className="survey-option-sub">{opt.sub}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Decorative farming quote card */}
                <div className="survey-quote-card">
                    <img
                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600"
                        alt="Irrigation"
                        className="survey-quote-img"
                    />
                    <div className="survey-quote-overlay">
                        <p className="survey-quote-text">"Water is the soul of the soil."</p>
                        <p className="survey-quote-label">AGRICULTURAL INSIGHT</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep6 = () => {
        const crops = [
            { value: 'rice', label: 'Rice', emoji: '🌾' },
            { value: 'wheat', label: 'Wheat', emoji: '🌿' },
            { value: 'cotton', label: 'Cotton', emoji: '🏔️' },
            { value: 'sugarcane', label: 'Sugarcane', emoji: '🫚' },
            { value: 'maize', label: 'Maize', emoji: '🌽' },
            { value: 'groundnut', label: 'Groundnut', emoji: '🥜' },
            { value: 'pulses', label: 'Pulses', emoji: '🫘' },
            { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
            { value: 'fruits', label: 'Fruits', emoji: '🍎' },
            { value: 'millets', label: 'Millets', emoji: '🌿' },
            { value: 'spices', label: 'Spices', emoji: '🌶️' },
            { value: 'other', label: 'Other', emoji: '🌱' },
        ];

        return (
            <div className="survey-step-content">
                <div className="survey-step-body">
                    <h2 className="survey-question-title">What crops do you grow?</h2>
                    <p className="survey-question-sub">Select all that apply to your farm</p>

                    <div className="survey-crop-grid">
                        {crops.map(crop => (
                            <button
                                key={crop.value}
                                className={`survey-crop-chip ${surveyData.primaryCrops.includes(crop.value) ? 'selected' : ''}`}
                                onClick={() => toggleCrop(crop.value)}
                            >
                                <span className="survey-crop-emoji">{crop.emoji}</span>
                                <span className="survey-crop-name">{crop.label}</span>
                                {surveyData.primaryCrops.includes(crop.value) && (
                                    <div className="survey-crop-check">
                                        <Check size={10} strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {surveyData.primaryCrops.length > 0 && (
                        <p className="survey-selected-count">
                            <Sprout size={14} /> {surveyData.primaryCrops.length} crop{surveyData.primaryCrops.length > 1 ? 's' : ''} selected
                        </p>
                    )}

                    <div className="survey-insight-card">
                        <div className="survey-insight-icon"><Info size={16} /></div>
                        <div>
                            <p className="survey-insight-title">CONSULTANCY INSIGHT</p>
                            <p className="survey-insight-text">Your crop selection helps us provide pest alerts, market prices, and seasonal recommendations tailored to your farming.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep7 = () => {
        const summaryItems = [
            { label: 'Language', value: surveyData.language === 'te' ? 'Telugu' : surveyData.language === 'hi' ? 'Hindi' : 'English', icon: '🌐' },
            { label: 'Farm Name', value: surveyData.farmName || '—', icon: '🏡' },
            { label: 'Farm Size', value: surveyData.farmSize ? `${surveyData.farmSize} ${surveyData.farmSizeUnit}` : '—', icon: '📐' },
            { label: 'Experience', value: surveyData.farmingExperience ? `${surveyData.farmingExperience} years` : '—', icon: '⏳' },
            { label: 'Land Type', value: surveyData.landOwnership ? surveyData.landOwnership.charAt(0).toUpperCase() + surveyData.landOwnership.slice(1) : '—', icon: '📋' },
            { label: 'Soil Type', value: surveyData.soilType ? surveyData.soilType.charAt(0).toUpperCase() + surveyData.soilType.slice(1) + ' Soil' : '—', icon: '🌍' },
            { label: 'Water Source', value: surveyData.waterSource ? surveyData.waterSource.charAt(0).toUpperCase() + surveyData.waterSource.slice(1) : '—', icon: '💧' },
            { label: 'Crops', value: surveyData.primaryCrops.length > 0 ? surveyData.primaryCrops.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') : '—', icon: '🌾' },
        ];

        return (
            <div className="survey-step-content">
                <div className="survey-step-body">
                    <div className="survey-summary-header">
                        <div className="survey-summary-icon-wrap">
                            <Check size={28} strokeWidth={3} />
                        </div>
                        <h2 className="survey-question-title" style={{ marginBottom: '4px' }}>Review Your Profile</h2>
                        <p className="survey-question-sub">Make sure everything looks good before we save</p>
                    </div>

                    <div className="survey-summary-grid">
                        {summaryItems.map((item, i) => (
                            <div key={i} className="survey-summary-item">
                                <span className="survey-summary-emoji">{item.icon}</span>
                                <div className="survey-summary-item-content">
                                    <span className="survey-summary-label">{item.label}</span>
                                    <span className="survey-summary-value">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const steps = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6, renderStep7];

    // ─── MAIN RENDER ────────────────────────────

    return (
        <div className="survey-root">
            {/* Header */}
            <div className="survey-header">
                <button className="survey-back-btn" onClick={goBack}>
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <span className="survey-header-title">Farmer Profile</span>
                <button className="survey-help-btn">
                    <HelpCircle size={20} strokeWidth={2} />
                </button>
            </div>

            {/* Progress Bar (hidden on step 1) */}
            {currentStep > 1 && (
                <div className="survey-progress-section">
                    <div className="survey-progress-info">
                        <span className="survey-progress-step">STEP {currentStep} OF {TOTAL_STEPS}</span>
                        <span className="survey-progress-percent">{progressPercent}% Complete</span>
                    </div>
                    <div className="survey-progress-track">
                        <div
                            className="survey-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div
                className="survey-content"
                ref={contentRef}
            >
                <div
                    className={`survey-slide ${isAnimating ? (slideDirection === 'next' ? 'slide-out-left' : 'slide-out-right') : 'slide-in'}`}
                >
                    {steps[currentStep - 1]()}
                </div>
            </div>

            {/* Bottom Button */}
            <div className="survey-footer">
                {currentStep === TOTAL_STEPS ? (
                    <button
                        className="survey-continue-btn submit"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <div className="survey-spinner" />
                        ) : (
                            <>
                                <Check size={18} strokeWidth={3} />
                                <span>COMPLETE SETUP</span>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        className="survey-continue-btn"
                        onClick={goNext}
                        disabled={!canProceed()}
                    >
                        <ArrowRight size={18} strokeWidth={2.5} />
                        <span>CONTINUE</span>
                    </button>
                )}
            </div>

            <style>{`
                /* ─── ROOT LAYOUT ──────────────────── */
                .survey-root {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    background: #f7f8fa;
                    z-index: 9999;
                    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
                }

                /* ─── HEADER ──────────────────────── */
                .survey-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 16px;
                    background: #fff;
                    border-bottom: 1px solid #e8ebe9;
                    flex-shrink: 0;
                }
                .survey-back-btn {
                    width: 36px; height: 36px;
                    display: flex; align-items: center; justify-content: center;
                    background: none; border: none; cursor: pointer;
                    color: #1e4a31; border-radius: 10px;
                    transition: background 0.2s;
                }
                .survey-back-btn:hover { background: #f0f4f2; }
                .survey-header-title {
                    font-weight: 800; font-size: 16px; color: #1e4a31; letter-spacing: -0.3px;
                }
                .survey-help-btn {
                    width: 36px; height: 36px;
                    display: flex; align-items: center; justify-content: center;
                    background: #e8f5e9; border: none; cursor: pointer;
                    color: #2d7e48; border-radius: 50%;
                    transition: background 0.2s;
                }
                .survey-help-btn:hover { background: #c8e6c9; }

                /* ─── PROGRESS ─────────────────────── */
                .survey-progress-section {
                    padding: 16px 20px 12px;
                    background: #fff;
                    flex-shrink: 0;
                }
                .survey-progress-info {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 8px;
                }
                .survey-progress-step {
                    font-size: 11px; font-weight: 800; color: #64748b;
                    letter-spacing: 0.5px; text-transform: uppercase;
                }
                .survey-progress-percent {
                    font-size: 12px; font-weight: 700; color: #2d7e48;
                }
                .survey-progress-track {
                    height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;
                }
                .survey-progress-fill {
                    height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a);
                    border-radius: 999px;
                    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* ─── CONTENT ─────────────────────── */
                .survey-content {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                }
                .survey-step-content {
                    max-width: 480px;
                    margin: 0 auto;
                }
                .survey-step-body {
                    padding: 24px 20px 120px;
                }

                /* ─── SLIDE ANIMATIONS ────────────── */
                .survey-slide { transition: all 0.25s ease; }
                .slide-in { opacity: 1; transform: translateX(0); }
                .slide-out-left { opacity: 0; transform: translateX(-40px); }
                .slide-out-right { opacity: 0; transform: translateX(40px); }

                /* ─── HERO BANNER (Step 1) ────────── */
                .survey-hero-banner {
                    position: relative; height: 200px; overflow: hidden;
                }
                .survey-hero-img {
                    width: 100%; height: 100%; object-fit: cover;
                }
                .survey-hero-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to bottom, rgba(30,74,49,0.1), rgba(30,74,49,0.5));
                    display: flex; align-items: flex-end; justify-content: center; padding-bottom: 20px;
                }
                .survey-hero-icon {
                    width: 56px; height: 56px; border-radius: 16px;
                    background: rgba(255,255,255, 0.25);
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    border: 2px solid rgba(255,255,255,0.4);
                    position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%);
                    z-index: 2; background: #1e4a31;
                    box-shadow: 0 8px 24px rgba(30,74,49,0.3);
                }
                .survey-app-title {
                    font-size: 26px; font-weight: 900; color: #1e4a31;
                    margin-top: 40px; margin-bottom: 4px; letter-spacing: -0.5px;
                }
                .survey-subtitle {
                    font-size: 14px; color: #64748b; font-weight: 500;
                }

                /* ─── OPTION CARDS ─────────────────── */
                .survey-options-list {
                    display: flex; flex-direction: column; gap: 12px;
                }
                .survey-option-card {
                    display: flex; align-items: center; gap: 14px;
                    width: 100%; padding: 16px 18px; background: #fff;
                    border: 2px solid #e8ebe9; border-radius: 16px;
                    cursor: pointer; transition: all 0.2s ease;
                    text-align: left;
                }
                .survey-option-card:hover {
                    border-color: #a7d5b6; background: #fafffe;
                }
                .survey-option-card.selected {
                    border-color: #2d7e48; background: #f0fdf4;
                    box-shadow: 0 0 0 3px rgba(45,126,72,0.08);
                }
                .survey-option-icon-circle {
                    width: 44px; height: 44px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; color: #334155;
                }
                .survey-option-text {
                    flex: 1; display: flex; flex-direction: column; gap: 2px;
                }
                .survey-option-label {
                    font-size: 15px; font-weight: 700; color: #1e293b;
                }
                .survey-option-sub {
                    font-size: 12px; color: #94a3b8; font-weight: 500; line-height: 1.4;
                }
                .survey-radio {
                    width: 22px; height: 22px; border-radius: 50%;
                    border: 2px solid #cbd5e1; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }
                .survey-radio.active {
                    border-color: #2d7e48; background: #2d7e48; color: #fff;
                }

                /* ─── QUESTION TITLES ─────────────── */
                .survey-question-title {
                    font-size: 24px; font-weight: 900; color: #0f172a;
                    line-height: 1.2; margin-bottom: 6px; letter-spacing: -0.5px;
                }
                .survey-question-sub {
                    font-size: 14px; color: #94a3b8; font-weight: 500; margin-bottom: 4px;
                }

                /* ─── FORM INPUTS ─────────────────── */
                .survey-form-group {
                    margin-top: 20px;
                }
                .survey-form-label {
                    display: block; font-size: 11px; font-weight: 800;
                    text-transform: uppercase; letter-spacing: 0.8px;
                    color: #64748b; margin-bottom: 8px;
                }
                .survey-form-input {
                    width: 100%; padding: 14px 16px; border: 2px solid #e2e8f0;
                    border-radius: 14px; font-size: 15px; font-weight: 600;
                    color: #1e293b; background: #fff; outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: inherit;
                }
                .survey-form-input:focus {
                    border-color: #2d7e48;
                    box-shadow: 0 0 0 3px rgba(45,126,72,0.1);
                }
                .survey-form-input::placeholder { color: #cbd5e1; font-weight: 500; }
                .survey-form-row {
                    display: flex; gap: 12px; align-items: flex-end;
                }

                /* ─── CHIPS ───────────────────────── */
                .survey-chip-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
                }
                .survey-chip {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 12px 16px; border: 2px solid #e2e8f0;
                    border-radius: 12px; font-size: 13px; font-weight: 700;
                    color: #475569; background: #fff; cursor: pointer;
                    transition: all 0.2s;
                }
                .survey-chip:hover { border-color: #a7d5b6; background: #fafffe; }
                .survey-chip.selected {
                    border-color: #2d7e48; background: #f0fdf4; color: #1e4a31;
                }

                /* ─── SOIL GRID (Step 4) ──────────── */
                .survey-soil-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
                    margin-top: 20px;
                }
                .survey-soil-card {
                    display: flex; flex-direction: column; gap: 8px;
                    background: none; border: 3px solid transparent;
                    border-radius: 16px; cursor: pointer; padding: 0;
                    transition: all 0.2s; overflow: hidden;
                }
                .survey-soil-card.selected {
                    border-color: #2d7e48;
                }
                .survey-soil-img-wrap {
                    position: relative; aspect-ratio: 1; overflow: hidden;
                    border-radius: 14px; border: 2px solid #e8ebe9;
                }
                .survey-soil-card.selected .survey-soil-img-wrap {
                    border-color: #2d7e48;
                }
                .survey-soil-img {
                    width: 100%; height: 100%; object-fit: cover;
                }
                .survey-soil-check {
                    position: absolute; top: 8px; right: 8px;
                    width: 26px; height: 26px; border-radius: 50%;
                    background: #2d7e48; color: #fff;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .survey-soil-label {
                    font-size: 14px; font-weight: 700; color: #475569; padding: 2px 4px;
                }
                .survey-soil-label.active {
                    color: #2d7e48;
                }

                /* ─── I DON'T KNOW ────────────────── */
                .survey-idk-btn {
                    display: flex; align-items: center; gap: 12px;
                    width: 100%; padding: 14px 18px; margin-top: 16px;
                    background: #f8fafc; border: 2px solid #e2e8f0;
                    border-radius: 14px; cursor: pointer;
                    transition: all 0.2s; font-family: inherit;
                }
                .survey-idk-btn:hover { border-color: #cbd5e1; }
                .survey-idk-btn.selected { border-color: #2d7e48; background: #f0fdf4; }
                .survey-idk-icon {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: #e2e8f0; display: flex; align-items: center; justify-content: center;
                    font-size: 16px; font-weight: 900; color: #64748b;
                }
                .survey-idk-btn span:nth-child(2) {
                    flex: 1; text-align: left; font-size: 14px; font-weight: 700; color: #475569;
                }
                .survey-idk-arrow { color: #94a3b8; }

                /* ─── CROP CHIPS (Step 6) ─────────── */
                .survey-crop-grid {
                    display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;
                }
                .survey-crop-chip {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 16px; border: 2px solid #e2e8f0;
                    border-radius: 999px; font-size: 13px; font-weight: 700;
                    color: #475569; background: #fff; cursor: pointer;
                    transition: all 0.2s; position: relative;
                }
                .survey-crop-chip:hover { border-color: #a7d5b6; }
                .survey-crop-chip.selected {
                    border-color: #2d7e48; background: #f0fdf4; color: #1e4a31;
                }
                .survey-crop-emoji { font-size: 16px; }
                .survey-crop-name { font-weight: 700; }
                .survey-crop-check {
                    width: 16px; height: 16px; border-radius: 50%;
                    background: #2d7e48; color: #fff;
                    display: flex; align-items: center; justify-content: center;
                }
                .survey-selected-count {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 13px; font-weight: 700; color: #2d7e48;
                    margin-top: 16px;
                }

                /* ─── INSIGHT CARD ────────────────── */
                .survey-insight-card {
                    display: flex; gap: 12px; padding: 16px;
                    background: #f0f9ff; border-radius: 14px;
                    margin-top: 28px; align-items: flex-start;
                }
                .survey-insight-icon {
                    width: 28px; height: 28px; border-radius: 50%;
                    background: #dbeafe; display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; color: #3b82f6;
                }
                .survey-insight-title {
                    font-size: 10px; font-weight: 800; letter-spacing: 1px;
                    color: #2563eb; margin-bottom: 4px; text-transform: uppercase;
                }
                .survey-insight-text {
                    font-size: 12px; color: #64748b; line-height: 1.5; font-weight: 500;
                }

                /* ─── QUOTE CARD (Step 5) ─────────── */
                .survey-quote-card {
                    position: relative; border-radius: 16px; overflow: hidden;
                    margin-top: 24px; height: 140px;
                }
                .survey-quote-img {
                    width: 100%; height: 100%; object-fit: cover;
                }
                .survey-quote-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1));
                    display: flex; flex-direction: column; justify-content: flex-end;
                    padding: 20px;
                }
                .survey-quote-text {
                    font-size: 16px; font-weight: 700; color: #fff; font-style: italic;
                }
                .survey-quote-label {
                    font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
                    color: rgba(255,255,255,0.7); margin-top: 4px; text-transform: uppercase;
                }

                /* ─── SUMMARY (Step 7) ────────────── */
                .survey-summary-header {
                    display: flex; flex-direction: column; align-items: center;
                    text-align: center; margin-bottom: 28px;
                }
                .survey-summary-icon-wrap {
                    width: 64px; height: 64px; border-radius: 50%;
                    background: linear-gradient(135deg, #bbf7d0, #22c55e);
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; margin-bottom: 16px;
                    box-shadow: 0 8px 24px rgba(34,197,94,0.25);
                }
                .survey-summary-grid {
                    display: flex; flex-direction: column; gap: 8px;
                }
                .survey-summary-item {
                    display: flex; align-items: center; gap: 14px;
                    padding: 14px 16px; background: #fff;
                    border: 1px solid #f1f5f9; border-radius: 14px;
                }
                .survey-summary-emoji { font-size: 22px; }
                .survey-summary-item-content {
                    display: flex; flex-direction: column; gap: 1px;
                }
                .survey-summary-label {
                    font-size: 10px; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 0.8px; color: #94a3b8;
                }
                .survey-summary-value {
                    font-size: 14px; font-weight: 700; color: #1e293b;
                }

                /* ─── FOOTER BUTTON ───────────────── */
                .survey-footer {
                    padding: 16px 20px; padding-bottom: calc(16px + env(safe-area-inset-bottom));
                    background: #fff;
                    border-top: 1px solid #e8ebe9;
                    flex-shrink: 0;
                    max-width: 480px;
                    margin: 0 auto;
                    width: 100%;
                }
                .survey-continue-btn {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    width: 100%; padding: 16px;
                    background: #1e4a31; color: #fff;
                    border: none; border-radius: 14px;
                    font-size: 14px; font-weight: 800; letter-spacing: 1px;
                    cursor: pointer; transition: all 0.2s;
                    font-family: inherit; text-transform: uppercase;
                }
                .survey-continue-btn:hover:not(:disabled) {
                    background: #16382a; transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(30,74,49,0.25);
                }
                .survey-continue-btn:active:not(:disabled) { transform: scale(0.98); }
                .survey-continue-btn:disabled {
                    background: #cbd5e1; cursor: not-allowed;
                }
                .survey-continue-btn.submit {
                    background: linear-gradient(135deg, #16a34a, #15803d);
                }
                .survey-continue-btn.submit:hover:not(:disabled) {
                    background: linear-gradient(135deg, #15803d, #166534);
                }

                /* ─── SPINNER ─────────────────────── */
                .survey-spinner {
                    width: 22px; height: 22px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ─── DESKTOP CENTERING ───────────── */
                @media (min-width: 520px) {
                    .survey-root {
                        background: #e8ebe9;
                    }
                    .survey-header {
                        max-width: 480px; margin: 0 auto;
                        border-left: 1px solid #e8ebe9;
                        border-right: 1px solid #e8ebe9;
                    }
                    .survey-progress-section {
                        max-width: 480px; margin: 0 auto;
                        border-left: 1px solid #e8ebe9;
                        border-right: 1px solid #e8ebe9;
                    }
                    .survey-content {
                        max-width: 480px; margin: 0 auto;
                        background: #f7f8fa;
                        border-left: 1px solid #e8ebe9;
                        border-right: 1px solid #e8ebe9;
                    }
                    .survey-footer {
                        border-left: 1px solid #e8ebe9;
                        border-right: 1px solid #e8ebe9;
                    }
                }
            `}</style>
        </div>
    );
};

export default FarmerOnboardingSurvey;
