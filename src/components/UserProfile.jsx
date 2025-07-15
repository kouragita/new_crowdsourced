import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaCamera, 
  FaTrophy,
  FaFire,
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaUserShield, // FIXED: Changed from FaShield to FaUserShield
  FaBell,
  FaPalette,
  FaMoon,
  FaSun,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaSpinner,
  FaAward,
  FaStar,
  FaChartLine
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../contexts/UserContext";

const UserProfile = () => {
  const { user, updateProfile, setTheme } = useUser();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    twitter: user?.twitter || '',
    birthDate: user?.birthDate || '',
    profilePicture: user?.profilePicture || null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    courseReminders: true,
    achievementAlerts: true,
    language: 'en',
    timezone: 'UTC'
  });

  const [stats, setStats] = useState({
    totalPoints: user?.totalPoints || 0,
    coursesCompleted: 0,
    totalStudyTime: 0,
    currentStreak: user?.currentStreak || 0,
    longestStreak: 0,
    badges: user?.badges || [],
    joinDate: '2024-01-15', // Mock data
    lastActive: 'Today'
  });

  useEffect(() => {
    // Load user preferences from localStorage or API
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences({ ...preferences, ...JSON.parse(savedPreferences) });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    
    if (key === 'theme') {
      setTheme(value);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateProfile(profileData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaUserShield }, // FIXED: Updated to use FaUserShield
    { id: 'preferences', label: 'Preferences', icon: FaPalette },
    { id: 'stats', label: 'Statistics', icon: FaChartLine }
  ];

  const achievements = [
    { name: 'First Course', icon: FaGraduationCap, color: 'text-blue-500', earned: true },
    { name: 'Week Warrior', icon: FaFire, color: 'text-orange-500', earned: true },
    { name: 'Quiz Master', icon: FaTrophy, color: 'text-yellow-500', earned: true },
    { name: 'Study Streak', icon: FaCalendarAlt, color: 'text-green-500', earned: false },
    { name: 'Top Learner', icon: FaAward, color: 'text-purple-500', earned: false },
    { name: 'Knowledge Seeker', icon: FaStar, color: 'text-pink-500', earned: false }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                )}
              </div>
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FaCamera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                {profileData.firstName && profileData.lastName 
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : profileData.username
                }
              </h1>
              <p className="text-blue-100 text-lg mb-2">@{profileData.username}</p>
              <div className="flex items-center space-x-4 text-sm text-blue-200">
                <span className="flex items-center">
                  <FaCalendarAlt className="w-4 h-4 mr-1" />
                  Joined {stats.joinDate}
                </span>
                <span className="flex items-center">
                  <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                  {profileData.location || 'Location not set'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 lg:mt-0 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl lg:text-3xl font-bold">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-blue-200 text-sm">Points</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold">{stats.currentStreak}</div>
              <div className="text-blue-200 text-sm">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold">{stats.coursesCompleted}</div>
              <div className="text-blue-200 text-sm">Completed</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                <button
                  onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isEditing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isEditing ? <FaTimes className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Contact & Social */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact & Social</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      name="github"
                      value={profileData.github}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="GitHub profile URL"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
              
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaLock className="w-4 h-4" />}
                  <span>{isLoading ? 'Changing Password...' : 'Change Password'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
              
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Appearance</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePreferenceChange('theme', 'light')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        preferences.theme === 'light' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <FaSun className="w-5 h-5" />
                      <span>Light Mode</span>
                    </button>
                    <button
                      onClick={() => handlePreferenceChange('theme', 'dark')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        preferences.theme === 'dark' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <FaMoon className="w-5 h-5" />
                      <span>Dark Mode</span>
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your progress' },
                      { key: 'courseReminders', label: 'Course Reminders', desc: 'Reminders about ongoing courses' },
                      { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Notifications when you earn badges' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{setting.label}</div>
                          <div className="text-sm text-gray-600">{setting.desc}</div>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange(setting.key, !preferences[setting.key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                            preferences[setting.key] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              preferences[setting.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">Learning Statistics</h2>
              
              {/* Overview Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Points', value: stats.totalPoints.toLocaleString(), icon: FaTrophy, color: 'text-yellow-500' },
                  { label: 'Courses Completed', value: stats.coursesCompleted, icon: FaGraduationCap, color: 'text-green-500' },
                  { label: 'Current Streak', value: `${stats.currentStreak} days`, icon: FaFire, color: 'text-orange-500' },
                  { label: 'Study Time', value: `${stats.totalStudyTime} hrs`, icon: FaCalendarAlt, color: 'text-blue-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-6 rounded-xl text-center"
                  >
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                        achievement.earned 
                          ? 'border-yellow-300 bg-yellow-50 shadow-lg' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                      <p className={`text-sm font-medium ${achievement.earned ? 'text-gray-800' : 'text-gray-400'}`}>
                        {achievement.name}
                      </p>
                      {achievement.earned && (
                        <FaCheck className="w-4 h-4 text-green-500 mx-auto mt-2" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;