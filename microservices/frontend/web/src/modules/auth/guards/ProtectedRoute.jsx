/**
 * Protected Route Guard
 * Redirects unauthenticated users to the login page.
 */
import React, {} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '@/shared/ui/Spinner';
import ROUTES from '@/core/router/routeConfig';
import { useGlobalStore } from '@/app/store/globalStore';

const ProtectedRoute = ({ children }) => {
  const { isLoggedin, loading } = useGlobalStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!isLoggedin) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const { userData } = useGlobalStore.getState();
  
  if (userData && !userData.isAdminUser && !userData.hasCompletedSurvey && location.pathname !== ROUTES.ONBOARDING_SURVEY) {
    return <Navigate to={ROUTES.ONBOARDING_SURVEY} replace />;
  }

  return children;
};

export default ProtectedRoute;
