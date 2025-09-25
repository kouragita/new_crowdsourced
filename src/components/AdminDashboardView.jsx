import React from 'react';

const AdminDashboardView = () => {
  // Placeholder data
  const stats = {
    totalUsers: 1250,
    totalCourses: 75,
    pendingApprovals: 5,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Admin Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2 dark:text-white">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2 dark:text-white">Total Courses</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2 dark:text-white">Pending Approvals</h3>
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingApprovals}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Manage Users</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Manage Content</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">View Reports</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
