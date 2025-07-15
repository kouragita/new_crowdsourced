import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaSyncAlt } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // In a real app, you would send this to your error tracking service
    // like Sentry, LogRocket, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('Error logged:', errorData);
    
    // Example: Send to error tracking service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6">
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="bg-white rounded-full p-3 mr-4"
                >
                  <FaExclamationTriangle className="text-red-500 text-3xl" />
                </motion.div>
                <div className="text-center">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    Oops! Something went wrong
                  </h1>
                  <p className="text-red-100 mt-2">
                    We encountered an unexpected error
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              <div className="text-center mb-8">
                <p className="text-gray-600 text-lg mb-4">
                  Don't worry! This happens sometimes. Here are a few things you can try:
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={this.handleRetry}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSyncAlt className="text-sm" />
                    <span>Try Again</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={this.handleRefresh}
                    className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSyncAlt className="text-sm" />
                    <span>Reload Page</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaHome className="text-sm" />
                    <span>Go Home</span>
                  </motion.button>
                </div>
              </div>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-gray-100 rounded-lg p-4 mt-6">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Technical Details (Development Mode)
                  </summary>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <strong>Error:</strong>
                      <pre className="bg-red-50 p-2 rounded mt-1 text-xs overflow-auto">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="bg-red-50 p-2 rounded mt-1 text-xs overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    <div>
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                  </div>
                </details>
              )}

              {/* Help Text */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
                <p className="text-blue-700 text-sm">
                  If this problem persists, please contact our support team with the error ID: 
                  <code className="bg-blue-100 px-1 rounded ml-1">{this.state.errorId}</code>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;