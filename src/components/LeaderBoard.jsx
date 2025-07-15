import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { 
  FaTrophy, 
  FaMedal, 
  FaAward, 
  FaStar,
  FaSearch,
  FaFilter,
  FaSort,
  FaChevronUp,
  FaChevronDown,
  FaUsers,
  FaFire,
  FaCrown,
  FaGem,
  FaRocket,
  FaGraduationCap
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Intersection observer for animations
const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [leaderboard, searchTerm, sortBy, sortOrder, filterBy]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://e-learn-ncux.onrender.com/api/leaderboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.leaderboard && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
        setError(null);
      } else {
        throw new Error('Invalid leaderboard data structure');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortData = () => {
    let filtered = [...leaderboard];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply badge filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(user => 
        user.badges.some(badge => badge.toLowerCase() === filterBy.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.username.toLowerCase();
          bValue = b.username.toLowerCase();
          break;
        case 'points':
        default:
          aValue = a.total_points;
          bValue = b.total_points;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeaderboard(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination
  const totalPages = Math.ceil(filteredLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLeaderboard.slice(startIndex, endIndex);

  // Badge configuration
  const badgeConfig = {
    'Legend': { icon: FaTrophy, color: 'text-yellow-600 bg-yellow-100 border-yellow-200', glow: 'shadow-yellow-200' },
    'Master': { icon: FaCrown, color: 'text-blue-600 bg-blue-100 border-blue-200', glow: 'shadow-blue-200' },
    'Expert': { icon: FaGem, color: 'text-purple-600 bg-purple-100 border-purple-200', glow: 'shadow-purple-200' },
    'Advanced': { icon: FaRocket, color: 'text-green-600 bg-green-100 border-green-200', glow: 'shadow-green-200' },
    'Intermediate': { icon: FaGraduationCap, color: 'text-orange-600 bg-orange-100 border-orange-200', glow: 'shadow-orange-200' },
    'Beginner': { icon: FaStar, color: 'text-gray-600 bg-gray-100 border-gray-200', glow: 'shadow-gray-200' }
  };

  const getPositionIcon = (index) => {
    switch (index) {
      case 0: return <FaTrophy className="text-yellow-500" />;
      case 1: return <FaMedal className="text-gray-400" />;
      case 2: return <FaAward className="text-orange-500" />;
      default: return null;
    }
  };

  const getPositionStyle = (index) => {
    switch (index) {
      case 0: return 'from-yellow-400 to-yellow-600';
      case 1: return 'from-gray-300 to-gray-500';
      case 2: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Leaderboard</h2>
          <p className="text-gray-600">Fetching the latest rankings...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Unable to Load Leaderboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLeaderboardData}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className="container mx-auto p-4 lg:p-6 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <FaTrophy className="text-4xl text-yellow-500 mr-3" />
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our top learners and see where you rank among the community
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center">
          <FaUsers className="text-3xl mx-auto mb-2" />
          <div className="text-2xl font-bold">{leaderboard.length}</div>
          <div className="text-blue-100">Total Learners</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl text-center">
          <FaFire className="text-3xl mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {leaderboard.reduce((sum, user) => sum + user.total_points, 0).toLocaleString()}
          </div>
          <div className="text-green-100">Total Points</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl text-center">
          <FaTrophy className="text-3xl mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {leaderboard.filter(user => user.badges.length > 0).length}
          </div>
          <div className="text-purple-100">Badge Holders</div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search learners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <FaSort className="text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="points-desc">Points (High to Low)</option>
              <option value="points-asc">Points (Low to High)</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
            </select>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Badges</option>
              <option value="legend">Legend</option>
              <option value="master">Master</option>
              <option value="expert">Expert</option>
              <option value="advanced">Advanced</option>
              <option value="intermediate">Intermediate</option>
              <option value="beginner">Beginner</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Mobile View */}
        <div className="lg:hidden">
          <AnimatePresence>
            {currentItems.map((player, index) => {
              const globalRank = startIndex + index + 1;
              const isTopThree = globalRank <= 3;
              
              return (
                <motion.div
                  key={player.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-6 border-b border-gray-100 ${isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPositionStyle(globalRank - 1)} flex items-center justify-center text-white font-bold`}>
                        {globalRank <= 3 ? getPositionIcon(globalRank - 1) : globalRank}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{player.username}</h3>
                        <p className="text-blue-600 font-semibold">{player.total_points.toLocaleString()} pts</p>
                      </div>
                    </div>
                  </div>
                  
                  {player.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {player.badges.slice(0, 3).map((badge, badgeIndex) => {
                        const config = badgeConfig[badge] || badgeConfig['Beginner'];
                        const BadgeIcon = config.icon;
                        
                        return (
                          <span
                            key={badgeIndex}
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${config.glow}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge}</span>
                          </span>
                        );
                      })}
                      {player.badges.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{player.badges.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Learner
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Badges
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentItems.map((player, index) => {
                  const globalRank = startIndex + index + 1;
                  const isTopThree = globalRank <= 3;
                  
                  return (
                    <motion.tr
                      key={player.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPositionStyle(globalRank - 1)} flex items-center justify-center text-white font-bold mr-3`}>
                            {globalRank <= 3 ? getPositionIcon(globalRank - 1) : globalRank}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPositionStyle(globalRank - 1)} flex items-center justify-center text-white font-bold mr-4`}>
                            {player.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-800">{player.username}</div>
                            {isTopThree && <div className="text-sm text-yellow-600 font-medium">🔥 Top Performer</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-2xl font-bold text-blue-600">
                          {player.total_points.toLocaleString()}
                        </span>
                        <span className="text-gray-500 ml-1">pts</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {player.badges.slice(0, 3).map((badge, badgeIndex) => {
                            const config = badgeConfig[badge] || badgeConfig['Beginner'];
                            const BadgeIcon = config.icon;
                            
                            return (
                              <span
                                key={badgeIndex}
                                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${config.glow}`}
                              >
                                <BadgeIcon className="w-3 h-3" />
                                <span>{badge}</span>
                              </span>
                            );
                          })}
                          {player.badges.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                              +{player.badges.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLeaderboard.length)} of {filteredLeaderboard.length} learners
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <FaChevronUp className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <FaChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {filteredLeaderboard.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No learners found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterBy('all');
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;