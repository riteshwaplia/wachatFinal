// src/components/Navbar.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ links = [], brandName = 'Your Brand' }) => {
  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand/Logo */}
        <a href="/" className="text-2xl font-bold font-heading text-white hover:text-primary-100 transition-colors">
          {brandName}
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-lg font-medium hover:text-primary-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button (hidden for now, but placeholder) */}
        <div className="md:hidden">
          <button className="text-white hover:text-primary-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  brandName: PropTypes.string,
};

export default Navbar;