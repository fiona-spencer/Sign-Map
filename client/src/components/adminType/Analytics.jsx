import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis as LineXAxis, YAxis as LineYAxis, CartesianGrid as LineCartesianGrid, Tooltip as LineTooltip, Legend as LineLegend, ResponsiveContainer as LineResponsiveContainer } from 'recharts';

export default function Analytics() {
  // Example of state to hold the analytics data
  const [analyticsData, setAnalyticsData] = useState({
    pageTraffic: 0,
    signIns: 0,
    signUps: 0,
    usersData: {
      public: 0,
      regular: 0,
      admin: 0
    },
    totalUsers: 0,
    totalPins: 0,
    totalVisitors: 0,
    pageTrafficOverTime: []
  });

  // Simulating fetching data with useEffect
  useEffect(() => {
    // Mock data fetch
    setTimeout(() => {
      setAnalyticsData({
        pageTraffic: 12000,
        signIns: 2500,
        signUps: 1300,
        usersData: {
          public: 5000,
          regular: 4000,
          admin: 1000
        },
        totalUsers: 8000,
        totalPins: 5000,
        totalVisitors: 15000,
        pageTrafficOverTime: [
          { timestamp: '2025-04-20 00:00', traffic: 500 },
          { timestamp: '2025-04-20 01:00', traffic: 600 },
          { timestamp: '2025-04-20 02:00', traffic: 700 },
          { timestamp: '2025-04-20 03:00', traffic: 800 },
          { timestamp: '2025-04-20 04:00', traffic: 950 },
          { timestamp: '2025-04-20 05:00', traffic: 1200 },
          { timestamp: '2025-04-20 06:00', traffic: 1100 },
          { timestamp: '2025-04-20 07:00', traffic: 1050 },
          { timestamp: '2025-04-20 08:00', traffic: 1500 },
        ]
      });
    }, 1000);
  }, []);

  const data = [
    {
      name: 'Users',
      public: analyticsData.usersData.public,
      regular: analyticsData.usersData.regular,
      admin: analyticsData.usersData.admin
    }
  ];

  const pageTrafficData = analyticsData.pageTrafficOverTime.map(item => ({
    time: item.timestamp,
    traffic: item.traffic
  }));

  return (
    <div className="min-h-screen p-8 dark:bg-gray-900 dark:text-white bg-white text-black">
      <h1 className="text-3xl font-semibold mb-4">Website Analytics</h1>

      {/* Page Traffic Section */}
      <div className="mb-6">
        <h3 className="text-2xl mb-2">Page Traffic: {analyticsData.pageTraffic}</h3>
        <h4 className="text-xl mb-2">Traffic Over Time</h4>
        <div className="w-full h-72">
          <LineResponsiveContainer width="100%" height="100%">
            <LineChart data={pageTrafficData}>
              <Line type="monotone" dataKey="traffic" stroke="#8884d8" />
              <LineCartesianGrid strokeDasharray="3 3" />
              <LineXAxis dataKey="time" />
              <LineYAxis />
              <LineTooltip />
              <LineLegend />
            </LineChart>
          </LineResponsiveContainer>
        </div>
      </div>

      {/* User Stats Section */}
      <div className="mb-6">
        <h3 className="text-2xl mb-2">User Statistics</h3>
        <p>Total Users: {analyticsData.totalUsers}</p>
        <p>Total Pins: {analyticsData.totalPins}</p>
        <p>Total Visitors: {analyticsData.totalVisitors}</p>
      </div>

      {/* User Types Bar Graph */}
      <div className="w-full h-72">
        <h3 className="text-2xl mb-2">User Types Bar Graph</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="public" fill="#8884d8" />
            <Bar dataKey="regular" fill="#82ca9d" />
            <Bar dataKey="admin" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
