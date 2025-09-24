import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUser } from '../../contexts/UserContext';

// Re-using the PageLoader from App.jsx for a consistent loading experience
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
  const { isAuthenticated, user, loading } = useUser();

  // 1. Wait for the user session to be loaded before making any decisions
  if (loading) {
    return <PageLoader />;
  }

  const userRole = user?.role;
  const isAdmin = userRole === 'admin';

  // 2. Handle routes that require authentication
  if (requireAuth) {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Handle admin-only routes
    if (requireAdmin && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      // Redirect non-admins away from admin pages to their own dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. Handle public routes like /login and /signup
  if (!requireAuth && isAuthenticated) {
    // If user is already logged in, redirect them away from login/signup
    // to their appropriate dashboard.
    const targetDashboard = isAdmin ? '/admin' : '/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  // 4. If all checks pass, render the requested component
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
