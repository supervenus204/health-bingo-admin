import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Determine active tab from URL
  const getActiveTabFromPath = (pathname: string) => {
    if (pathname === '/users' || pathname === '/') return 'users';
    if (pathname === '/revenue') return 'revenue';
    if (pathname === '/bingocards') return 'bingocards';
    if (pathname === '/challenges') return 'challenges';
    if (pathname === '/promocodes') return 'promocodes';
    return 'users';
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const formatPageTitle = (tab: string) => {
    const titles: Record<string, string> = {
      users: 'User',
      revenue: 'Revenue',
      bingocards: 'Bingo Cards',
      challenges: 'Challenges',
      promocodes: 'Promo Codes',
    };
    return titles[tab] || tab;
  };

  return (
    <div className="flex h-screen bg-gray-very-light">
      <Sidebar activeTab={activeTab} />
      <div className="flex-1 ml-[260px] overflow-auto">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
