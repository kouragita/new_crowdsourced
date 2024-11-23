// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Shared/Navbar';
// import Footer from './components/Shared/Footer';
// import Home from './pages/HomePages.jsx';
// import LoginForm from './components/Auth/LoginForm';
// import SignupForm from './components/Auth/SignupForm';
// import Dashboard from './components/Dashboard';
// import UserProfile from './components/UserProfile.jsx';
// import UserDashboard from './components/UserDashboard.jsx';
// import Calendar from './components/Calendar.jsx';
// import CoursesPage from "./pages/CoursesPages.jsx";
// import ModulesPage from './pages/ModulesPage.jsx';
// import Leaderboard from './components/LeaderBoard.jsx';
// import AdminPanel from './components/Adminpanel.jsx'

// import './index.css';

// const App = () => (
//   <Router>
//     <div>
//       <Navbar />
//       <main className="min-h-screen">
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/signup" element={<SignupForm />} />

//           {/* Dashboard routes with persistent sidebar */}
//           <Route path="/dashboard" element={<Dashboard />}>
//             <Route index element={<UserDashboard />} /> {/* Default dashboard content */}
//             <Route path="profile" element={<UserProfile />} />
//             <Route path="courses" element={<CoursesPage />} />
//             <Route path="calendar" element={<Calendar />} />
//             <Route path="leaderboard" element={<Leaderboard />} />
//             <Route path="modules/:id" element={<ModulesPage />} /> {/* Ensure route for modules */}
//             <Route path="admin" element={<AdminPanel />} />
//           </Route>
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   </Router>
// );

// export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Home from './pages/HomePages.jsx';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import Calendar from './components/Calendar.jsx';
import CoursesPage from "./pages/CoursesPages.jsx";
import ModulesPage from './pages/ModulesPage.jsx';
import Leaderboard from './components/LeaderBoard.jsx';
import AdminPanel from './components/Adminpanel.jsx'

import './index.css';

// Helper function to check if user is admin
const isAdmin = () => {
  const userRole = localStorage.getItem('role'); // Assuming role is stored in localStorage
  return userRole === 'admin';
};

const App = () => (
  <Router>
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Dashboard routes with persistent sidebar */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<UserDashboard />} /> {/* Default dashboard content */}
            <Route path="profile" element={<UserProfile />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="modules/:id" element={<ModulesPage />} /> {/* Ensure route for modules */}
            
            {/* Admin Panel route (restricted to admin users) */}
            <Route
              path="admin"
              element={isAdmin() ? <AdminPanel /> : <Navigate to="/dashboard" />}
            />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  </Router>
);

export default App;
