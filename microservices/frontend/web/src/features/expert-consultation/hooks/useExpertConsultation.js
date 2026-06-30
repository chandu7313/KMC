import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useGlobalStore } from '@/app/store/globalStore'; // using project's actual auth store
import api from '../../../core/api/axios.instance';
import { expertApi } from '../api/expert.api';

// ─── HELPER UTILITIES ────────────────────────────────────────

// Check if date is within N days from now
const isWithinDays = (dateString, days) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

// Validate Indian phone number
const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
};

// Format phone for display
const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.startsWith('91') ? cleaned.slice(2) : cleaned;
  return `+91 ${number.slice(0,5)} ${number.slice(5)}`;
};

// Generate booking notes
const generateBookingNotes = (issue, topic) => {
  if (issue?.type === 'disease') {
    return `${issue.name} detected in ${issue.crop}. Severity: ${issue.severity || 'unknown'}. Farmer needs treatment advice.`;
  }
  if (issue?.type === 'soil') {
    return `Soil issue: ${issue.name}. Farmer needs fertilizer recommendations.`;
  }
  const topicLabels = {
    crop_disease: 'crop disease identification',
    soil_health: 'soil health improvement',
    pest_management: 'pest control solutions',
    irrigation: 'irrigation management',
    crop_planning: 'crop planning advice',
    market: 'market price guidance'
  };
  return `Farmer needs help with ${topicLabels[topic] || topic}`;
};


// ─── MAIN HOOK ────────────────────────────────────────────────

const useExpertConsultation = () => {

  // ─── Detected Issue ─────────────────
  const [detectedIssue, setDetectedIssue] = useState(null);
  const [issueLoading, setIssueLoading] = useState(true);

  // ─── Topic Selection ────────────────
  const [selectedTopic, setSelectedTopic] = useState(null);

  // ─── Contact Details ────────────────
  const { userData } = useGlobalStore();
  const [phone, setPhone] = useState(userData?.phone || '');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [callType, setCallType] = useState('phone');

  // ─── Expert Selection ───────────────
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [profileExpertId, setProfileExpertId] = useState(null);

  // ─── Booking ────────────────────────
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirm, setBookingConfirm] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ─── Notes Modal ────────────────────
  const [notesModal, setNotesModal] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  // ─── Experts State ──────────────────
  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  // ─── History State ──────────────────
  const [consultations, setConsultations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ─── Load detected issue on mount ───
  useEffect(() => {
    loadDetectedIssue();
  }, []);

  // ─── Fetch experts on topic change ───
  useEffect(() => {
    const fetchExperts = async () => {
      setExpertsLoading(true);
      try {
        const response = await expertApi.getExperts({
          topic: selectedTopic,
          available: true
        });
        setExperts(response.data || []);
      } catch (err) {
        toast.error('Failed to load experts');
      } finally {
        setExpertsLoading(false);
      }
    };

    fetchExperts();
  }, [selectedTopic]);

  // ─── Fetch consultation history ───────
  const refetchHistory = useCallback(async () => {
    if (!userData) {
      setConsultations([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const response = await expertApi.getMyConsultations({
        page: 1,
        limit: 5
      });
      setConsultations(response.data || []);
    } catch (err) {
      // Mock history on failure or auth issue if testing
    } finally {
      setHistoryLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    refetchHistory();
  }, [refetchHistory]);

  const loadDetectedIssue = async () => {
    if (!userData) {
      setIssueLoading(false);
      return;
    }
    try {
      setIssueLoading(true);

      const [diseaseRes, soilRes] = await Promise.allSettled([
        api.get('/api/disease/history', { params: { limit: 1 } }),
        api.get('/api/soil/history', { params: { limit: 1 } })
      ]);

      const lastScan = diseaseRes.status === 'fulfilled' ? diseaseRes.value?.data?.scans?.[0] : null;

      if (lastScan && isWithinDays(lastScan.createdAt, 7) && !lastScan.isHealthy) {
        setDetectedIssue({
          type: 'disease',
          name: lastScan.diseaseName,
          crop: lastScan.affectedCrop,
          severity: lastScan.severity,
          id: lastScan.id
        });
        setSelectedTopic('crop_disease');
        return;
      }

      const lastSoil = soilRes.status === 'fulfilled' ? soilRes.value?.data?.reports?.[0] : null;

      if (lastSoil && isWithinDays(lastSoil.createdAt, 30) && lastSoil.deficiencies?.length > 0) {
        setDetectedIssue({
          type: 'soil',
          name: lastSoil.deficiencies.join(', ') + ' deficiency',
          crop: lastSoil.cropPlanned || 'your crop',
          id: lastSoil.id
        });
        setSelectedTopic('soil_health');
      }

    } catch {
      // Non-critical — silently ignore
    } finally {
      setIssueLoading(false);
    }
  };

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(prev => prev === topicId ? null : topicId);
    // Deselect expert if topic changes
    if (selectedExpert) {
      setSelectedExpert(null);
    }
  };

  const handleBookCall = async () => {
    // Validate
    if (!selectedTopic) {
      toast.error('Please select a topic first');
      return;
    }
    if (!isValidIndianPhone(phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsBooking(true);

    try {
      const response = await expertApi.bookConsultation({
        expertId: selectedExpert?.id || null,
        topic: selectedTopic,
        callType,
        phone,
        notes: generateBookingNotes(detectedIssue, selectedTopic),
        detectedIssueId: detectedIssue?.id || null,
        detectedIssueType: detectedIssue?.type || null
      });

      setBookingConfirm(response.data.booking);
      setShowConfirmModal(true);
      refetchHistory();
      toast.success(`Call booked with ${response.data.booking.expertName}!`);

    } catch (error) {
      if (error.response?.data?.code === 'NO_SLOTS_AVAILABLE' || error.code === 'NO_SLOTS_AVAILABLE') {
        toast.error("Fully booked. We'll assign another expert.");
      } else {
        toast.error(error.response?.data?.message || error.message || 'Booking failed');
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleViewNotes = async (consultationId) => {
    try {
      const res = await expertApi.getConsultationNotes(consultationId);
      setNotesModal(res.data);
    } catch {
      toast.error('Could not load notes');
    }
  };

  const handleViewDetails = (consultation) => {
    setDetailsModal(consultation);
  };

  return {
    // Detected issue
    detectedIssue, issueLoading,
    dismissIssue: () => {
      setDetectedIssue(null);
      setSelectedTopic(null);
    },
    // Topic
    selectedTopic,
    handleTopicSelect,
    // Contact
    phone, setPhone,
    isEditingPhone, setIsEditingPhone,
    callType, setCallType,
    // Experts
    experts: experts?.data || [],
    expertsLoading,
    selectedExpert, setSelectedExpert,
    profilePanelOpen, setProfilePanelOpen,
    profileExpertId, setProfileExpertId,
    // Booking
    isBooking,
    handleBookCall,
    bookingConfirm,
    showConfirmModal,
    setShowConfirmModal,
    // History
    consultations: consultations?.data || [],
    historyLoading,
    refetchHistory,
    // Modals
    notesModal, setNotesModal,
    handleViewNotes,
    detailsModal, setDetailsModal,
    handleViewDetails,
    // Helper
    isValidIndianPhone
  };
};

export default useExpertConsultation;
