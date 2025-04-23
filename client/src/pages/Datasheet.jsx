import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'flowbite-react';
import Map from './Map';
import defaultPinImage from '../assets/default_pin_image.png';

export default function Datasheet({ apiKey, mapState }) {
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

  const statusOptions = ['pending', 'accepted', 'in-progress', 'resolved', 'deleted'];

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/pin/getPins');
        if (!response.ok) throw new Error('Failed to fetch pins');
        const data = await response.json();
        setPins(data);
        setFilteredPins(data);

        const cities = Array.from(new Set(data.map(pin => pin.location.address.split(',')[1]?.trim())));
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
        const matchesStatus = filterStatus ? pin.location.status === filterStatus : true;
        const matchesCity = filterCity ? pin.location.address.toLowerCase().includes(filterCity.toLowerCase()) : true;
        const matchesProvince = filterProvince ? pin.location.address.toLowerCase().includes(filterProvince.toLowerCase()) : true;
        const matchesAddress = filterStreetName ? pin.location.address.toLowerCase().includes(filterStreetName.toLowerCase()) : true;
        const matchesUsername = filterUsername ? pin.createdBy.username.toLowerCase().includes(filterUsername.toLowerCase()) : true;
        const matchesDate = filterDate ? pin.createdAt.includes(filterDate) : true;

        return (
          matchesStatus &&
          matchesCity &&
          matchesProvince &&
          matchesAddress &&
          matchesUsername &&
          matchesDate
        );
      });

      setFilteredPins(filtered);
    };

    applyFilter();
  }, [filterStatus, filterCity, filterProvince, filterUsername, filterStreetName, filterDate, pins]);

  const handleResetFilters = () => {
    setFilterStatus('');
    setFilterCity('');
    setFilterProvince('');
    setFilterUsername('');
    setFilterStreetName('');
    setFilterDate('');
  };

  const handleShowAllPins = () => {
    setFilteredPins(pins); // Reset the filters and show all the pins
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-black';
      case 'accepted': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-orange-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'deleted': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getImage = (pin) => {
    return pin.location.info.image || defaultPinImage;  // Provide the path to your default image
  };

  return (
    <div className="w-full overflow-x-auto p-6 bg-[#267b6684] dark:bg-gray-800">
      {/* Filter Section */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Status Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Other Filters */}
          <input
            type="text"
            placeholder="City"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Province"
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={filterStreetName}
            onChange={(e) => setFilterStreetName(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Username"
            value={filterUsername}
            onChange={(e) => setFilterUsername(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border rounded"
          />
          <Button
            onClick={handleResetFilters}
            className="w-full md:w-auto text-xs py-2 px-4 bg-red-500 text-white hover:bg-red-600"
          >
            Reset Filters
          </Button>
          {/* Show All Pins Button */}
          <Button
            onClick={handleShowAllPins}
            className="w-full md:w-auto text-xs py-2 px-4 bg-green-500 text-white hover:bg-green-600"
          >
            Show All Pins
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Pin ID</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Username</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Phone Number</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Address</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Title</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Icon</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Image</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Status</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Created At</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">Updated At</th>
              <th className="px-4 py-2 border text-xs dark:text-gray-300">History</th>
            </tr>
          </thead>
          <tbody>
            {filteredPins.map((pin, index) => (
              <tr key={pin._id || index} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Tooltip content={pin._id} placement="top">
                    <span className="truncate max-w-[100px] inline-block align-bottom cursor-pointer text-blue-500">
                      {pin._id.slice(0, 6)}...
                    </span>
                  </Tooltip>
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  {pin.createdBy?.username || 'N/A'}
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  {pin.phoneNumber || 'N/A'}
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  {pin.location.address}
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  {pin.location.info.title}
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  {pin.location.info.icon}
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  <img
                    src={getImage(pin)}
                    alt="Pin"
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td className={`px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600 ${getStatusClass(pin.location.status)}`}>
                  {pin.location.status}
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  {formatDate(pin.createdAt)}
                </td>
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  {formatDate(pin.updatedAt)}
                </td>
                {/* New History Column */}
                <td className="px-4 py-2 border text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
                  <a
                    href={`/history/${pin._id}`} // Adjust this URL to your actual history route
                    className="text-blue-500 hover:underline"
                  >
                    View History
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Map Section */}
      <div className="mt-6">
        <Map mapState={mapState} apiKey={apiKey} pins={filteredPins} />
      </div>
    </div>
  );
}
