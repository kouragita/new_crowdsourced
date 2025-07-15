import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

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

  // Initialize user from localStorage
  useEffect(() => {
    const initializeUser = () => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      
      try {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const storedPreferences = localStorage.getItem("userPreferences");

        if (token && !isTokenExpired(token) && username) {
          const userData = {
            username,
            token,
            role: role || 'student',
            email: localStorage.getItem("userEmail") || '',
            profilePicture: localStorage.getItem("userProfilePicture") || null,
            totalPoints: parseInt(localStorage.getItem("userPoints")) || 0,
            currentStreak: parseInt(localStorage.getItem("userStreak")) || 0,
            badges: JSON.parse(localStorage.getItem("userBadges") || '[]')
          };

          // Parse and set preferences
          if (storedPreferences) {
            const preferences = JSON.parse(storedPreferences);
            dispatch({ type: USER_ACTIONS.SET_THEME, payload: preferences.theme || 'light' });
          }

          dispatch({ type: USER_ACTIONS.SET_USER, payload: userData });
          
          // Apply theme
          if (storedPreferences) {
            const preferences = JSON.parse(storedPreferences);
            document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
          }
        } else {
          // Token expired or invalid
          if (token) {
            toast.error('Session expired. Please log in again.');
            logout();
          } else {
            dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Failed to initialize user session' });
      }
    };

    initializeUser();
  }, []);

  // Login function
  const login = (userData, token) => {
    try {
      const userWithToken = { ...userData, token };
      
      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("role", userData.role || 'student');
      localStorage.setItem("userEmail", userData.email || '');
      localStorage.setItem("userPoints", userData.totalPoints?.toString() || '0');
      localStorage.setItem("userStreak", userData.currentStreak?.toString() || '0');
      localStorage.setItem("userBadges", JSON.stringify(userData.badges || []));
      
      if (userData.profilePicture) {
        localStorage.setItem("userProfilePicture", userData.profilePicture);
      }

      dispatch({ type: USER_ACTIONS.SET_USER, payload: userWithToken });
      
      toast.success(`Welcome back, ${userData.username}!`);
      
      // Add login notification
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Login Successful',
        message: 'You have successfully logged in to your account.',
        timestamp: new Date().toISOString(),
        read: false
      });
      
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Login failed' });
      toast.error('Login failed. Please try again.');
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    const keysToRemove = [
      "authToken", "username", "role", "userEmail", 
      "userProfilePicture", "userPoints", "userStreak", "userBadges"
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    dispatch({ type: USER_ACTIONS.LOGOUT });
    
    // Remove theme class
    document.documentElement.classList.remove('dark');
    
    toast.success('Logged out successfully');
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

  const contextValue = {
    // State
    ...state,
    
    // Authentication methods
    login,
    logout,
    isAuthenticated,
    isAdmin,
    
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