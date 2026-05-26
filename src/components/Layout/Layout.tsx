import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} pt-16`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;