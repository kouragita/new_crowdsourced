import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaChartLine,
  FaGraduationCap,
  FaCalendarAlt,
  FaTrophy,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUserShield,
  FaCog,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaPrint,
  FaFileExport
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

import { Routes, Route } from 'react-router-dom';
import AdminSidebar from "./Admin/AdminSidebar";
import { AdminOverview, UserManagement, ContentManagement, AdminAnalytics, AdminSettings } from './Admin/views';
import LearningPathDetailView from './Admin/views/LearningPathDetailView';
import IntegrationsManagement from './Admin/views/IntegrationsManagement';
import QuizManagementView from './Admin/views/QuizManagementView';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    completionRate: 0,
    totalPoints: 0,
    avgSessionTime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'courses', label: 'Course Management', icon: FaGraduationCap },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'settings', label: 'System Settings', icon: FaCog }
  ];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      // Fetch users data
      const usersResponse = await axios.get("https://e-learn-ncux.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const usersData = usersResponse.data;
      setUsers(usersData);

      // Calculate statistics
      const totalPoints = usersData.reduce((sum, user) => sum + (user.total_points || 0), 0);
      const activeUsers = usersData.filter(user => {
        // Mock active user logic - last activity within 7 days
        return Math.random() > 0.3; // 70% active rate for demo
      }).length;

      setStats({
        totalUsers: usersData.length,
        activeUsers,
        totalCourses: 25, // Mock data
        completionRate: 78, // Mock data
        totalPoints,
        avgSessionTime: 45 // Mock data in minutes
      });

      // Generate recent activity
      setRecentActivity([
        { id: 1, type: 'user_registered', message: 'New user "john_doe" registered', time: '5 minutes ago', severity: 'info' },
        { id: 2, type: 'course_completed', message: 'User "jane_smith" completed React Basics', time: '12 minutes ago', severity: 'success' },
        { id: 3, type: 'error', message: 'Failed payment for user "mike_chen"', time: '1 hour ago', severity: 'error' },
        { id: 4, type: 'achievement', message: 'User "alice_johnson" earned Expert badge', time: '2 hours ago', severity: 'success' },
        { id: 5, type: 'warning', message: 'High server load detected', time: '3 hours ago', severity: 'warning' }
      ]);

    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = (action, userId) => {
    switch (action) {
      case 'view':
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
        setIsEditing(false);
        setShowUserModal(true);
        break;
      case 'edit':
        const editUser = users.find(u => u.id === userId);
        setSelectedUser(editUser);
        setIsEditing(true);
        setShowUserModal(true);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          toast.success('User deleted successfully');
        }
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'active' } : u
        ));
        toast.success('User activated');
        break;
      case 'deactivate':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'inactive' } : u
        ));
        toast.success('User deactivated');
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    switch (action) {
      case 'activate':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
        ));
        toast.success(`${selectedUsers.length} users activated`);
        break;
      case 'deactivate':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u
        ));
        toast.success(`${selectedUsers.length} users deactivated`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
          toast.success(`${selectedUsers.length} users deleted`);
        }
        break;
      default:
        break;
    }
    setSelectedUsers([]);
  };

  const getFilteredUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (userFilter !== 'all') {
      filtered = filtered.filter(user => {
        switch (userFilter) {
          case 'active':
            return user.status === 'active' || !user.status;
          case 'inactive':
            return user.status === 'inactive';
          case 'admins':
            return user.role_id === 1; // Assuming role_id 1 is admin
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const exportData = (format) => {
    const data = getFilteredUsers();
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'csv') {
      const csv = [
        ['Username', 'Email', 'Total Points', 'Role', 'Status', 'Join Date'],
        ...data.map(user => [
          user.username,
          user.email || 'N/A',
          user.total_points || 0,
          user.role_id === 1 ? 'Admin' : 'Student',
          user.status || 'Active',
          new Date(user.created_at || Date.now()).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${timestamp}.csv`;
      a.click();
      toast.success('Data exported successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <FaSpinner className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/content/:path_id" element={<LearningPathDetailView />} />
          <Route path="/modules/:module_id/quizzes" element={<QuizManagementView />} />
          <Route path="/analytics" element={<AdminAnalytics />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/integrations" element={<IntegrationsManagement />} />
        </Routes>
      </main>
    </div>
  );
}