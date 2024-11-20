import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('https://e-learn-ncux.onrender.com/api/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch leaderboard data');

        const data = await response.json();
        setLeaderboard(data.leaderboard);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-800">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Leaderboard</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-lg font-semibold text-gray-700">Rank</th>
              <th className="p-3 text-left text-lg font-semibold text-gray-700">Name</th>
              <th className="p-3 text-left text-lg font-semibold text-gray-700">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr
                key={player.user_id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="p-3 text-gray-800">{index + 1}</td>
                <td className="p-3 text-gray-800 font-medium">
                  {player.username}
                  {player.badges.length > 0 && (
                    <span className="ml-2 text-sm text-yellow-600 font-semibold">
                      {player.badges.join(', ')}
                    </span>
                  )}
                </td>
                <td className="p-3 text-gray-800">{player.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
