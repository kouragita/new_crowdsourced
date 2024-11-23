// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import axios from "axios";

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [loading, setLoading] = useState(false); // Loading state
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevState) => !prevState);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setSuccessMessage("");
//     setLoading(true); // Start spinner

//     try {
//       const response = await axios.post(
//         "https://e-learn-ncux.onrender.com/auth/login",
//         { username, password }
//       );

//       if (response.data.message === "Login successful") {
//         localStorage.setItem("authToken", response.data.token); // Store auth token
//         localStorage.setItem("username", username); // Store username
//         setSuccessMessage("Login successful!");

//         setTimeout(() => {
//           setLoading(false); // Stop spinner
//           navigate("/"); // Navigate to homepage
//         }, 2000); // Delay of 2 seconds
//       } else {
//         setLoading(false); // Stop spinner
//         setErrorMessage("Login failed. Please check your credentials.");
//       }
//     } catch (error) {
//       setLoading(false); // Stop spinner
//       if (error.response) {
//         setErrorMessage(error.response.data.message || "Login failed. Please try again.");
//       } else {
//         setErrorMessage("Network error. Please try again.");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         <p className="mt-4 text-indigo-600 font-semibold">Logging you in...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-blue-50">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-blue-600 text-center">
//           Welcome Back
//         </h2>
//         <p className="mt-2 text-sm text-gray-600 text-center">
//           Login to your account
//         </p>
//         <form onSubmit={handleLogin} className="mt-6 space-y-4">
//           {errorMessage && (
//             <div className="text-sm text-red-600 text-center">
//               {errorMessage}
//             </div>
//           )}
//           {successMessage && (
//             <div className="text-sm text-green-600 text-center">
//               {successMessage}
//             </div>
//           )}
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               placeholder="Enter your username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//               <span
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//               >
//                 {showPassword ? (
//                   <AiFillEyeInvisible className="text-gray-600" />
//                 ) : (
//                   <AiFillEye className="text-gray-600" />
//                 )}
//               </span>
//             </div>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="remember"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label
//                 htmlFor="remember"
//                 className="ml-2 block text-sm text-gray-800"
//               >
//                 Remember me
//               </label>
//             </div>
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot password?
//             </a>
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true); // Start spinner

    try {
      const response = await axios.post(
        "https://e-learn-ncux.onrender.com/auth/login",
        { username, password }
      );

      if (response.data.message === "Login successful") {
        const { token, isAdmin } = response.data;

        localStorage.setItem("authToken", token); // Store auth token
        localStorage.setItem("username", username); // Store username
        setSuccessMessage("Login successful!");

        // Check if the user is an admin
        if (isAdmin) {
          setTimeout(() => {
            setLoading(false); // Stop spinner
            navigate("/admin"); // Navigate to admin panel
          }, 2000); // Delay of 2 seconds
        } else {
          setTimeout(() => {
            setLoading(false); // Stop spinner
            navigate("/"); // Navigate to homepage
          }, 2000); // Delay of 2 seconds
        }
      } else {
        setLoading(false); // Stop spinner
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoading(false); // Stop spinner
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed. Please try again.");
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-semibold">Logging you in...</p>
      </div>
    );
  }

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
