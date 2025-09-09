import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'bingocards', label: 'Bingo Cards', icon: '🎯' },
    { id: 'promocodes', label: 'Promo Codes', icon: '🎫' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src="https://d64gsuwffb70l.cloudfront.net/68bb5074d29f4ea4e372ac3c_1757106340834_7cde93bf.webp"
            alt="Health Bingo"
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h2 className="text-xl font-bold">Health Bingo</h2>
            <p className="text-gray-400 text-sm">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              const path = item.id === 'dashboard' ? '/' : `/${item.id}`;
              navigate(path);
            }}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
              activeTab === item.id
                ? 'bg-emerald-600 border-r-4 border-emerald-400'
                : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <p className="text-sm font-medium">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.display_name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-400">
              {user?.email || 'admin@healthbingo.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
