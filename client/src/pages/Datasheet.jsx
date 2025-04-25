import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Modal } from 'flowbite-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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
  const [filterContactName, setFilterContactName] = useState('');
  const [filterContactEmail, setFilterContactEmail] = useState('');
  const [filterContactPhone, setFilterContactPhone] = useState('');
  const [filteredPins, setFilteredPins] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [showIntroModal, setShowIntroModal] = useState(true); // Modal visibility

  const statusOptions = ['pending', 'accepted', 'in-progress', 'resolved', 'deleted'];

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/pin/getPins');
        if (!response.ok) throw new Error('Failed to fetch pins');
        const data = await response.json();
        setPins(data);
        setFilteredPins(data);

        // Extract unique cities and statuses from the data
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
      setLoading(true);  // Start loading when filtering

      const filtered = pins.filter((pin) => {
        const matchesStatus = filterStatus ? pin.location.status === filterStatus : true;
        const matchesCity = filterCity ? pin.location.address.toLowerCase().includes(filterCity.toLowerCase()) : true;
        const matchesProvince = filterProvince ? pin.location.address.toLowerCase().includes(filterProvince.toLowerCase()) : true;
        const matchesAddress = filterStreetName ? pin.location.address.toLowerCase().includes(filterStreetName.toLowerCase()) : true;
        const matchesUsername = filterUsername ? pin.createdBy.username.toLowerCase().includes(filterUsername.toLowerCase()) : true;
        const matchesDate = filterDate ? pin.createdAt.includes(filterDate) : true;
        const matchesContactName = filterContactName ? pin.location.info.contactName.toLowerCase().includes(filterContactName.toLowerCase()) : true;
        const matchesContactEmail = filterContactEmail ? pin.location.info.contactEmail.toLowerCase().includes(filterContactEmail.toLowerCase()) : true;
        const matchesContactPhone = filterContactPhone ? pin.location.info.contactPhoneNumber.includes(filterContactPhone) : true;

        return (
          matchesStatus &&
          matchesCity &&
          matchesProvince &&
          matchesAddress &&
          matchesUsername &&
          matchesDate &&
          matchesContactName &&
          matchesContactEmail &&
          matchesContactPhone
        );
      });

      setFilteredPins(filtered);
      setLoading(false); // Stop loading after filtering
    };

    applyFilter();
  }, [filterStatus, filterCity, filterProvince, filterUsername, filterStreetName, filterDate, filterContactName, filterContactEmail, filterContactPhone, pins]);

  const handleResetFilters = () => {
    setFilterStatus('');
    setFilterCity('');
    setFilterProvince('');
    setFilterUsername('');
    setFilterStreetName('');
    setFilterDate('');
    setFilterContactName('');
    setFilterContactEmail('');
    setFilterContactPhone('');
  };

  const handleShowAllPins = () => {
    setFilteredPins(pins);
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

  const getImage = (pin) => {
    return pin.location.info.image || defaultPinImage;
  };

  if (loading) return (
<div className="flex justify-center items-center h-screen">
      <CircularProgressbar
        value={0}
        text="Loading..."
        strokeWidth={5}
        styles={{
          root: {
            width: '100px', // Increase the size for better visibility
            height: '100px', // Increase the size for better visibility
            position: 'absolute', // Absolute positioning so it stays in the center
          },
          path: {
            stroke: `rgba(42, 150, 50, 1)`, // Set stroke opacity to 1 (fully visible)
          },
          text: {
            fill: 'black', // Color for the text
            fontSize: '16px', // Font size of the "Loading..." text
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
  
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full overflow-x-auto p-6 bg-[#267b6684] dark:bg-gray-800">
      {/* Modal for Introduction */}
      {/* <Modal show={showIntroModal} onClose={() => setShowIntroModal(false)} size="md" popup>
        <Modal.Body>
          <div className="text-center">
            <h3 className="m-5 text-lg font-semibold text-gray-900 dark:text-white">
              View all reported pins on the map?
            </h3>
            <div className="flex justify-center mt-6">
              <Button
                color="success"
                onClick={() => {
                  handleShowAllPins();
                  setShowIntroModal(false);
                }}
              >
                Show All Pins
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* Map Section */}
      <div className="mb-6">
        <Map mapState={mapState} apiKey={apiKey} pins={filteredPins} />
      </div>

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded">
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <input type="text" placeholder="City" value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="p-2 border rounded" />
          <input type="text" placeholder="Province" value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)} className="p-2 border rounded" />
          <input type="text" placeholder="Street Name" value={filterStreetName} onChange={(e) => setFilterStreetName(e.target.value)} className="p-2 border rounded" />
          <input type="text" placeholder="Username" value={filterUsername} onChange={(e) => setFilterUsername(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="p-2 border rounded" />

          {/* New Filters */}
          <input type="text" placeholder="Contact Name" value={filterContactName} onChange={(e) => setFilterContactName(e.target.value)} className="p-2 border rounded" />
          <input type="email" placeholder="Contact Email" value={filterContactEmail} onChange={(e) => setFilterContactEmail(e.target.value)} className="p-2 border rounded" />
          <input type="text" placeholder="Contact Phone Number" value={filterContactPhone} onChange={(e) => setFilterContactPhone(e.target.value)} className="p-2 border rounded" />

          <Button onClick={handleResetFilters} className="w-full md:w-auto text-xs py-2 px-4 bg-red-500 text-white hover:bg-red-600">
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 max-h-96 overflow-y-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Created By</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Created At</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Populus ID</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Contact Name</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Contact Email</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Contact Phone</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Address</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">Status</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">File Name</th>
              <th className="px-2 py-1 border text-xs dark:text-gray-300">History</th>
            </tr>
          </thead>
          <tbody>
            {filteredPins.map((pin, index) => (
              <tr key={pin._id || index} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                <td className="px-2 py-1 border text-xs bg-green-300 dark:bg-[#a72929]">{pin.createdBy?.username || 'N/A'}</td>
                <td className="px-2 py-1 border text-xs bg-green-200 dark:bg-red-400">{formatDate(pin.createdAt)}</td>
                <td className="px-2 py-1 border text-xs">{pin.location.info.populusId || 'N/A'}</td>
                <td className="px-2 py-1 border text-xs">{pin.location.info.contactName || 'N/A'}</td>
                <td className="px-2 py-1 border text-xs">{pin.location.info.contactEmail || 'N/A'}</td>
                <td className="px-2 py-1 border text-xs">{pin.location.info.contactPhoneNumber || 'N/A'}</td>
                <td className="px-2 py-1 border text-xs overflow-hidden whitespace-nowrap w-8">{pin.location.address}</td>
                <td className={`px-2 py-1 border text-xs ${getStatusClass(pin.location.status)}`}>
                  {pin.location.status}
                </td>
                <td className="px-2 py-1 border text-xs">{pin.location.info.fileName}</td>
                <td className="px-2 py-1 border text-xs">
                  <a href={`/history/${pin._id}`} className="text-blue-500 hover:underline">View History</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
