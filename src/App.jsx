import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Home from './pages/HomePages.jsx';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import Calendar from './components/Calendar.jsx';
import CoursesPage from "./pages/CoursesPages.jsx"


import './index.css';

const App = () => (
  <Router>
    <div>
      <Navbar />
      <main className="min-h-screen"> {/* Ensure content does not overlap with the footer */}
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/calendar" element={<Calendar />} />

        </Routes>
      </main>
      <Footer />
    </div>
  </Router>
);

export default App;
