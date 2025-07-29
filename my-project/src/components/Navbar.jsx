// src/components/Navbar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTenant } from '../context/TenantContext';
import { useTranslation } from 'react-i18next';

const Navbar = ({ links = [], brandName = 'Your Brand' }) => {

  const { siteConfig } = useTenant(); // Access siteConfig
  const { t, i18n } = useTranslation();

  const { logoUrl, name } = siteConfig;

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand/Logo */}
        <a href="/" className="text-2xl font-bold font-heading text-white hover:text-primary-100 transition-colors">
          {logoUrl || "Sabnode"}

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
        {/* Language Selector */}
        <div className="flex items-center ml-4">
          <select
            value={i18n.language || 'en'}
            onChange={e => i18n.changeLanguage(e.target.value)}
            className="text-black px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
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