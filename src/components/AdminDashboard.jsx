import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPathModules, setSelectedPathModules] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState(null);

  const BASE_URL = "https://e-learn-ncux.onrender.com/api";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes, pathsRes] = await Promise.all([
        axios.get(`${BASE_URL}/users`),
        axios.get(`${BASE_URL}/roles`),
        axios.get(`${BASE_URL}/learning_paths`),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setLearningPaths(pathsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchModulesForPath = (pathId) => {
    setSelectedPathId(pathId);
    axios
      .get(`${BASE_URL}/learning_paths/${pathId}/modules`)
      .then((res) => setSelectedPathModules(res.data))
      .catch((err) => console.error("Error fetching modules:", err));
  };

  const handleAddUser = async () => {
    const username = prompt("Enter username:");
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");
    const roleId = prompt("Enter role ID:");
    try {
      const res = await axios.post(`${BASE_URL}/users`, {
        username,
        email,
        password,
        role_id: roleId,
      });
      setUsers([...users, res.data]);
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUserRole = async (userId) => {
    const newRoleId = prompt("Enter new role ID:");
    try {
      const res = await axios.patch(`${BASE_URL}/users/${userId}`, {
        role_id: newRoleId,
      });
      setUsers(users.map((user) => (user.id === userId ? res.data : user)));
      alert("Role updated successfully!");
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await axios.patch(`${BASE_URL}/users/${userId}`, { active: false });
      setUsers(users.filter((user) => user.id !== userId));
      alert("User deactivated!");
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      alert("User deleted!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddLearningPath = async () => {
    const title = prompt("Enter learning path title:");
    const description = prompt("Enter description:");
    const contributorId = prompt("Enter contributor ID:");
    try {
      const res = await axios.post(`${BASE_URL}/learning_paths`, {
        title,
        description,
        contributor_id: contributorId,
      });
      setLearningPaths([...learningPaths, res.data]);
      alert("Learning path added successfully!");
    } catch (err) {
      console.error("Error adding learning path:", err);
    }
  };

  const handleDeleteLearningPath = async (pathId) => {
    try {
      await axios.delete(`${BASE_URL}/learning_paths/${pathId}`);
      setLearningPaths(learningPaths.filter((path) => path.id !== pathId));
      alert("Learning path deleted!");
    } catch (error) {
      console.error("Error deleting learning path:", error);
    }
  };

  const handleAddModule = async () => {
    const title = prompt("Enter module title:");
    const description = prompt("Enter module description:");
    const order = prompt("Enter module order:");
    try {
      const res = await axios.post(`${BASE_URL}/modules`, {
        title,
        description,
        learning_path_id: selectedPathId,
        order,
      });
      setSelectedPathModules([...selectedPathModules, res.data]);
      alert("Module added successfully!");
    } catch (err) {
      console.error("Error adding module:", err);
    }
  };

  const handleAddRole = async () => {
    const name = prompt("Enter role name:");
    const description = prompt("Enter description:");
    try {
      const res = await axios.post(`${BASE_URL}/roles`, { name, description });
      setRoles([...roles, res.data]);
      alert("Role added!");
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await axios.delete(`${BASE_URL}/roles/${roleId}`);
      setRoles(roles.filter((role) => role.id !== roleId));
      alert("Role deleted!");
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <h1 className="text-white text-xl font-bold">Admin Panel</h1>
      </nav>
      <div className="p-6 space-y-8">
        {/* Users Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
          >
            Add User
          </button>
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="bg-white p-4 rounded shadow flex justify-between"
              >
                <span>{user.username} (Role ID: {user.role_id})</span>
                <div>
                  <button
                    onClick={() => handleUpdateUserRole(user.id)}
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Change Role
                  </button>
                  <button
                    onClick={() => handleDeactivateUser(user.id)}
                    className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Roles Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Roles</h2>
          <button
            onClick={handleAddRole}
            className="px-4 py-2 bg-green-500 text-white rounded mb-4"
          >
            Add Role
          </button>
          <ul className="space-y-2">
            {roles.map((role) => (
              <li
                key={role.id}
                className="bg-white p-4 rounded shadow flex justify-between"
              >
                <span>{role.name}</span>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Learning Paths Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Learning Paths</h2>
          <button
            onClick={handleAddLearningPath}
            className="px-4 py-2 bg-green-500 text-white rounded mb-4"
          >
            Add Learning Path
          </button>
          <ul className="space-y-2">
            {learningPaths.map((path) => (
              <li
                key={path.id}
                className="bg-white p-4 rounded shadow flex justify-between"
              >
                <span>{path.title}</span>
                <div>
                  <button
                    onClick={() => fetchModulesForPath(path.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    View Modules
                  </button>
                  <button
                    onClick={() => handleDeleteLearningPath(path.id)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Modules Section */}
        {selectedPathId && (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Modules for Learning Path ID: {selectedPathId}
            </h2>
            <button
              onClick={handleAddModule}
              className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
              Add Module
            </button>
            <ul className="space-y-2">
              {selectedPathModules.map((module) => (
                <li
                  key={module.id}
                  className="bg-white p-4 rounded shadow flex justify-between"
                >
                  <span>{module.title}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;