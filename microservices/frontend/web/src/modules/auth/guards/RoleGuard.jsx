/**
 * Role Guard
 * Checks if the current user has one of the allowed roles.
 * Redirects to home if unauthorized.
 */
import React, {} from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../../../shared/components/ui/Spinner';
import ROUTES from '../../../core/router/routeConfig';
import { useGlobalStore } from '@/app/store/globalStore';

const RoleGuard = ({ allowedRoles = [], children }) => {
  const { isLoggedin, userData, loading } = useGlobalStore();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" label="Checking permissions..." />
      </div>
    );
  }

  if (!isLoggedin) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const userRole = userData?.role || '';
  const isAdminUser = userData?.isAdminUser || false;

  if (!allowedRoles.includes(userRole) && !isAdminUser) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default RoleGuard;
