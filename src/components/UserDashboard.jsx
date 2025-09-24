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
  FaBullseye,
  FaClock,
  FaArrowRight,
  FaSpinner,
  FaTimes
} from "react-icons/fa";
import { useUser } from "../contexts/UserContext";

// MOCK DATA - In a real app, this would come from an API
const mockDashboardData = {
  stats: {
    points: 1250,
    coursesCompleted: 5,
    currentStreak: 14,
    studyTimeToday: 45,
    weeklyProgress: 210,
    weeklyGoal: 300,
  },
  leaderboardPosition: 42,
  currentCourses: [
    {
      id: 1,
      title: "Advanced React Patterns",
      nextLesson: "Understanding Render Props",
      progress: 75,
      instructor: "Jane Doe",
      duration: "8h remaining",
      difficulty: "Advanced",
    },
    {
      id: 2,
      title: "Data Structures in Python",
      nextLesson: "Implementing Hash Tables",
      progress: 40,
      instructor: "John Smith",
      duration: "12h remaining",
      difficulty: "Intermediate",
    },
  ],
  todaysTasks: [
    { id: 1, task: "Watch video on React Hooks", completed: true, priority: "high" },
    { id: 2, task: "Complete Chapter 3 quiz", completed: false, priority: "high" },
    { id: 3, task: "Read article on Python decorators", completed: false, priority: "medium" },
  ],
  achievements: [
    { id: 1, title: "Course Starter", icon: FaPlayCircle, earned: true, color: "text-green-500" },
    { id: 2, title: "Quiz Master", icon: FaCheck, earned: true, color: "text-blue-500" },
    { id: 3, title: "Streak Keeper", icon: FaFire, earned: true, color: "text-orange-500" },
    { id: 4, title: "Pathfinder", icon: FaBook, earned: false, color: "text-gray-400" },
    { id: 5, title: "Top Learner", icon: FaTrophy, earned: false, color: "text-gray-400" },
  ],
  recentActivity: [
    { id: 1, type: "course_completed", title: "Completed 'Intro to SQL'", time: "2 hours ago", points: 100 },
    { id: 2, type: "badge_earned", title: "Earned 'Quiz Master' Badge", time: "1 day ago", points: 50 },
    { id: 3, type: "streak_milestone", title: "Reached a 14-day streak!", time: "yesterday", points: 75 },
  ],
};

const UserDashboard = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLearningPath, setSelectedLearningPath] = useState(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // In a real app, you would fetch data from your API here
      // For now, we use mock data after a short delay
      setTimeout(() => {
        setDashboardData(mockDashboardData);
        setLoading(false);
      }, 1000);
    };
    fetchData();
  }, [user]);

  const toggleTask = (taskId) => {
    setDashboardData(prev => ({
      ...prev,
      todaysTasks: prev.todaysTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const getProgressColor = (progress) => {
    if (progress > 70) return "from-green-500 to-teal-500";
    if (progress > 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return "border-red-400";
    if (priority === 'medium') return "border-yellow-400";
    return "border-green-400";
  };

  const openLearningPathModal = (path) => {
    setSelectedLearningPath(path);
    setIsModalOpen(true);
  };

  const closeLearningPathModal = () => {
    setIsModalOpen(false);
    setSelectedLearningPath(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div ref={ref} className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.username || 'Learner'}!</h1>
        <p className="text-gray-600 mt-1">Let's continue your learning journey.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {[
          {
            title: "Total Points",
            value: dashboardData.stats.points,
            icon: FaStar,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            change: "+50 this week"
          },
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
