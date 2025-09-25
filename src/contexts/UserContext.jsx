import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import apiClient from '../services/api';
import axios from 'axios';

// User Context
const UserContext = createContext();

// Action types for user reducer
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  LOGOUT: 'LOGOUT',
  SET_THEME: 'SET_THEME',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION'
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  theme: 'light',
  notifications: [],
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    theme: 'light',
    language: 'en'
  }
};

// User reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      };
    
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case USER_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    
    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    
    case USER_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        preferences: {
          ...state.preferences,
          theme: action.payload
        }
      };
    
    case USER_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      };
    
    case USER_ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    
    case USER_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    
    default:
      return state;
  }
};

// Hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// User Provider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Initialize user from token
  useEffect(() => {
    const initializeUser = async () => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      const token = localStorage.getItem("authToken");

      if (token && !isTokenExpired(token)) {
        try {

          // Fetch user profile from secure endpoint
          const response = await apiClient.get('/profile');
          const user = response.data;

          dispatch({ type: USER_ACTIONS.SET_USER, payload: { ...user, token } });

          // Handle theme from preferences if needed
          // const storedPreferences = localStorage.getItem("userPreferences");
          // if (storedPreferences) {
          //   const preferences = JSON.parse(storedPreferences);
          //   dispatch({ type: USER_ACTIONS.SET_THEME, payload: preferences.theme || 'light' });
          //   document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
          // }

        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          toast.error('Session invalid. Please log in again.');
          logout(); // Clear invalid token
        }
      } else {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeUser();
  }, []);

  // Login function
  const login = (userData, token) => {
    try {
      // Store only the token in localStorage
      localStorage.setItem("authToken", token);
      
      // Set token for all subsequent apiClient requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state directly from login response
      dispatch({ type: USER_ACTIONS.SET_USER, payload: { ...userData, token } });
      
      toast.success(`Welcome back, ${userData.username}!`);
      
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Login failed' });
      toast.error('Login failed. Please try again.');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Server logout failed, proceeding with client-side logout.', error);
    } finally {
      // Always clear client-side data regardless of server response
      localStorage.removeItem("authToken");
      dispatch({ type: USER_ACTIONS.LOGOUT });
      document.documentElement.classList.remove('dark');
    }
  };

  // Update profile function
  const updateProfile = (profileData) => {
    try {
      dispatch({ type: USER_ACTIONS.UPDATE_PROFILE, payload: profileData });
      
      // Update localStorage
      Object.keys(profileData).forEach(key => {
        if (key === 'username') {
          localStorage.setItem('username', profileData[key]);
        } else if (key === 'email') {
          localStorage.setItem('userEmail', profileData[key]);
        } else if (key === 'profilePicture') {
          localStorage.setItem('userProfilePicture', profileData[key]);
        } else if (key === 'totalPoints') {
          localStorage.setItem('userPoints', profileData[key].toString());
        } else if (key === 'currentStreak') {
          localStorage.setItem('userStreak', profileData[key].toString());
        } else if (key === 'badges') {
          localStorage.setItem('userBadges', JSON.stringify(profileData[key]));
        }
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  // Set theme function
  const setTheme = (theme) => {
    dispatch({ type: USER_ACTIONS.SET_THEME, payload: theme });
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Save to localStorage
    const preferences = {
      ...state.preferences,
      theme
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    toast.success(`${theme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
  };

  // Notification functions
  const addNotification = (notification) => {
    dispatch({ type: USER_ACTIONS.ADD_NOTIFICATION, payload: notification });
  };

  const markNotificationAsRead = (notificationId) => {
    dispatch({ type: USER_ACTIONS.MARK_NOTIFICATION_READ, payload: notificationId });
  };

  const clearNotifications = () => {
    dispatch({ type: USER_ACTIONS.SET_NOTIFICATIONS, payload: [] });
  };

  // Error management
  const clearError = () => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  };

  // Check authentication status
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return token && !isTokenExpired(token) && state.isAuthenticated;
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  // Get user stats
  const getUserStats = () => {
    return {
      totalPoints: state.user?.totalPoints || 0,
      currentStreak: state.user?.currentStreak || 0,
      badges: state.user?.badges || [],
      coursesCompleted: state.user?.coursesCompleted || 0,
      totalLearningTime: state.user?.totalLearningTime || 0
    };
  };
  
  // Function to completely clear all authentication data from localStorage
  const clearAuthData = () => {
    // Clear all authentication-related storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfilePicture");
    localStorage.removeItem("userPoints");
    localStorage.removeItem("userStreak");
    localStorage.removeItem("userBadges");
    localStorage.removeItem("userPreferences");
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");
    
    // Clear axios authentication
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    dispatch({ type: USER_ACTIONS.LOGOUT });
    
    // Remove theme class
    document.documentElement.classList.remove('dark');
    
    toast.success('Authentication data cleared successfully');
  };

  const contextValue = {
    // State
    ...state,
    
    // Authentication methods
    login,
    logout,
    clearAuthData,  // Add this function to clear all auth data
    
    // Profile methods
    updateProfile,
    getUserStats,
    
    // Theme methods
    setTheme,
    
    // Notification methods
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    
    // Error methods
    clearError,
    
    // Utility methods
    isTokenExpired
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};