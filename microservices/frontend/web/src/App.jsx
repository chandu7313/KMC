

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AppRouter } from '@/app/router/AppRouter';
import FloatingSupport from '@/shared/ui/FloatingSupport';
import ErrorBoundary from '@/shared/ui/ErrorBoundary';
import { useGlobalStore } from '@/app/store/globalStore';

const App = () => {
  const location = useLocation();
  const hideSupportPaths = ['/login', '/reset-password', '/email-verify'];
  const getAuthState = useGlobalStore((state) => state.getAuthState);

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  return (
    <div className="">
      <ToastContainer position="top-right" autoClose={3000} style={{ marginTop: '70px' }} />
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
      {!hideSupportPaths.includes(location.pathname) && <FloatingSupport />}
    </div>
  );
};

export default App;
