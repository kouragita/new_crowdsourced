import React from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import App from './App.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// Enhanced Error Boundary Component
const AppErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl"
          >
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Reload Page
            </button>
          </motion.div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// App Providers Wrapper
const AppProviders = ({ children }) => {
  return (
    <UserProvider>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </UserProvider>
  );
};

// Main App Wrapper with PWA functionality
const MainApp = () => {
  React.useEffect(() => {
    // Remove loading screen once React is ready
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 1000);
    }

    // Check for app updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              if (confirm('A new version is available. Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      });
    }

    // Handle online/offline status
    const handleOnline = () => {
      console.log('App is online');
    };

    const handleOffline = () => {
      console.log('App is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <React.StrictMode>
      <AppErrorBoundary>
        <AppProviders>
          <App />
        </AppProviders>
      </AppErrorBoundary>
    </React.StrictMode>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);