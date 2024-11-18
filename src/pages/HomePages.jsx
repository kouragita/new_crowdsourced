import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Homepage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-600">
            Unlock Your Learning Potential
          </h2>
          <p className="mt-4 text-gray-600">
            Empower yourself with our easy-to-use learning platform designed for
            students, teachers, and institutions.
          </p>
          <div className="mt-6">
            {/* Use Link to navigate to the signup page */}
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold text-center text-gray-800">
            Why Choose Learnify?
          </h3>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h4 className="text-xl font-bold text-blue-600">User-Friendly</h4>
              <p className="mt-4 text-gray-600">
                Intuitive and easy-to-navigate platform for all users.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h4 className="text-xl font-bold text-blue-600">Collaboration</h4>
              <p className="mt-4 text-gray-600">
                Foster teamwork with collaborative tools and features.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h4 className="text-xl font-bold text-blue-600">Customizable</h4>
              <p className="mt-4 text-gray-600">
                Tailor the platform to meet your unique learning needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold text-center text-gray-800">
            What Our Users Say
          </h3>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="italic text-gray-600">
                "Learnify transformed the way I approach learning."
              </p>
              <h4 className="mt-4 font-bold text-gray-800">- John Doe</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="italic text-gray-600">
                "Our team collaboration improved significantly!"
              </p>
              <h4 className="mt-4 font-bold text-gray-800">- Jane Smith</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="italic text-gray-600">
                "An essential platform for modern education."
              </p>
              <h4 className="mt-4 font-bold text-gray-800">- Alex Johnson</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
