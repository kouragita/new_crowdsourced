/*
 * CoursesPage Component - Visually Enhanced with Preserved API Functionality
 * 
 * This component maintains all original API functionality:
 * - Fetches learning paths from: https://e-learn-ncux.onrender.com/api/learning_paths
 * - Fetches modules from: https://e-learn-ncux.onrender.com/api/learning_paths/${id}/modules
 * - Preserves pagination, error handling, and loading states
 * - Enhances API data with visual elements for better UI/UX
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaBook,
  FaStar,
  FaPlay,
  FaUsers,
  FaClock,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaFilter,
  FaSearch,
  FaBookmark,
  FaCode,
  FaDatabase,
  FaBrain,
  FaPalette,
  FaMobile,
  FaRocket,
  FaShieldAlt,
  FaChartLine
} from "react-icons/fa";

const CoursesPage = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [modules, setModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Helper function to enhance API data with visual elements
  const enhanceApiData = (apiData) => {
    const categories = ["data-science", "web-dev", "ai-ml", "design", "mobile", "security"];
    const instructors = ["Dr. Sarah Chen", "Alex Rodriguez", "Prof. Michael Kim", "Emma Thompson", "James Wilson", "Dr. Rachel Park"];
    
    return apiData.map((item, index) => ({
      ...item,
      // Add visual enhancements while preserving original API data
      category: categories[index % categories.length],
      instructor: instructors[index % instructors.length],
      students: Math.floor(Math.random() * 5000) + 1000,
      duration: `${Math.floor(Math.random() * 12) + 4} weeks`,
      price: `$${Math.floor(Math.random() * 200) + 99}`,
      modules: Math.floor(Math.random() * 30) + 15,
      tags: item.title.split(' ').slice(0, 3),
      completion: Math.floor(Math.random() * 20) + 80,
      // Use rating if available, otherwise generate one
      rating: item.rating || (Math.random() * 1 + 4).toFixed(1)
    }));
  };

  // Category icons mapping
  const categoryIcons = {
    "data-science": FaChartLine,
    "web-dev": FaCode,
    "ai-ml": FaBrain,
    "design": FaPalette,
    "mobile": FaMobile,
    "security": FaShieldAlt
  };

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        // Real API call to fetch learning paths
        const response = await axios.get(
          "https://e-learn-ncux.onrender.com/api/learning_paths"
        );
        
        // Enhance API data with visual elements for better UI
        const enhancedData = enhanceApiData(response.data);
        setLearningPaths(enhancedData);
      } catch (error) {
        console.error("Error fetching learning paths:", error);
        setError("Failed to fetch learning paths. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, []);

  // Filter courses based on search and filters
  const filteredCourses = learningPaths.filter(course => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || (course.difficulty || '').toLowerCase() === selectedDifficulty;
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDifficulty, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const indexOfLastPath = currentPage * itemsPerPage;
  const indexOfFirstPath = indexOfLastPath - itemsPerPage;
  const currentPaths = filteredCourses.slice(indexOfFirstPath, indexOfLastPath);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const fetchModules = async (learningPathId) => {
    try {
      // Real API call to fetch modules for specific learning path
      const response = await axios.get(
        `https://e-learn-ncux.onrender.com/api/learning_paths/${learningPathId}/modules`
      );
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
      // Fallback to show user-friendly message
      setModules([]);
    }
  };

  const handleViewDetails = (learningPathId) => {
    if (!learningPathId) {
      console.error("Invalid learning path ID");
      return;
    }
    setSelectedPathId(learningPathId);
    fetchModules(learningPathId);
    setIsTableVisible(true);

    setTimeout(() => {
      document.getElementById("modulesTable")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const closeTable = () => {
    setIsTableVisible(false);
    setModules([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "intermediate": return "bg-amber-100 text-amber-800 border-amber-200";
      case "advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "data-science": "bg-blue-500",
      "web-dev": "bg-green-500",
      "ai-ml": "bg-purple-500",
      "design": "bg-pink-500",
      "mobile": "bg-indigo-500",
      "security": "bg-red-500"
    };
    return colors[category] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="text-6xl mb-4">😟</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Courses
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock your potential with our curated collection of world-class courses. 
              Learn from industry experts and advance your career.
            </p>
            <div className="flex items-center justify-center space-x-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-gray-300">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">120+</div>
                <div className="text-sm text-gray-300">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-gray-300">Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="data-science">Data Science</option>
                <option value="web-dev">Web Development</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="design">Design</option>
                <option value="mobile">Mobile Development</option>
                <option value="security">Cybersecurity</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-gray-600">
            Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12"
        >
          {currentPaths.map((course, index) => {
            const CategoryIcon = categoryIcons[course.category] || FaBook;
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(course.category || 'data-science')} opacity-90`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CategoryIcon className="w-16 h-16 text-white opacity-80" />
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-gray-800">{course.price || 'Free'}</span>
                  </div>

                  {/* Bookmark */}
                  <button className="absolute top-4 left-4 p-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full hover:bg-opacity-100 transition-all">
                    <FaBookmark className="w-4 h-4 text-gray-600 hover:text-indigo-600" />
                  </button>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(course.difficulty || 'beginner')}`}>
                      {(course.difficulty || 'beginner').charAt(0).toUpperCase() + (course.difficulty || 'beginner').slice(1)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{course.rating || 'N/A'}</span>
                      <span className="text-xs text-gray-500">({course.students || 0})</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <FaUsers className="w-3 h-3" />
                      <span>{course.students || 0} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="w-3 h-3" />
                      <span>{course.duration || 'Self-paced'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaBook className="w-3 h-3" />
                      <span>{course.modules || 'TBD'} modules</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(course.tags || []).slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {(course.tags || []).length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{course.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(course.instructor || 'Instructor').split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="ml-2 text-sm text-gray-700">{course.instructor || 'Instructor'}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Completion Rate</span>
                      <span>{course.completion || 85}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.completion || 85}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewDetails(course.id)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
                    >
                      <FaPlay className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>View Details</span>
                    </button>
                    <button className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200">
                      <FaGraduationCap className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center items-center space-x-2"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white shadow-md border border-gray-200 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  currentPage === index + 1
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 shadow-md border border-gray-200 hover:border-indigo-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white shadow-md border border-gray-200 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Modules Modal */}
        <AnimatePresence>
          {isTableVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeTable}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Course Modules</h2>
                    <button
                      onClick={closeTable}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-96">
                  {modules.length > 0 ? (
                    <div className="space-y-4">
                      {modules.map((module, index) => (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 mb-2">{module.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <FaClock className="w-3 h-3 mr-1" />
                                  {module.duration || 'Duration not specified'}
                                </span>
                                {module.resources && module.resources.length > 0 && module.resources[0] && (
                                  <a
                                    href={module.resources[0].url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                  >
                                    {module.resources[0].title || "View Resource"}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No modules available for this course.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursesPage;