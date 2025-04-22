import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Datepicker } from 'flowbite-react';

export default function Datasheet() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterProvince, setFilterProvince] = useState('');
  const [filterUsername, setFilterUsername] = useState('');
  const [filterStreetName, setFilterStreetName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filteredPins, setFilteredPins] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/pin/getPins');
        if (!response.ok) {
          throw new Error('Failed to fetch pins');
        }
        const data = await response.json();
        setPins(data);
        setFilteredPins(data);

        const cities = Array.from(new Set(data.map(pin => pin.location.city)));
        const statuses = Array.from(new Set(data.map(pin => pin.location.status)));

        setUniqueCities(cities);
        setUniqueStatuses(statuses);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      const filtered = pins.filter((pin) => {
        const { city, province, streetName } = splitAddress(pin.location.address);
        const status = pin.location.status;
  
        const matchesStatus = filterStatus ? status === filterStatus : true;
        const matchesCity = filterCity ? city.toLowerCase().includes(filterCity.toLowerCase()) : true;
        const matchesProvince = filterProvince ? province.toLowerCase().includes(filterProvince.toLowerCase()) : true;
        const matchesStreetName = filterStreetName ? streetName.toLowerCase().includes(filterStreetName.toLowerCase()) : true;
        const matchesUsername = filterUsername ? pin.createdBy.username.toLowerCase().includes(filterUsername.toLowerCase()) : true;
  
        // 🔍 New simple search-style match
        const matchesDate = filterDate
  ? pin.createdAt.includes(filterDate)
  : true;

  
        return (
          matchesStatus &&
          matchesCity &&
          matchesProvince &&
          matchesStreetName &&
          matchesUsername &&
          matchesDate
        );
      });
  
      setFilteredPins(filtered);
    };
  
    applyFilter();
  }, [filterStatus, filterCity, filterProvince, filterUsername, filterStreetName, filterDate, pins]);
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const splitAddress = (address) => {
    const parts = address.split(',');
    if (parts.length < 4) return {};

    const street = parts[0].trim();
    const city = parts[1].trim();
    const province = parts[2].trim().split(' ')[0];
    const postalCode = parts[2].trim().split(' ').slice(1).join(' ');
    const country = parts[3].trim();

    const streetParts = street.split(' ');
    const streetNumber = streetParts[0];
    const streetName = streetParts.slice(1).join(' ');

    return {
      streetNumber,
      streetName,
      city,
      province,
      postalCode,
      country
    };
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-black';
      case 'accepted':
        return 'bg-blue-500 text-white';
      case 'in-progress':
        return 'bg-orange-500 text-white';
      case 'resolved':
        return 'bg-green-500 text-white';
      case 'deleted':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  return (
    <div className="w-full overflow-x-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600">
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
            >
              <option value="">All</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
            <input
              type="text"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              list="city-suggestions"
              placeholder="Start typing city name..."
            />
            <datalist id="city-suggestions">
              {uniqueCities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>

          {/* Province Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
            <input
              type="text"
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              placeholder="Search by Province"
            />
          </div>

          {/* Street Name Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Name</label>
            <input
              type="text"
              value={filterStreetName}
              onChange={(e) => setFilterStreetName(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              placeholder="Search by Street Name"
            />
          </div>

          {/* Username Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              placeholder="Search by Username"
            />
          </div>

          {/* Date Filter */}

        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
        <table className="min-w-full max-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">User ID</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Username</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Phone Number</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Street Number</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Street Name</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">City</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Province</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Postal Code</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Country</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">Date Created</th>
              <th className="px-4 py-2 border border-gray-300 text-xs dark:text-gray-300">History</th>
            </tr>
          </thead>
          <tbody>
            {filteredPins.map((pin) => {
              const { streetNumber, streetName, city, province, postalCode, country } = splitAddress(pin.location.address);
              const statusClass = getStatusClass(pin.location.status);

              return (
                <tr key={pin._id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{pin.createdBy._id.slice(0, 6)}...</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{pin.createdBy.username}</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{pin.phoneNumber || 'N/A'}</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{streetNumber}</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{streetName}</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{city}</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{province}</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{postalCode}</td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">{country}</td>
                  <td className={`px-4 py-2 border border-gray-300 text-xs ${statusClass} hover:bg-gray-200 dark:text-gray-300`}>
                    {pin.location.status || 'N/A'}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">
                    {formatDate(pin.createdAt)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-xs hover:bg-gray-200 dark:text-gray-300">
                    <a href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
                      View History
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
