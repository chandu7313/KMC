import React from 'react';
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

const ExpertSupportPage = () => {
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Expert Consultation</h1>
                <p className="text-gray-500 text-sm mt-1">Book a personalized session with our agricultural specialists.</p>
            </div>

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
