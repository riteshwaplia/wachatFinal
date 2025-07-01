import React, { useState } from 'react';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';

const UserLayout = ({ children, sidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* User Sidebar */}
      {sidebar && (
        <UserSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
      )}
      
      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        sidebar && sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-grow p-4 md:p-6 lg:p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;