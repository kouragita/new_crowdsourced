import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaGithub,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/UserContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  // Get the intended destination from location state
  const from = location.state?.from || "/dashboard";

  // Check for saved credentials
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
    
    if (savedPassword) {
      setFormData(prev => ({ ...prev, password: savedPassword }));
    }
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username or email is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://e-learn-ncux.onrender.com/auth/login",
        {
          username: formData.username.trim(),
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.access_token) {
        const userData = {
          username: formData.username.trim(),
          email: response.data.email || '',
          role: response.data.role || 'student',
          totalPoints: response.data.total_points || 0,
          currentStreak: response.data.current_streak || 0,
          badges: response.data.badges || [],
          profilePicture: response.data.profile_picture || null
        };

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", formData.username.trim());
          localStorage.setItem("rememberedPassword", formData.password);
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
        }

        // Login user through context
        login(userData, response.data.access_token);

        // Navigate to intended destination
        navigate(from, { replace: true });
        
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response?.status === 401) {
        setErrors({ general: "Invalid username or password" });
        toast.error("Invalid credentials. Please try again.");
      } else if (error.response?.status === 429) {
        setErrors({ general: "Too many login attempts. Please try again later." });
        toast.error("Too many attempts. Please wait before trying again.");
      } else {
        const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4:
      case 5: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4:
      case 5: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/" className="inline-block">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CrowdSourced
            </h2>
          </Link>
          <p className="mt-2 text-gray-600">
            Welcome back! Sign in to your account
          </p>
          {from !== "/dashboard" && (
            <p className="text-sm text-blue-600 mt-1">
              Sign in to access: {from.replace('/dashboard/', '').replace('/', '')}
            </p>
          )}
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
              Continue with Google
            </motion.button>
            
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <FaFacebook className="w-5 h-5 text-blue-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <FaGithub className="w-5 h-5 text-gray-800" />
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
              >
                <FaExclamationTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{errors.general}</span>
              </motion.div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Enter your username or email"
                />
                {!errors.username && formData.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.username}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Account Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <strong>Demo:</strong> Use any username and password to test the login flow
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;