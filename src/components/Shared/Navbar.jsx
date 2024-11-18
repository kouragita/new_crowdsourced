import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Make the Learnify logo clickable to navigate to the home page */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CrowdSource
        </Link>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#testimonials" className="hover:text-blue-600">Testimonials</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>
        <div className="space-x-4">
          {/* Change the href to use Link and navigate to /login */}
          <Link
            to="/login"
            className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;



