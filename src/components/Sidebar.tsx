import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Target, Ticket, Trophy, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'bingocards', label: 'Bingo Cards', icon: Target },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'promocodes', label: 'Promo Codes', icon: Ticket },
  ];

  return (
    <div className="w-[260px] bg-primary-blue text-white h-screen fixed left-0 top-0 z-30">
      <div className="px-6 border-b border-white/10">
          <img
            src="/logo.png"
            alt="Health Bingo"
            className="w-full h-auto rounded-lg"
          />
      </div>

      <nav className="mt-6 px-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                const path = item.id === 'users' ? '/' : `/${item.id}`;
                navigate(path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-primary-green text-white shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 bg-white/10 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.display_name || 'Admin User'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.email || 'admin@healthbingo.com'}
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-3">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-300 hover:text-white hover:bg-red-500/20 rounded-md transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
