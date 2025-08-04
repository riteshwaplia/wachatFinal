import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';

const UserLayout = ({ children, sidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Run once on mount to detect device width
    const isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
    // setSidebarOpen(!isMobile); // true for desktop, false for mobile
  }, []);


  return (
    <div className="flex min-h-screen dark:bg-dark-bg-primary bg-gray-50 w-full">
      {/* overlay */}
      {
        sidebarOpen && <div onClick={() => {
          if (window.innerHeight < 768) {
            setSidebarOpen(false);
          }
        }
        } className='w-screen h-screen z-30 bg-black bg-opacity-50 lg:overflow-y-auto  md:hidden fixed top-0 left-0'>

        </div>
      }
      {/* User Sidebar */}
      {sidebar && (
        <UserSidebar

          isOpen={sidebarOpen}
          isOff={() => (setSidebarOpen(false))}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebar && sidebarOpen ? 'md:ml-64' : 'md:ml-12'
        }`}>
        <Header

          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main onClick={() => {
          if (window.innerWidth < 768) {
            setSidebarOpen(false);
          }
        }
        } className="flex-grow   dark:bg-dark-bg-primary  md:p-6 lg:p-8 transition-all duration-300 w-[100vw] md:w-auto  ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;