/**
 * Protected Route Guard
 * Redirects unauthenticated users to the login page.
 */
import React, {} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../../../shared/components/ui/Spinner';
import ROUTES from '../../../core/router/routeConfig';
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

  return children;
};

export default ProtectedRoute;
