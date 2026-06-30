import React, { useState } from 'react';
import { Star, Clock, MessageSquare, ArrowRight, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useExpertConsultation from '../../../features/expert-consultation/hooks/useExpertConsultation';
import DetectedIssueAlert from '../../../features/expert-consultation/components/DetectedIssueAlert';
import TopicGrid from '../../../features/expert-consultation/components/TopicGrid';
import PhoneInput from '../../../features/expert-consultation/components/PhoneInput';
import CallTypeToggle from '../../../features/expert-consultation/components/CallTypeToggle';
import BookCallButton from '../../../features/expert-consultation/components/BookCallButton';
import ExpertCard from '../../../features/expert-consultation/components/ExpertCard';
import ExpertProfilePanel from '../../../features/expert-consultation/components/ExpertProfilePanel';
import BookingConfirmModal from '../../../features/expert-consultation/components/BookingConfirmModal';
import ConsultationHistory from '../../../features/expert-consultation/components/ConsultationHistory';
import ViewNotesModal from '../../../features/expert-consultation/components/ViewNotesModal';
import CancelDetailsModal from '../../../features/expert-consultation/components/CancelDetailsModal';

const directoryExperts = [
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
    }
];
const badgeStyles = {
    "TOP RATED": "bg-emerald-600 text-white",
    "BEST CHOICE": "bg-amber-500 text-white",
};
const filters = ["All", "Soil", "Crops", "Inputs"];

const ExpertSupportPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('support'); // 'support' | 'directory'
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    
    const filteredDirectory = directoryExperts.filter((e) => {
        const matchCat = activeFilter === "All" || e.category === activeFilter;
        const matchSearch =
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.specialty.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const {
        // Detected issue
        detectedIssue, issueLoading, dismissIssue,
        // Topic
        selectedTopic, handleTopicSelect,
        // Contact
        phone, setPhone,
        isEditingPhone, setIsEditingPhone,
        callType, setCallType,
        // Experts
        experts, expertsLoading,
        selectedExpert, setSelectedExpert,
        profilePanelOpen, setProfilePanelOpen,
        profileExpertId, setProfileExpertId,
        // Booking
        isBooking, handleBookCall,
        bookingConfirm, showConfirmModal, setShowConfirmModal,
        // History
        consultations, historyLoading, refetchHistory,
        // Modals
        notesModal, setNotesModal, handleViewNotes,
        detailsModal, setDetailsModal, handleViewDetails,
        // Helper
        isValidIndianPhone
    } = useExpertConsultation();

    const handleExpertSelect = (expert) => {
        setSelectedExpert(prev => prev?.id === expert.id ? null : expert);
    };

    const handleViewProfile = (expertId) => {
        setProfileExpertId(expertId);
        setProfilePanelOpen(true);
    };

    const handleBookAgain = (topic) => {
        if (topic) handleTopicSelect(topic);
    };

    // Expert card skeleton loader
    const ExpertSkeleton = () => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full animate-pulse">
            <div className="absolute top-0 right-0">
                <div className="h-6 w-24 bg-gray-200 rounded-bl-lg"></div>
            </div>
            <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
            <div className="flex gap-2 mb-5">
                <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-6 w-14 bg-gray-200 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
            </div>
            <div className="mt-auto">
                <div className="h-9 bg-gray-200 rounded-lg w-full"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expert Consultations & Support</h1>
                    <p className="text-gray-500 text-sm mt-1">Book a personalized session or browse our expert network.</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <button 
                        onClick={() => setActiveTab('support')}
                        className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'support' ? 'text-[#1b5e20]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Book & Manage Support
                        {activeTab === 'support' && <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#1b5e20]"></span>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('directory')}
                        className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'directory' ? 'text-[#1b5e20]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Expert Directory
                        {activeTab === 'directory' && <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#1b5e20]"></span>}
                    </button>
                </div>
            </div>

            {activeTab === 'support' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Booking Form */}
                <div id="booking-form" className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Talk to an Agriculture Expert</h2>

                    {/* Element 1: Detected Issue Alert */}
                    <DetectedIssueAlert
                        detectedIssue={detectedIssue}
                        issueLoading={issueLoading}
                        dismissIssue={dismissIssue}
                    />

                    {/* Element 2: Topic Grid */}
                    <TopicGrid
                        selectedTopic={selectedTopic}
                        onTopicSelect={handleTopicSelect}
                    />

                    {/* Element 3: Phone Input + Element 4: Call Type Toggle */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Details & Call Type</h3>
                        
                        <PhoneInput
                            phone={phone}
                            setPhone={setPhone}
                            isEditing={isEditingPhone}
                            setIsEditing={setIsEditingPhone}
                            isValidIndianPhone={isValidIndianPhone}
                        />

                        <CallTypeToggle
                            callType={callType}
                            setCallType={setCallType}
                        />
                        
                        {/* Element 5: Book Free Call Button */}
                        <BookCallButton
                            isBooking={isBooking}
                            handleBookCall={handleBookCall}
                            selectedTopic={selectedTopic}
                            showConfirmModal={showConfirmModal}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Element 6: Expert Cards */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Our Agriculture Experts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {expertsLoading ? (
                                <>
                                    <ExpertSkeleton />
                                    <ExpertSkeleton />
                                </>
                            ) : experts && experts.length > 0 ? (
                                experts.map(expert => (
                                    <ExpertCard
                                        key={expert.id}
                                        expert={expert}
                                        isSelected={selectedExpert?.id === expert.id}
                                        onSelect={handleExpertSelect}
                                        onViewProfile={handleViewProfile}
                                    />
                                ))
                            ) : (
                                <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-8 text-center">
                                    <p className="text-gray-600 font-semibold mb-1">No experts available for this topic right now.</p>
                                    <p className="text-sm text-gray-400">We'll auto-assign the best expert for you.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Element 8: Consultation History Table */}
                    <ConsultationHistory
                        consultations={consultations}
                        historyLoading={historyLoading}
                        handleViewNotes={handleViewNotes}
                        handleViewDetails={handleViewDetails}
                    />
                </div>
            </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-2">
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
                        <div className="relative w-full md:w-80">
                            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or specialty..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {filteredDirectory.length === 0 ? (
                        <div className="py-24 text-center text-slate-400 font-medium">
                            No experts found matching "{search}"
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDirectory.map((expert) => (
                                <div
                                    key={expert.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img src={expert.image} alt={expert.name} className="w-full h-full object-cover object-top" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                        {expert.badge && (
                                            <span className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeStyles[expert.badge]}`}>
                                                {expert.badge}
                                            </span>
                                        )}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            <span className={`w-2 h-2 rounded-full ${expert.available ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                                            <span className="text-[9px] font-black text-white uppercase tracking-wider">
                                                {expert.available ? "Available" : "Busy"}
                                            </span>
                                        </div>
                                    </div>
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
                                        <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">{expert.bio}</p>
                                        <button
                                            onClick={() => {
                                                setActiveTab('support');
                                                handleTopicSelect(expert.category);
                                            }}
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
                </div>
            )}

            {/* ─── Modals & Panels ───────────────────────────── */}

            {/* Element 7: Expert Profile Slide Panel */}
            <ExpertProfilePanel
                isOpen={profilePanelOpen}
                onClose={() => setProfilePanelOpen(false)}
                expertId={profileExpertId}
                onSelectExpert={(expert) => setSelectedExpert(expert)}
            />

            {/* Element 11: Booking Confirmation Modal */}
            <BookingConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                booking={bookingConfirm}
            />

            {/* Element 9: View Notes Modal */}
            <ViewNotesModal
                isOpen={!!notesModal}
                onClose={() => setNotesModal(null)}
                notes={notesModal}
                consultationId={notesModal?.id}
            />

            {/* Element 10: Cancel Details Modal */}
            <CancelDetailsModal
                isOpen={!!detailsModal}
                onClose={() => setDetailsModal(null)}
                consultation={detailsModal}
                onBookAgain={handleBookAgain}
            />
        </div>
    );
};

export default ExpertSupportPage;
