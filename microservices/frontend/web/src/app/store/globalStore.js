import { create } from 'zustand';
import { toast } from 'react-toastify';
import { checkAuthState, getUserData as fetchUserData } from '@/modules/auth/api/auth.api';

export const useGlobalStore = create((set, get) => ({
  // State
  backendUrl: import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost',
  isLoggedin: false,
  userData: false,
  loading: true,
  runTour: false,
  voiceEnabled: localStorage.getItem('voiceEnabled') !== 'false',

  // Basic Setters
  setIsLoggedin: (status) => set({ isLoggedin: status }),
  setUserData: (data) => set({ userData: data }),
  setLoading: (status) => set({ loading: status }),
  setRunTour: (status) => set({ runTour: status }),

  // Actions
  getAuthState: async () => {
    try {
      set({ loading: true });
      const data = await checkAuthState();
      if (data.success) {
        set({ isLoggedin: true });
        await get().getUserData();
      } else {
        set({ loading: false });
      }
    } catch (error) {
      toast.error(error.message || "Failed to check authentication");
      set({ loading: false });
    }
  },

  getUserData: async () => {
    try {
      const data = await fetchUserData();
      if (data.success) {
        set({ userData: data.userData });
        // NOTE: cartData is now handled by cartStore, so we'll need to trigger it separately
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch user data");
    } finally {
      set({ loading: false });
    }
  },

  completeTour: () => {
    set({ runTour: false });
    localStorage.setItem('tourCompleted', 'true');
  },

  toggleVoice: () => {
    set((state) => {
      const newValue = !state.voiceEnabled;
      localStorage.setItem('voiceEnabled', String(newValue));
      if (!newValue && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return { voiceEnabled: newValue };
    });
  }
}));
