import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaArrowUp,
  FaHeart,
  FaGithub
} from "react-icons/fa";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
      setIsSubscribing(false);
    }, 1500);
  };

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "#home" },
        { label: "Features", href: "#features" },
        { label: "Top Learners", href: "#leaderboard" },
        { label: "Testimonials", href: "#testimonials" },
      ]
    },
    {
      title: "Learning",
      links: [
        { label: "All Courses", href: "/courses" },
        { label: "Learning Paths", href: "/learning-paths" },
        { label: "Leaderboard", href: "/dashboard/leaderboard" },
        { label: "Calendar", href: "/dashboard/calendar" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ]
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-600" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-blue-400" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-700" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-600" },
    { icon: FaGithub, href: "https://github.com", label: "GitHub", color: "hover:text-gray-600" },
  ];

  const contactInfo = [
    { icon: FaEnvelope, text: "support@crowdsourced.com" },
    { icon: FaPhone, text: "+254 700 123 456" },
    { icon: FaMapMarkerAlt, text: "Nairobi, Kenya" },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <h4 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CrowdSourced
                </h4>
                <p className="mt-4 text-gray-400 text-sm lg:text-base leading-relaxed">
                  Building a better future, one learner at a time. Empower yourself with our innovative learning platform.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <p className="text-sm font-semibold mb-4">Follow Us</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 ${social.color} transition-colors duration-200`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Footer Sections */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <h5 className="text-lg font-semibold text-white mb-6">{section.title}</h5>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.href.startsWith('#') ? (
                        <motion.button
                          onClick={() => scrollToSection(link.href)}
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
                          whileHover={{ x: 5 }}
                        >
                          {link.label}
                        </motion.button>
                      ) : (
                        <motion.div whileHover={{ x: 5 }}>
                          <Link
                            to={link.href}
                            className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h5 className="text-lg font-semibold text-white mb-6">Stay Updated</h5>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and learning tips.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm transition-all duration-200"
                    disabled={isSubscribing}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubscribing ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubscribing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.p 
                className="text-gray-500 text-sm text-center md:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                © 2024 CrowdSourced. All Rights Reserved. Made with{" "}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block"
                >
                  <FaHeart className="inline text-red-500 w-4 h-4" />
                </motion.span>{" "}
                in Kenya
              </motion.p>
              
              <div className="flex items-center space-x-4 text-sm">
                <Link 
                  to="/privacy" 
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
                >
                  Privacy
                </Link>
                <span className="text-gray-600">|</span>
                <Link 
                  to="/terms" 
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
                >
                  Terms
                </Link>
                <span className="text-gray-600">|</span>
                <Link 
                  to="/cookies" 
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 z-50"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FaArrowUp size={20} />
      </motion.button>
    </footer>
  );
};

export default Footer;