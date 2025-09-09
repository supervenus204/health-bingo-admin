import React, { useState } from 'react';

const Revenue: React.FC = () => {
  const [timeframe, setTimeframe] = useState('month');

  const revenueData = {
    total: '$125,847',
    month: '$45,678',
    week: '$12,345',
    today: '$1,892',
  };

  const chartData = [
    { period: 'Jan', revenue: 35000 },
    { period: 'Feb', revenue: 42000 },
    { period: 'Mar', revenue: 38000 },
    { period: 'Apr', revenue: 51000 },
    { period: 'May', revenue: 45678 },
  ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
        <div className="flex space-x-2">
          {['total', 'month', 'week', 'today'].map(period => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                timeframe === period
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(revenueData).map(([key, value]) => (
          <div
            key={key}
            className={`bg-white rounded-lg shadow p-6 ${
              timeframe === key ? 'ring-2 ring-emerald-500' : ''
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">
              {key} Revenue
            </h3>
            <p className="text-3xl font-bold text-emerald-600">{value}</p>
            <p className="text-sm text-gray-600 mt-2">
              {key === 'total' ? 'All time' : `Current ${key}`}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Revenue Trend
        </h3>
        <div className="h-64 flex items-end justify-between space-x-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gray-200 rounded-t-lg relative"
                style={{ height: '200px' }}
              >
                <div
                  className="bg-emerald-500 rounded-t-lg absolute bottom-0 w-full transition-all duration-500"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-900 mt-2">
                {data.period}
              </p>
              <p className="text-xs text-gray-600">
                ${(data.revenue / 1000).toFixed(0)}k
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Sources
          </h3>
          <div className="space-y-4">
            {[
              {
                source: 'Premium Subscriptions',
                amount: '$28,450',
                percentage: 62,
              },
              {
                source: 'Bingo Card Purchases',
                amount: '$12,890',
                percentage: 28,
              },
              { source: 'In-App Purchases', amount: '$4,338', percentage: 10 },
            ].map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    {source.source}
                  </span>
                  <span className="text-emerald-600 font-bold">
                    {source.amount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Regions
          </h3>
          <div className="space-y-4">
            {[
              { region: 'North America', revenue: '$18,450', users: 4567 },
              { region: 'Europe', revenue: '$15,230', users: 3890 },
              { region: 'Asia Pacific', revenue: '$8,120', users: 2134 },
              { region: 'Australia', revenue: '$3,878', users: 1456 },
            ].map((region, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{region.region}</p>
                  <p className="text-sm text-gray-600">{region.users} users</p>
                </div>
                <span className="text-emerald-600 font-bold">
                  {region.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
