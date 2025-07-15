import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('role');
  const isAuthenticated = !!token;
  const isAdmin = userRole === 'admin';

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin role is required but user is not admin
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    toast.error('Access denied. Admin privileges required.');
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but trying to access auth pages (login/signup)
  if (!requireAuth && isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/dashboard" replace />;
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