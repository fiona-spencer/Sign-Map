import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi'; // Import the "three vertical dots" icon
import { Dropdown } from 'flowbite-react'; // Import Flowbite's Dropdown component

export default function PinData() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/pin/getPins');
        if (!response.ok) throw new Error('Failed to fetch pins');
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setPins(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Placeholder function for actions like Edit, Delete, and Send Email
  const handleAction = (action, pinId) => {
    switch (action) {
      case 'edit':
        console.log(`Edit pin with ID: ${pinId}`);
        break;
      case 'delete':
        console.log(`Delete pin with ID: ${pinId}`);
        break;
      case 'email':
        console.log(`Send email for pin with ID: ${pinId}`);
        break;
      default:
        break;
    }
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

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center mb-2">Pins Database</h1>

      <div className="h-96 overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse text-xs bg-white">
          <thead className="bg-gray-200 dark:bg-slate-700">
            <tr className=''>
              <th className="px-2 py-1 border-b text-center">Created By</th>
              <th className="px-2 py-1 border-b text-left">Status</th>
              <th className="px-2 py-1 border-b text-left">Location</th>
              <th className="px-2 py-1 border-b text-left">Contact Name</th>
              <th className="px-2 py-1 border-b text-left">Contact Email</th>
              <th className="px-2 py-1 border-b text-left">Contact Phone</th>
              <th className="px-2 py-1 border-b text-left">Assigned</th>
              <th className="px-2 py-1 border-b text-left">File Name</th>
              <th className="px-2 py-1 border-b text-left">Created At</th>
              <th className="px-2 py-1 border-b text-center">Actions</th> {/* Actions column */}
            </tr>
          </thead>
          <tbody>
            {pins.length > 0 ? (
              pins.map((pin) => (
                <tr key={pin._id} className="hover:bg-gray-100 dark:hover:bg-blue-700 dark:bg-blue-950">
                  <td className="px-2 py-1 border-b">{pin.createdBy.username}</td>
                  <td className={`px-2 py-1 border text-xs ${getStatusClass(pin.location.status)}`}>
                  {pin.location.status}
                </td>
                  <td className="px-2 py-1 border-b">{pin.location.address}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.contactName}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.contactEmail}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.contactPhoneNumber}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.assigned}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.fileName}</td>
                  <td className="px-2 py-1 border-b">
                    {new Date(pin.createdAt).toLocaleString()}
                  </td>
                  {/* Action Column */}
                  <td className="px-0 py-1 border-b text-center justify-items-center">
                    <Dropdown label={<HiDotsVertical className="text-gray-600 dark:text-white cursor-pointer" size={20}/>} color='dark' arrowIcon={false} inline className=''>
                      <Dropdown.Item onClick={() => handleAction('edit', user._id)}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('delete', user._id)}>Delete</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('email', user._id)}>Send Email</Dropdown.Item>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="px-2 py-1 border-b text-center">
                  No pins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
