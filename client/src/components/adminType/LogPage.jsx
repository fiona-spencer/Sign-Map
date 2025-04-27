import React, { useState } from 'react';

export default function LogPage() {
  // Sample log data - in a real application, you would fetch this from a server or API
  const [logData, setLogData] = useState([
    {
      id: 1,
      date: '2025-04-20 14:30',
      username: 'john_doe',
      email: 'john.doe@example.com',
      activity: 'Logged In',
      history: 'User logged in successfully.'
    },
    {
      id: 2,
      date: '2025-04-19 08:00',
      username: 'jane_smith',
      email: 'jane.smith@example.com',
      activity: 'Account Created',
      history: 'User created a new account.'
    },
    {
      id: 3,
      date: '2025-04-18 16:20',
      username: 'mark_walker',
      email: 'mark.walker@example.com',
      activity: 'Account Deleted',
      history: 'User deleted their account.'
    },
    {
      id: 4,
      date: '2025-04-17 12:10',
      username: 'lucy_james',
      email: 'lucy.james@example.com',
      activity: 'File Submitted',
      history: 'User submitted a file titled "project.pdf".'
    }
  ]);

  const [sortBy, setSortBy] = useState('date'); // Default sorting by date
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending order
  const [activityFilter, setActivityFilter] = useState(''); // Default no filter

  // Sorting function
  const sortData = (data) => {
    return data.sort((a, b) => {
      if (sortBy === 'date') {
        // Sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'username') {
        // Sort by username
        const usernameA = a.username.toLowerCase();
        const usernameB = b.username.toLowerCase();
        return sortOrder === 'asc' ? usernameA.localeCompare(usernameB) : usernameB.localeCompare(usernameA);
      }
      return 0;
    });
  };

  // Filtering function
  const filterData = (data) => {
    if (activityFilter) {
      return data.filter((log) => log.activity.toLowerCase().includes(activityFilter.toLowerCase()));
    }
    return data;
  };

  // Apply sorting and filtering
  const filteredAndSortedData = filterData(sortData([...logData]));

  // Toggle sort order for Date
  const toggleSortByDate = () => {
    if (sortBy === 'date') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('date');
      setSortOrder('asc');
    }
  };

  // Toggle sort order for Username
  const toggleSortByUsername = () => {
    if (sortBy === 'username') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('username');
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-semibold mb-4">Activity Log</h1>

      {/* Filter by Activity */}
      <div className="mb-6">
        <label className="block mb-2">Filter by Activity:</label>
        <input
          type="text"
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
          placeholder="Search by activity"
          className="p-2 w-full rounded-md border"
        />
      </div>

      {/* Sorting Controls */}
      <div className="flex space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSortByDate}
            className="text-lg p-2 rounded-md border dark:bg-gray-700 dark:text-white"
          >
            Sort by Date
            {sortBy === 'date' && (sortOrder === 'asc' ? ' (Asc)' : ' (Desc)')}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSortByUsername}
            className="text-lg p-2 rounded-md border dark:bg-gray-700 dark:text-white"
          >
            Sort by Username
            {sortBy === 'username' && (sortOrder === 'asc' ? ' (Asc)' : ' (Desc)')}
          </button>
        </div>
      </div>

      {/* Table to display log data */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Activity</th>
              <th className="px-4 py-2 text-left">History</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((log) => (
              <tr key={log.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{log.date}</td>
                <td className="px-4 py-2">{log.username}</td>
                <td className="px-4 py-2">{log.email}</td>
                <td className="px-4 py-2">{log.activity}</td>
                <td className="px-4 py-2">{log.history}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
