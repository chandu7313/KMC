/**
 * App.jsx — Root Application Component
 * 
 * This is the top-level component that:
 * 1. Wraps the app in the router (AppRouter)
 * 2. Renders global UI elements (Toast, FloatingSupport)
 * 
 * All route definitions live in core/router/AppRouter.jsx
 */
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AppRouter from './core/router/AppRouter';
import FloatingSupport from './shared/components/feedback/FloatingSupport';
import ErrorBoundary from './shared/components/feedback/ErrorBoundary';

const App = () => {
  const location = useLocation();
  const hideSupportPaths = ['/login', '/reset-password', '/email-verify'];

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
