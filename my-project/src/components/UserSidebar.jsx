
import React from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  Building,
  Mail,
  Briefcase,
  MessageSquare,
  Phone,
  ChevronLeft,
  ChevronRight,
  StepForward
} from 'lucide-react';
import { useTenant } from '../context/TenantContext';

const UserSidebar = ({ isOpen, onToggle, isOff }) => {
  const location = useLocation();
  const { id } = useParams();
  const { siteConfig } = useTenant();
  const { logoUrl } = siteConfig;


  const navItems = [
    ...(id ? [{
      label: 'Project Dashboard',
      path: `/project/${id}/dashboard`,
      icon: <LayoutDashboard size={18} />
    }] : []),

    ...(id ? [
      {
        label: 'Project Details',
        path: `/project/${id}/project-details`,
        icon: <Briefcase size={18} />
      },
      {
        label: 'Contacts',
        path: `/project/${id}/contacts`,
        icon: <Phone size={18} />
      },
      {
        label: 'Groups',
        path: `/project/${id}/group`,
        icon: <Users size={18} />
      },
      {
        label: 'Templates',
        path: `/project/${id}/templates`,
        icon: <MessageSquare size={18} />
      },
      // {
      // label: 'Team Members',
      // path: `/team/members`,
      // icon: <Users size={18} />
      // },
      {
        label: 'Broadcasting',
        path: `/project/${id}/broadcasting`,
        icon: <Mail size={18} />
      },
      {
        label: 'Live Chat',
        path: `/project/${id}/chat`,
        icon: <MessageSquare size={18} />
      },
      {
        label: 'flow builder',
        path: `/project/${id}/flows`,
        icon: <StepForward size={18} />
      }
    ] : []),
  ];

  const isActive = (path) => {
    if (path === '/projects') {
      return location.pathname === '/projects';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`bg-white dark:bg-dark-bg-primary dark:text-dark-text-primary h-screen dark:border-dark-border shadow-lg fixed top-0 left-0 flex flex-col border-r border-gray-200 z-30 transition-all duration-300 ${isOpen ? 'md:w-64 ' : 'md:w-20 w-0 md:z-[100] z-0'
      }`}>
      <div className="p-4 flex items-center justify-between ">
        {isOpen ? (
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
          // <h2 className="text-xl font-bold font-heading text-primary-700 truncate">
          //   {siteConfig?.websiteName || 'User Panel'}
          // </h2>
        ) : (
          <div className="w-8 h-8 hidden  rounded-full lg:flex items-center justify-center">
            <Link to="/" className="flex items-center">
              {/* <span className="text-xl font-bold font-heading text-primary-700 hover:text-primary-600 transition-colors"> */}
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Company Logo"
                  // className="w-auto h-12"
                />
              ) : (
                "SabNode".slice(0, 1)
              )}
              {/* </span> */}
            </Link>
            {/* <span className="text-primary-600 font-bold text-sm">
{siteConfig?.websiteName?.charAt(0) || 'U'}
</span> */}
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md hidden lg:flex hover:bg-gray-100 text-gray-500 dark:text-dark-text-primary hover:text-gray-700 transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
        <button
          onClick={onToggle}
          className="p-1 rounded-md md:hidden hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft size={18} /> : ""}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => (
          <Link
            onClick={() => {
              if (window.innerWidth < 768) {
                isOff()
              }
            }
            }
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-3 md:flex rounded-lg transition-all duration-200 mb-1 ${isActive(item.path)
              ? 'md:bg-primary-50 dark:bg-dark-surface md:text-primary-700 font-semibold '
              : 'text-gray-700 dark:text-dark-text-primary dark:hover:bg-dark-surface dark:hover:text-dark-text-primary hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            {isOpen && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-dark-border">
        <Link
          to="/projects"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${location.pathname.startsWith('/settings')
            ? 'bg-primary-50 text-primary-700 dark:text-black font-semibold'
            : 'text-gray-700 dark:text-dark-text-primary hover:dark:text-black hover:bg-gray-100 hover:text-gray-900'
            }`}
        >

          <Briefcase size={18} />
          {isOpen && <span>Projects</span>}

        </Link> <Link
          to={`/project/${id}/setting`}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${location.pathname.startsWith('/settings')
            ? 'bg-primary-50 text-primary-700 font-semibold'
            : 'text-gray-700 dark:text-dark-text-primary hover:dark:text-black hover:bg-gray-100 hover:text-gray-900'
            }`}
        >

          <IoSettingsOutline size={18} />
          {isOpen && <span>Settings</span>}

        </Link>

      </div>
    </aside>
  );
};

export default UserSidebar;