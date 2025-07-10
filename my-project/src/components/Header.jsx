import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Avatar from './Avatar';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';



import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
];

const Header = ({ onToggleSidebar }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const { id } = useParams();
  console.log("iddddd", id);
  const { siteConfig } = useTenant();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [open, setOpen] = useState(false);


  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  // console.log("drop",dropdownRef.current);
  // console.log("buttonref",buttonRef.current);
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { i18n } = useTranslation();

  const handleLogout = () => {
    console.log("clickeddd")
    logout();
    setIsDropdownOpen(false);
  };

  const { logoUrl } = siteConfig;


  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    i18n.changeLanguage(langCode);
  };

  return (
    <header className="bg-white dark:bg-dark-surface shadow-sm py-1 px-4 md:px-6 flex items-center justify-between sticky top-0 right-4 lg:z-20 z-10 w-full">
      {/* Mobile menu button and brand */}

      <div className="flex  items-center space-x-4">
        {(location.pathname !== '/projects' && location.pathname !== '/add-whatsapp-number') && (
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-md z-40 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}


        <Link to="/" className="flex items-center">
          {/* <span className="text-xl font-bold font-heading text-primary-700 hover:text-primary-600 transition-colors"> */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo"
              className="w-auto h-12"
            />
          ) : (
            "SabNode"
          )}
          {/* </span> */}
        </Link>
      </div>

      {/* User dropdown and Language selector */}
      <div className="relative flex items-center space-x-4">

        {/* i18next Language Switcher */}
        <div
          className="relative w-40"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Selected Language */}
          <div
            className="flex justify-between items-center w-full bg-white dark:bg-dark-surface 
               dark:text-white dark:border-dark-border border border-gray-300 
               hover:border-gray-400 px-4 py-2 rounded-md shadow cursor-pointer 
               focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span>{languages.find((l) => l.code === i18n.language)?.name || "English"}</span>
            <ChevronDown size={16} className="text-gray-700" />
          </div>

          {/* Dropdown Options */}
          {open && (
            <ul
              className="absolute left-0 mt-1 w-full bg-white dark:bg-dark-surface 
                 border border-gray-200 dark:border-dark-border 
                 rounded-md shadow-lg z-20 overflow-hidden"
            >
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  className="px-4 py-2 cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-dark-border"
                  onClick={() => {
                    handleLanguageChange({ target: { value: lang.code } });
                    setOpen(false); // ✅ Close dropdown after selection
                  }}
                >
                  {lang.name}
                </li>
              ))}
            </ul>
          )}
        </div>


        {isLoggedIn ? (
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`
        relative inline-flex items-center justify-center
        w-16 h-16 rounded-2xl
        transition-all duration-500 ease-out
        transform  
        
        bg-transparent
        backdrop-blur-sm  
        group overflow-hidden
      `}
            >
              {/* Animated background glow */}
              <div className={`
        absolute inset-0 rounded-2xl opacity-0 
        transition-opacity duration-300
        ${darkMode
                  ? 'bg-gradient-to-r from-violet-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                }
        blur-xl -z-10
      `} />

              {/* Icon */}
              <span className={`
        text-2xl transition-all duration-500 ease-out
        ${darkMode
                  ? 'rotate-180 filter '
                  : 'rotate-0 filter '
                }
      `}>
                {darkMode ? '🌙' : '☀️'}
              </span>

              {/* Ripple effect */}
              <div className={`
        absolute inset-0 rounded-2xl
        ${darkMode ? ' ' : ' '}
        opacity-0 group-active:opacity-20
        transition-opacity duration-150
      `} />
            </button>
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {/* Avatar Button */}
              <button
                className="flex items-center space-x-2 dark:hover:bg-dark-surface 
                   focus:outline-none dark:text-white rounded-full p-1 
                   hover:bg-gray-100 transition-colors"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <Avatar
                  src={
                    user?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random`
                  }
                  initials={user?.username?.charAt(0).toUpperCase() || "U"}
                  alt={user?.username || "User"}
                  size="sm"
                />
                <span className="font-medium text-gray-800 dark:text-white hidden md:inline-flex items-center">
                  {user?.username || "User"}
                  {isDropdownOpen ? (
                    <ChevronUp className="ml-1" size={16} />
                  ) : (
                    <ChevronDown className="ml-1" size={16} />
                  )}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 top-8 w-56 bg-white dark:bg-dark-surface 
                     dark:border-dark-border border border-gray-200 
                     rounded-lg shadow-lg py-1 z-[100]"
                >
                  <div className="px-4 py-3 border-b dark:border-dark-border border-gray-200">
                    <p className="text-sm font-semibold dark:text-dark-text-primary text-gray-900">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 dark:hover:bg-dark-surface 
                       text-sm text-gray-700 dark:text-dark-text-primary 
                       hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile Settings
                  </Link>

                  <div className="border-t dark:border-dark-border border-gray-200 my-1"></div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm dark:hover:bg-dark-surface 
                       text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>


          </div>
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
