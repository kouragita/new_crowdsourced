import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBook, FaChartBar, FaCog, FaShareAlt } from 'react-icons/fa';

const AdminSidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 text-white p-2 rounded-full">
          <FaBook size={24} />
        </div>
        <h1 className="text-xl font-bold text-gray-800 ml-3">E-learn Admin</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <NavLink to="/admin/" end className={navLinkClasses}>
          <FaTachometerAlt className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={navLinkClasses}>
          <FaUsers className="mr-3" />
          Users
        </NavLink>
        <NavLink to="/admin/content" className={navLinkClasses}>
          <FaBook className="mr-3" />
          Content
        </NavLink>
        <NavLink to="/admin/analytics" className={navLinkClasses}>
          <FaChartBar className="mr-3" />
          Analytics
        </NavLink>
        <NavLink to="/admin/settings" className={navLinkClasses}>
          <FaCog className="mr-3" />
          Settings
        </NavLink>
        <NavLink to="/admin/integrations" className={navLinkClasses}>
          <FaShareAlt className="mr-3" />
          Integrations
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
