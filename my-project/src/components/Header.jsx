import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Avatar from './Avatar';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
];

const Header = ({ onToggleSidebar }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const { siteConfig } = useTenant();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { i18n } = useTranslation();

  const { id } = useParams()
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    i18n.changeLanguage(langCode);
  };

  return (
    <header className="bg-white shadow-sm py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 w-[100vw] md:w-auto">
      {/* Mobile menu button and brand */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded-md z-40 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold font-heading text-primary-700 hover:text-primary-600 transition-colors">
            {siteConfig?.websiteName || 'My App'}
          </span>
        </Link>
      </div>

      {/* User dropdown and Language selector */}
      <div className="relative flex items-center space-x-4">
        {/* i18next Language Switcher */}
        <div className="relative">
          <select
            value={i18n.language || 'en'}
            onChange={handleLanguageChange}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={16} />
          </div>
        </div>

        {isLoggedIn ? (
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none rounded-full p-1 hover:bg-gray-100 transition-colors"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <Avatar
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                initials={user?.username?.charAt(0).toUpperCase() || 'U'}
                alt={user?.username || 'User'}
                size="sm"
              />
              <span className="font-medium text-gray-800 hidden md:inline-flex items-center">
                {user?.username || 'User'}
                {isDropdownOpen ? <ChevronUp className="ml-1" size={16} /> : <ChevronDown className="ml-1" size={16} />}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link
                  to={`/project/${id}/user-profile`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  to={`/project/${id}/dashboard`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none"
                >
                  Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 rounded-md transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
