import { useAuth } from '@/hooks/useAuth';
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Determine active tab from URL
  const getActiveTabFromPath = (pathname: string) => {
    if (pathname === '/users') return 'users';
    if (pathname === '/revenue') return 'revenue';
    if (pathname === '/bingocards') return 'bingocards';
    if (pathname === '/promocodes') return 'promocodes';
    return 'dashboard';
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} />
      <div className="flex-1 ml-64 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.first_name || 'Admin'}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
