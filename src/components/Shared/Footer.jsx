import React from "react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-800 text-gray-200 py-10">
      <div className="container mx-auto px-6 text-center">
        <h4 className="text-xl font-bold">CrowdSource</h4>
        <p className="mt-2">Building a better future, one learner at a time.</p>
        <nav className="mt-6 space-x-4">
          <a href="#features" className="hover:text-blue-400">Features</a>
          <a href="#testimonials" className="hover:text-blue-400">Testimonials</a>
          <a href="#contact" className="hover:text-blue-400">Contact</a>
        </nav>
        <p className="mt-6 text-gray-500">© 2024 CrowdSource. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


