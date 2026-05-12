/**
 * Auth Context
 * Manages authentication state extracted from the monolithic AppContext.
 * Provides: isLoggedin, userData, loading, and auth action methods.
 */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as authApi from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await authApi.getUserData();
      if (data.success) {
        setUserData(data.userData);
        return data.userData;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    return null;
  }, []);

  const getAuthState = useCallback(async () => {
    try {
      const data = await authApi.checkAuthState();
      if (data.success) {
        setIsLoggedin(true);
        await fetchUserData();
      }
    } catch (error) {
      // Not authenticated — this is normal for first visit
    } finally {
      setLoading(false);
    }
  }, [fetchUserData]);

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const value = {
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    loading,
    getUserData: fetchUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
