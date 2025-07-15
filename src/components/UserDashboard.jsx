import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaTrophy,
  FaFire,
  FaCalendarDay,
  FaBook,
  FaChartLine,
  FaStar,
  FaPlayCircle,
  FaPause,
  FaCheck,
  FaLock,
  FaUsers,
  FaGraduationCap,
  FaAward,
  FaBullseye, // FIXED: Changed from FaTarget to FaBullseye
  FaClock,
  FaArrowRight,
  FaSpinner
} from "react-icons/fa";
import { useUser } from "../contexts/UserContext";

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPoints: 0,
      coursesCompleted: 0,
      currentStreak: 0,
      studyTimeToday: 0,
      weeklyGoal: 300,
      weeklyProgress: 0
    },
    recentActivity: [],
    currentCourses: [],
    achievements: [],
    leaderboardPosition: null,
    learningPaths: [],
    todaysTasks: []
  });
  
  const [loading, setLoading] = useState(true);
  const [selectedLearningPath, setSelectedLearningPath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { user, getUserStats } = useUser();

  // Intersection observer for animations
const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("authToken");

      if (!username || !token) {
        throw new Error("User not authenticated");
      }

      // Fetch user data and learning paths
      const [usersResponse, learningPathsResponse] = await Promise.all([
        axios.get("https://e-learn-ncux.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://e-learn-ncux.onrender.com/api/learning_paths", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const currentUser = usersResponse.data.find(user => user.username === username);
      
      if (currentUser) {
        // Calculate dashboard stats
        const stats = {
          totalPoints: currentUser.total_points || 0,
          coursesCompleted: currentUser.courses_completed || 0,
          currentStreak: currentUser.current_streak || 0,
          studyTimeToday: Math.floor(Math.random() * 120) + 30, // Simulated
          weeklyGoal: 300,
          weeklyProgress: Math.floor(Math.random() * 250) + 50 // Simulated
        };

        // Simulate recent activity
        const recentActivity = [
          { id: 1, type: 'course_completed', title: 'Completed React Basics', time: '2 hours ago', points: 50 },
          { id: 2, type: 'badge_earned', title: 'Earned "Quick Learner" badge', time: '1 day ago', points: 25 },
          { id: 3, type: 'streak_milestone', title: '7-day learning streak!', time: '2 days ago', points: 15 },
          { id: 4, type: 'quiz_passed', title: 'Passed JavaScript Quiz', time: '3 days ago', points: 30 }
        ];

        // Simulate current courses
        const currentCourses = [
          { 
            id: 1, 
            title: 'Advanced React Development', 
            progress: 65, 
            nextLesson: 'State Management with Redux',
            instructor: 'John Smith',
            duration: '8 weeks',
            difficulty: 'Advanced'
          },
          { 
            id: 2, 
            title: 'UI/UX Design Principles', 
            progress: 30, 
            nextLesson: 'Color Theory and Psychology',
            instructor: 'Sarah Johnson',
            duration: '6 weeks',
            difficulty: 'Intermediate'
          },
          { 
            id: 3, 
            title: 'Data Structures & Algorithms', 
            progress: 85, 
            nextLesson: 'Graph Algorithms',
            instructor: 'Mike Chen',
            duration: '12 weeks',
            difficulty: 'Advanced'
          }
        ];

        // Simulate achievements
        const achievements = [
          { id: 1, title: 'First Course Completed', icon: FaGraduationCap, earned: true, color: 'text-blue-500' },
          { id: 2, title: 'Week Warrior', icon: FaFire, earned: true, color: 'text-orange-500' },
          { id: 3, title: 'Quiz Master', icon: FaTrophy, earned: true, color: 'text-yellow-500' },
          { id: 4, title: 'Code Contributor', icon: FaUsers, earned: false, color: 'text-gray-400' },
          { id: 5, title: 'Learning Legend', icon: FaAward, earned: false, color: 'text-gray-400' }
        ];

        // Simulate today's tasks
        const todaysTasks = [
          { id: 1, task: 'Complete React Hooks lesson', completed: true, priority: 'high' },
          { id: 2, task: 'Practice JavaScript exercises', completed: false, priority: 'medium' },
          { id: 3, task: 'Review yesterday\'s notes', completed: false, priority: 'low' },
          { id: 4, task: 'Join study group meeting', completed: false, priority: 'high' }
        ];

        setDashboardData({
          stats,
          recentActivity,
          currentCourses,
          achievements,
          leaderboardPosition: Math.floor(Math.random() * 50) + 1,
          learningPaths: learningPathsResponse.data || [],
          todaysTasks
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const openLearningPathModal = (learningPath) => {
    setSelectedLearningPath(learningPath);
    setIsModalOpen(true);
  };

  const closeLearningPathModal = () => {
    setIsModalOpen(false);
    setSelectedLearningPath(null);
  };

  const toggleTask = (taskId) => {
    setDashboardData(prev => ({
      ...prev,
      todaysTasks: prev.todaysTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-400 to-green-600';
    if (progress >= 50) return 'from-blue-400 to-blue-600';
    if (progress >= 25) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
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
          <p className="text-xl font-semibold text-gray-700">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-2">
              Welcome back, {user?.username || 'Learner'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to continue your learning journey today?
            </p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <div className="text-3xl lg:text-4xl font-bold">
              {dashboardData.stats.totalPoints.toLocaleString()}
            </div>
            <div className="text-blue-200">Total Points</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Courses Completed",
            value: dashboardData.stats.coursesCompleted,
            icon: FaGraduationCap,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            change: "+2 this month"
          },
          {
            title: "Current Streak",
            value: `${dashboardData.stats.currentStreak} days`,
            icon: FaFire,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            change: "Keep it up!"
          },
          {
            title: "Study Time Today",
            value: `${dashboardData.stats.studyTimeToday} min`,
            icon: FaClock,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            change: "Goal: 60 min"
          },
          {
            title: "Leaderboard Rank",
            value: `#${dashboardData.leaderboardPosition}`,
            icon: FaTrophy,
            color: "from-yellow-500 to-yellow-600",
            bgColor: "bg-yellow-50",
            change: "+5 positions"
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`${stat.bgColor} p-6 rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaBullseye className="w-5 h-5 mr-2 text-blue-600" />
            Weekly Goal Progress
          </h2>
          <span className="text-sm text-gray-600">
            {dashboardData.stats.weeklyProgress} / {dashboardData.stats.weeklyGoal} minutes
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dashboardData.stats.weeklyProgress / dashboardData.stats.weeklyGoal) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0</span>
            <span className="font-semibold">
              {Math.round((dashboardData.stats.weeklyProgress / dashboardData.stats.weeklyGoal) * 100)}%
            </span>
            <span>{dashboardData.stats.weeklyGoal}min</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Courses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaBook className="w-5 h-5 mr-2 text-blue-600" />
            Current Courses
          </h2>
          
          <div className="space-y-4">
            {dashboardData.currentCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Next: {course.nextLesson}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>👨‍🏫 {course.instructor}</span>
                      <span>📅 {course.duration}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        course.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' :
                        course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 p-2">
                    <FaPlayCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`bg-gradient-to-r ${getProgressColor(course.progress)} h-2 rounded-full`}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCalendarDay className="w-5 h-5 mr-2 text-blue-600" />
            Today's Tasks
          </h2>
          
          <div className="space-y-3">
            {dashboardData.todaysTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-l-4 rounded-r-lg ${getPriorityColor(task.priority)} transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.completed && <FaCheck className="w-3 h-3" />}
                  </button>
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.task}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaAward className="w-5 h-5 mr-2 text-blue-600" />
          Achievements
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dashboardData.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                achievement.earned 
                  ? 'border-yellow-300 bg-yellow-50 shadow-lg' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
              <p className={`text-sm font-medium ${achievement.earned ? 'text-gray-800' : 'text-gray-400'}`}>
                {achievement.title}
              </p>
              {achievement.earned && (
                <div className="mt-2">
                  <FaCheck className="w-4 h-4 text-green-500 mx-auto" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaChartLine className="w-5 h-5 mr-2 text-blue-600" />
          Recent Activity
        </h2>
        
        <div className="space-y-4">
          {dashboardData.recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'course_completed' ? 'bg-green-100 text-green-600' :
                activity.type === 'badge_earned' ? 'bg-yellow-100 text-yellow-600' :
                activity.type === 'streak_milestone' ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {activity.type === 'course_completed' && <FaGraduationCap className="w-5 h-5" />}
                {activity.type === 'badge_earned' && <FaAward className="w-5 h-5" />}
                {activity.type === 'streak_milestone' && <FaFire className="w-5 h-5" />}
                {activity.type === 'quiz_passed' && <FaCheck className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">+{activity.points}</span>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Path Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLearningPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeLearningPathModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedLearningPath.title}
                </h3>
                <button
                  onClick={closeLearningPathModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedLearningPath.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{selectedLearningPath.duration || 'Self-paced'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Difficulty:</span>
                    <span className="ml-2 text-gray-600">{selectedLearningPath.difficulty || 'Beginner'}</span>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={closeLearningPathModal}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                  >
                    Start Learning Path
                    <FaArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;