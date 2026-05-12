/**
 * Role Guard
 * Checks if the current user has one of the allowed roles.
 * Redirects to home if unauthorized.
 */
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import Spinner from '../../../shared/components/ui/Spinner';
import ROUTES from '../../../core/router/routeConfig';

const RoleGuard = ({ allowedRoles = [], children }) => {
  const { isLoggedin, userData, loading } = useContext(AppContext);

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
