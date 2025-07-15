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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 lg:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-2 flex items-center">
              <FaUserShield className="w-8 h-8 mr-3" />
              Admin Dashboard
            </h1>
            <p className="text-purple-100 text-lg">
              Manage users, courses, and monitor platform performance
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2">
              <FaBell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
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
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Total Users",
                    value: stats.totalUsers.toLocaleString(),
                    icon: FaUsers,
                    color: "from-blue-500 to-blue-600",
                    bgColor: "bg-blue-50",
                    change: "+12%",
                    changeType: "increase"
                  },
                  {
                    title: "Active Users",
                    value: stats.activeUsers.toLocaleString(),
                    icon: FaUserShield,
                    color: "from-green-500 to-green-600",
                    bgColor: "bg-green-50",
                    change: "+8%",
                    changeType: "increase"
                  },
                  {
                    title: "Total Courses",
                    value: stats.totalCourses.toLocaleString(),
                    icon: FaGraduationCap,
                    color: "from-purple-500 to-purple-600",
                    bgColor: "bg-purple-50",
                    change: "+3%",
                    changeType: "increase"
                  },
                  {
                    title: "Completion Rate",
                    value: `${stats.completionRate}%`,
                    icon: FaTrophy,
                    color: "from-yellow-500 to-yellow-600",
                    bgColor: "bg-yellow-50",
                    change: "+5%",
                    changeType: "increase"
                  },
                  {
                    title: "Total Points",
                    value: stats.totalPoints.toLocaleString(),
                    icon: FaChartLine,
                    color: "from-orange-500 to-orange-600",
                    bgColor: "bg-orange-50",
                    change: "+15%",
                    changeType: "increase"
                  },
                  {
                    title: "Avg Session Time",
                    value: `${stats.avgSessionTime}m`,
                    icon: FaCalendarAlt,
                    color: "from-pink-500 to-pink-600",
                    bgColor: "bg-pink-50",
                    change: "-2%",
                    changeType: "decrease"
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`${stat.bgColor} p-6 rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? 
                          <FaArrowUp className="w-3 h-3" /> : 
                          <FaArrowDown className="w-3 h-3" />
                        }
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaBell className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Activity
                </h2>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.severity === 'error' ? 'bg-red-100 text-red-600' :
                        activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        activity.severity === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.severity === 'error' && <FaTimesCircle className="w-5 h-5" />}
                        {activity.severity === 'warning' && <FaExclamationTriangle className="w-5 h-5" />}
                        {activity.severity === 'success' && <FaCheckCircle className="w-5 h-5" />}
                        {activity.severity === 'info' && <FaBell className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.message}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* User Management Header */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Filter */}
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users</option>
                      <option value="inactive">Inactive Users</option>
                      <option value="admins">Administrators</option>
                    </select>

                    {/* Export */}
                    <button
                      onClick={() => exportData('csv')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaDownload className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>

                    {/* Add User */}
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <FaPlus className="w-4 h-4" />
                      <span>Add User</span>
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800 font-medium">
                        {selectedUsers.length} user(s) selected
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBulkAction('activate')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleBulkAction('deactivate')}
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleBulkAction('delete')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === getFilteredUsers().length && getFilteredUsers().length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(getFilteredUsers().map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredUsers().map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                }
                              }}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold mr-4">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {(user.total_points || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role_id === 1 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role_id === 1 ? 'Admin' : 'Student'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (user.status || 'active') === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleUserAction('view', user.id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="View User"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction('edit', user.id)}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors"
                              title="Edit User"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction('delete', user.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete User"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {getFilteredUsers().length === 0 && (
                  <div className="text-center py-12">
                    <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No users found</p>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'courses' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <FaGraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Course Management</h3>
              <p className="text-gray-600">Course management features coming soon...</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <FaChartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Detailed analytics dashboard coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <FaCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">System Settings</h3>
              <p className="text-gray-600">System configuration options coming soon...</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;