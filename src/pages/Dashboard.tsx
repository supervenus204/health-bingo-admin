import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Users',
      value: '12,847',
      change: '+12%',
      color: 'bg-blue-500',
    },
    {
      label: 'Active Bingo Cards',
      value: '1,234',
      change: '+8%',
      color: 'bg-emerald-500',
    },
    {
      label: 'Monthly Revenue',
      value: '$45,678',
      change: '+15%',
      color: 'bg-purple-500',
    },
    {
      label: 'Promo Codes Used',
      value: '567',
      change: '+23%',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/68bb5074d29f4ea4e372ac3c_1757106341780_405afb78.webp"
          alt="Dashboard"
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with Health Bingo today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4`}
              >
                {stat.label.charAt(0)}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-sm text-green-600 font-medium">
                  {stat.change} from last month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              {
                action: 'New user registered',
                user: 'Jordan Venus',
                time: '2 minutes ago',
              },
              {
                action: 'Bingo card completed',
                user: 'Alex Smith',
                time: '15 minutes ago',
              },
              {
                action: 'Promo code used',
                user: 'Sam Johnson',
                time: '1 hour ago',
              },
              {
                action: 'Password reset',
                user: 'Taylor Brown',
                time: '2 hours ago',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Categories
          </h3>
          <div className="space-y-4">
            {[
              { category: 'Weight Loss', count: 456, color: 'bg-orange-500' },
              { category: 'Mental Health', count: 389, color: 'bg-blue-500' },
              { category: 'Fitness', count: 234, color: 'bg-green-500' },
              { category: 'Nutrition', count: 155, color: 'bg-purple-500' },
            ].map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 ${cat.color} rounded-full mr-3`}
                  ></div>
                  <span className="font-medium text-gray-900">
                    {cat.category}
                  </span>
                </div>
                <span className="text-gray-600">{cat.count} cards</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
