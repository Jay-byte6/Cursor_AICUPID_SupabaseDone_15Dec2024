import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import Breadcrumb from '../Breadcrumb';

const Layout = () => {
  const location = useLocation();
  const { colors } = useTheme();
  const isPublicPage = ['/login', '/signup', '/'].includes(location.pathname);

  if (isPublicPage) {
    return <Outlet />;
  }

  return (
    <div className={`flex h-screen ${colors.light === 'pink-50' ? 'bg-pink-50' : 'bg-blue-50'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <Breadcrumb />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${colors.light === 'pink-50' ? 'bg-pink-50' : 'bg-blue-50'} p-4`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 