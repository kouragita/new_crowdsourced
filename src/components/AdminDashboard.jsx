import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [view, setView] = useState("users"); // Manage current view
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [paths, setPaths] = useState([]);
  const [modules, setModules] = useState([]);
  const [newPath, setNewPath] = useState("");
  const [newModule, setNewModule] = useState("");

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://e-learn-ncux.onrender.com/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Learning Paths
  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await axios.get("https://e-learn-ncux.onrender.com/api/learning_paths");
        setPaths(response.data);
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      }
    };
    fetchPaths();
  }, []);

  // Fetch Modules for a Specific Path
  const fetchModules = async (pathId) => {
    try {
      const response = await axios.get(
        `https://e-learn-ncux.onrender.com/api/learning_paths/${pathId}/modules`
      );
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Delete a User
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://e-learn-ncux.onrender.com/api/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Assign Role to User
  const assignRole = async (userId, roleId) => {
    try {
      await axios.post(`https://e-learn-ncux.onrender.com/api/users/${userId}/roles`, { role_id: roleId });
      alert("Role assigned successfully!");
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  // Create a New Learning Path
  const createPath = async () => {
    try {
      await axios.post("https://e-learn-ncux.onrender.com/api/learning_paths", { name: newPath });
      setNewPath("");
      alert("Learning path created successfully!");
    } catch (error) {
      console.error("Error creating learning path:", error);
    }
  };

  // Delete a Learning Path
  const deletePath = async (pathId) => {
    try {
      await axios.delete(`https://e-learn-ncux.onrender.com/api/learning_paths/${pathId}`);
      setPaths(paths.filter((path) => path.id !== pathId));
      alert("Learning path deleted successfully!");
    } catch (error) {
      console.error("Error deleting learning path:", error);
    }
  };

  // Create a New Module
  const createModule = async () => {
    try {
      await axios.post("https://e-learn-ncux.onrender.com/api/modules", { name: newModule });
      setNewModule("");
      alert("Module created successfully!");
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navbar */}
      <nav className="bg-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        <div className="space-x-4">
          <button onClick={() => setView("users")} className="px-4 py-2 bg-blue-500 text-white rounded">Manage Users</button>
          <button onClick={() => setView("learningPaths")} className="px-4 py-2 bg-green-500 text-white rounded">Manage Learning Paths</button>
          <button onClick={() => setView("modules")} className="px-4 py-2 bg-purple-500 text-white rounded">Manage Modules</button>
          <button onClick={() => setView("roles")} className="px-4 py-2 bg-orange-500 text-white rounded">Manage Roles</button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="mt-6">
        {/* Manage Users */}
        {view === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <table className="table-auto w-full bg-white shadow-md rounded overflow-hidden">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage Learning Paths */}
        {view === "learningPaths" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Learning Path Management</h2>
            <p>Learning Path management section coming soon!</p>
          </div>
        )}

        {/* Manage Modules */}
        {view === "modules" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Module Management</h2>
            <p>Module management section coming soon!</p>
          </div>
        )}

        {/* Manage Roles */}
        {view === "roles" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Role Management</h2>
            <p>Role management section coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;