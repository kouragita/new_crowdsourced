import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const [topLearners, setTopLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArrow, setShowArrow] = useState(false);  // State to control arrow visibility

  useEffect(() => {
    const fetchTopLearners = async () => {
      try {
        const response = await axios.get("https://e-learn-ncux.onrender.com/api/leaderboard");
        if (Array.isArray(response.data.leaderboard)) {
          setTopLearners(response.data.leaderboard);
        } else {
          console.error("API did not return leaderboard data", response.data);
        }
      } catch (err) {
        console.error("Error fetching leaderboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLearners();
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollPosition + windowHeight >= scrollHeight - 10) {
        setShowArrow(true); // Show arrow when at the bottom
      } else {
        setShowArrow(false); // Hide arrow when not at the bottom
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-600">Unlock Your Learning Potential</h2>
          <p className="mt-4 text-gray-600">
            Empower yourself with our easy-to-use learning platform designed for
            students, teachers, and institutions.
          </p>
          <div className="mt-6">
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
            Why Choose CrowdSourced?
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

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Top Learners
          </h3>

          {/* Top Learners (Blurred Effect) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              topLearners.slice(0, 3).map((learner, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg text-center"
                >
                  <h4 className="font-bold text-gray-800">{learner.username}</h4>
                  <p className="text-gray-600">{learner.total_points} points</p>
                  {learner.badges.length > 0 && (
                    <span className="text-sm text-yellow-600 font-semibold">
                      {learner.badges.join(", ")}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Blurred Learners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              topLearners.slice(3).map((learner, index) => (
                <div
                  key={index + 3}
                  className="bg-white p-6 rounded-lg shadow-lg text-center opacity-50 cursor-not-allowed"
                  style={{ filter: "blur(5px)" }}
                >
                  <h4 className="font-bold text-gray-800">Hidden for Privacy</h4>
                  <p className="text-gray-600">Points: Hidden</p>
                </div>
              ))
            )}
          </div>

          {/* View More Button */}
          <div className="absolute inset-x-0 bottom-6 text-center w-full">
            <Link
              to="/dashboard/leaderboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-700 transform hover:scale-110 transition duration-300"
              style={{ zIndex: 10 }}
            >
              View More
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Top Arrow */}
      {showArrow && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-110"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold text-center text-gray-800">
            What Our Users Say
          </h3>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="italic text-gray-600">
                "CrowdSourced transformed the way I approach learning."
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