import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/HomePages.jsx';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import Calendar from './components/Calendar.jsx';
import CoursesPage from './pages/CoursesPages.jsx';
import Leaderboard from './components/LeaderBoard.jsx';
import AdminPanel from './components/AdminDashboard.jsx';

// Styles
import './index.css';

// Enhanced loading component
const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-200/30 border-t-blue-200 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-white font-medium">Loading...</p>
    </div>
  </div>
);

// Route wrapper with animation
const AnimatedRoute = ({ children }) => (
  <AnimatePresence mode="wait">
    {children}
  </AnimatePresence>
);

const App = () => {
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // Handle app install prompt
  useEffect(() => {
    let deferredPrompt;
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      window.deferredPrompt = deferredPrompt;
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      window.deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Check for app updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          <AnimatedRoute>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              
              {/* Auth routes - redirect to dashboard if already logged in */}
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <SignupForm />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                {/* Nested dashboard routes */}
                <Route index element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="calendar" element={<Calendar />} />
                <Route 
                  path="leaderboard" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <Leaderboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="user-dashboard/:id" element={<UserDashboard />} />
                
                {/* Admin only route */}
                <Route 
                  path="admin" 
                  element={
                    <ProtectedRoute requireAuth={true} requireAdmin={true}>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Route>

              {/* Public leaderboard route with protection */}
              <Route 
                path="/leaderboard" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Leaderboard />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatedRoute>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;