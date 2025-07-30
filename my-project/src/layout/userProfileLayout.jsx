import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StaticsSidebar from '../components/StaticsSidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserProfileLayout = ({ children, sidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, token } = useAuth();

  const navigate = useNavigate()


  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
    }
  })

  useEffect(() => {
    // Run once on mount to detect device width
    const isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
    setSidebarOpen(!isMobile); // true for desktop, false for mobile
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-scroll">
      {/* overlay */}
      {
        sidebarOpen && <div onClick={() => {
          if (window.innerHeight < 768) {
            setSidebarOpen(false);
          }
        }
        } className='w-screen h-screen z-30 bg-black bg-opacity-50  md:hidden fixed top-0 left-0'>

        </div>
      }
      {/* User Sidebar */}
      {sidebar && (
        <StaticsSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        sidebar && sidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-20'
      }`}>
        <Header  
        
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main onClick={()=>{
           if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }}
        } className="flex-grow md:p-4 p-2 dark:bg-dark-bg-primary  overflow-hidden md:p-6 lg:p-8 transition-all duration-300 w-[100vw] md:w-auto  ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserProfileLayout;
