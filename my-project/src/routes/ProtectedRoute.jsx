import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader'; // Make sure you have this component
import { useEffect, useRef } from 'react';
import { ErrorToast } from '../utils/Toast';
// import ErrorMessage from '../components/'; // Make sure you have this component

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isLoggedIn, loading, user, logout } = useAuth(); // ✅ Get `user`

  const navigate = useNavigate();
  const hasNavigated = useRef(false);
  const hasShownToast = useRef(false);  // ✅ Tracks if toast shown

  useEffect(() => {
    if (loading) return; // Don't start interval until auth check finishes

    const interval = setInterval(() => {
      const token = localStorage.getItem('authToken');

      if (!token && !hasNavigated.current) {
        hasNavigated.current = true; // ✅ Prevent future navigations
        clearInterval(interval); // ✅ Stop checking

        if (!hasShownToast.current) {
          hasShownToast.current = true;
          ErrorToast('Your session has expired. Please log in again.');
        }

        logout()
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && (!user || !roles.includes(user.role))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {/* <ErrorMessage message="Access Denied" /> */}
        <p>Access Denied</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
