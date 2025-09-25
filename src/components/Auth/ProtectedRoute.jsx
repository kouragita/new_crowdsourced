import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUser } from '../../contexts/UserContext';
import { useRole } from '../../hooks/useRole';

const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-200/30 border-t-blue-200 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-white font-medium">Loading Session...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useUser();
  const { isAdmin } = useRole(); // Correctly use the dedicated role hook

  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && requireAuth && !toastShown) {
      toast.error('Please log in to access this page');
      setToastShown(true);
    }
  }, [loading, isAuthenticated, requireAuth, toastShown]);

  if (loading) {
    return <PageLoader />;
  }

  if (requireAuth) {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (!requireAuth && isAuthenticated) {
    const targetDashboard = isAdmin ? '/admin' : '/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;