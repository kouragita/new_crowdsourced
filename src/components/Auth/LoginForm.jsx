import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Importing eye icons
import axios from "axios"; // Importing axios

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const navigate = useNavigate(); // To redirect user after successful login

  // Function to toggle the password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setErrorMessage(""); // Clear previous error message
    setSuccessMessage(""); // Clear previous success message

    try {
      // Sending POST request to the backend for login
      const response = await axios.post("https://e-learn-ncux.onrender.com/auth/login", { username, password });

      // If login is successful, store token (or user info) and navigate to a new page
      if (response.data.success) {
        // Example: Store token in local storage or context
        localStorage.setItem("authToken", response.data.token);

        // Set success message and display it
        setSuccessMessage("Login successful!");

        // Redirect user to dashboard or homepage after a short delay
        setTimeout(() => {
          navigate("/dashboard"); // Adjust this path as per your requirement
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      // Handling error from login API
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed. Please try again.");
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 text-center">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Login to your account
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {errorMessage && (
            <div className="text-sm text-red-600 text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-sm text-green-600 text-center">
              {successMessage}
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="text-gray-600" />
                ) : (
                  <AiFillEye className="text-gray-600" />
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-800"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

