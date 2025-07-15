import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaGithub,
  FaUser,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaCheck,
  FaGraduationCap
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/UserContext";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const navigate = useNavigate();
  const { login } = useUser();

  // Password requirements
  const passwordRequirements = [
    { id: 'length', text: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { id: 'uppercase', text: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', text: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', text: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
    { id: 'special', text: 'One special character', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) }
  ];

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    return passwordRequirements.filter(req => req.test(password)).length;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, assume usernames starting with 'admin' are taken
      const available = !username.toLowerCase().startsWith('admin');
      setUsernameAvailable(available);
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Check email availability
  const checkEmailAvailability = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailAvailable(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, assume emails with 'test' are taken
      const available = !email.toLowerCase().includes('test');
      setEmailAvailable(available);
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username) {
        checkUsernameAvailability(formData.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Debounced email check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email) {
        checkEmailAvailability(formData.email);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step >= 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores";
      } else if (usernameAvailable === false) {
        newErrors.username = "Username is already taken";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      } else if (emailAvailable === false) {
        newErrors.email = "Email is already registered";
      }
    }

    if (step >= 2) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (passwordStrength < 4) {
        newErrors.password = "Password must meet at least 4 requirements";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://e-learn-ncux.onrender.com/auth/register",
        {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
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
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          role: 'student',
          totalPoints: 0,
          currentStreak: 0,
          badges: [],
          profilePicture: null
        };

        // Login user through context
        login(userData, response.data.access_token);

        toast.success("Account created successfully! Welcome to CrowdSourced!");
        
        // Navigate to dashboard
        navigate("/dashboard");
        
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.response?.status === 409) {
        setErrors({ general: "Username or email already exists" });
        toast.error("Account already exists. Please try different credentials.");
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Invalid form data";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      } else {
        const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    toast.info(`${provider} signup coming soon!`);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };

  const stepTitles = {
    1: "Create Your Account",
    2: "Secure Your Account"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/" className="inline-block">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              CrowdSourced
            </h2>
          </Link>
          <p className="mt-2 text-gray-600">
            Join our learning community today
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? <FaCheck className="w-5 h-5" /> : step}
              </div>
              {step < 2 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  currentStep > step ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          {/* Step Title */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {stepTitles[currentStep]}
            </h3>
            <p className="text-gray-600 mt-2">
              {currentStep === 1 ? "Let's get to know you better" : "Create a secure password"}
            </p>
          </div>

          {/* Social Signup (Step 1 only) */}
          {currentStep === 1 && (
            <div className="space-y-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialSignup('Google')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
                Sign up with Google
              </motion.button>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialSignup('Facebook')}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <FaFacebook className="w-5 h-5 text-blue-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialSignup('GitHub')}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <FaGithub className="w-5 h-5 text-gray-800" />
                </motion.button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6"
            >
              <FaExclamationTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="Choose a username"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isCheckingUsername && <FaSpinner className="h-4 w-4 text-gray-400 animate-spin" />}
                        {!isCheckingUsername && usernameAvailable === true && <FaCheckCircle className="h-5 w-5 text-green-500" />}
                        {!isCheckingUsername && usernameAvailable === false && <FaTimes className="h-5 w-5 text-red-500" />}
                      </div>
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                    {usernameAvailable === true && (
                      <p className="mt-1 text-sm text-green-600">Username is available!</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isCheckingEmail && <FaSpinner className="h-4 w-4 text-gray-400 animate-spin" />}
                        {!isCheckingEmail && emailAvailable === true && <FaCheckCircle className="h-5 w-5 text-green-500" />}
                        {!isCheckingEmail && emailAvailable === false && <FaTimes className="h-5 w-5 text-red-500" />}
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                    {emailAvailable === true && (
                      <p className="mt-1 text-sm text-green-600">Email is available!</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
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
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                        </div>

                        {/* Password Requirements */}
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          {passwordRequirements.map((req) => (
                            <div key={req.id} className={`flex items-center space-x-2 ${
                              req.test(formData.password) ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {req.test(formData.password) ? 
                                <FaCheck className="w-3 h-3" /> : 
                                <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                              }
                              <span>{req.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <FaCheckCircle className="w-4 h-4 mr-1" />
                        Passwords match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                    )}

                    <div className="flex items-start">
                      <input
                        id="agreeToMarketing"
                        name="agreeToMarketing"
                        type="checkbox"
                        checked={formData.agreeToMarketing}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="agreeToMarketing" className="ml-3 text-sm text-gray-700">
                        I would like to receive course updates and learning tips via email
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={handlePrevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Previous
                </motion.button>
              )}

              {currentStep < 2 ? (
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                >
                  Continue
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaGraduationCap className="inline mr-2" />
                      Create Account
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupForm;