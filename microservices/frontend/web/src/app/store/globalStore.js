import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGlobalStore = create(
  persist(
    (set) => ({
      // Theme State
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),

      // Language State
      language: 'en',
      setLanguage: (language) => set({ language }),

      // User Context (Simple auth state, full auth belongs in auth module)
      isAuthenticated: false,
      userRole: null,
      setAuth: (isAuthenticated, userRole) => set({ isAuthenticated, userRole }),
      logout: () => set({ isAuthenticated: false, userRole: null }),
    }),
    {
      name: 'kmc-global-storage', // unique name for localStorage key
    }
  )
);
