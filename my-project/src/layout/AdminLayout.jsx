import React from 'react';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
 
const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar - fixed on the left */}
      <AdminSidebar />
      <div className="flex flex-col flex-1 ml-64 "> {/* Main content area, offset by sidebar width */}
        {/* Header - fixed at the top of the main content area */}
        <Header />
        <main className="flex-grow p-4 md:p-6 lg:p-8"> {/* Main content area with padding */}
      <div className=''>
            {children}</div> {/* This is where your page content will be rendered */}
        </main>
      </div>
    </div>
  );
};
 
export default AdminLayout;