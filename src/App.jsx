import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Home from './pages/Home';
import LearningPaths from './pages/LearningPaths';
import Community from './pages/Community';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import NotFound from './pages/Notfound';
import LoginForm from './components/Auth/LoginForm';

const App = () => (
  <Router>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/community" element={<Community />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/profile" element={<Profile userId={1} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
