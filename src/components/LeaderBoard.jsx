import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  // State to store leaderboard data, pagination, loading, and errors
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const itemsPerPage = 10; // Number of items per page

  // Fetch data from both APIs and combine them
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch user names
        const usersResponse = await fetch("https://e-learn-ncux.onrender.com/api/users");
        if (!usersResponse.ok) throw new Error("Failed to fetch user names");
        const usersData = await usersResponse.json();

        // Fetch points data
        const pointsResponse = await fetch("https://e-learn-ncux.onrender.com/api/user-profiles");
        if (!pointsResponse.ok) throw new Error("Failed to fetch user points");
        const pointsData = await pointsResponse.json();

        // Combine data by matching 'id'
        const combinedData = usersData.map((user) => {
          const userPoints = pointsData.find((profile) => profile.id === user.id); // Match by 'id'
          return {
            ...user,
            points: userPoints ? userPoints.points : 0, // Default to 0 if points are missing
          };
        });

        // Sort data by points in descending order
        const sortedData = combinedData.sort((a, b) => b.points - a.points);

        // Pagination: calculate total pages and slice data for the current page
        setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
        const pageData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        setLeaderboard(pageData);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [currentPage]); // Refetch when currentPage changes

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-center text-gray-800">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b text-left">Rank</th>
            <th className="p-2 border-b text-left">Name</th>
            <th className="p-2 border-b text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.id} className="hover:bg-gray-100">
              <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Rank */}
              <td className="p-2">{player.name || "Unknown"}</td> {/* Name with fallback */}
              <td className="p-2">{player.points}</td> {/* Points */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
