import React, { useEffect, useState } from 'react';
import { HiDotsVertical, HiMail } from 'react-icons/hi';
import { Dropdown, Button, Modal, ModalBody, ModalHeader, Alert } from 'flowbite-react';

export default function PinData() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [editedPin, setEditedPin] = useState({ status: 'pending' });
  const [showStatusError, setShowStatusError] = useState(false); // For pin status error handling

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/pin/getPins');
        if (!response.ok) throw new Error('Failed to fetch pins');
        const data = await response.json();

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

  // Handle Action (Edit/Delete/Send Email)
  const handleAction = (action, pin) => {
    switch (action) {
      case 'edit':
        setEditedPin({ status: pin.location.status }); // Initialize status for editing
        setSelectedPin(pin);
        setShowEditModal(true);
        break;
      case 'delete':
        setSelectedPin(pin);
        setShowDeleteModal(true);
        break;
      case 'email':
        console.log(`Send email for pin with ID: ${pin._id}`);
        break;
      default:
        break;
    }
  };

  // Handle Save Pin Status Update
  const handleSaveEdit = async () => {
    if (editedPin.status === 'deleted') {
      setShowStatusError(true); // Show error if trying to delete status
      return;
    }

    try {
      const response = await fetch(`/api/pin/updatePin/${selectedPin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editedPin.status }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error('Failed to update pin');
      }

      const updatedPin = await response.json();
      setPins((prev) =>
        prev.map((pin) =>
          pin._id === selectedPin._id ? { ...pin, location: { ...pin.location, status: editedPin.status } } : pin
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating pin:', error);
    }
  };

  // Handle Delete Pin
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/pin/deletePin/${selectedPin._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pin');
      }

      setPins(pins.filter((pin) => pin._id !== selectedPin._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting pin:', error);
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
            <tr>
              <th className="px-2 py-1 border-b text-center">Created By</th>
              <th className="px-2 py-1 border-b text-left">Status</th>
              <th className="px-2 py-1 border-b text-left">Location</th>
              <th className="px-2 py-1 border-b text-left">Contact Name</th>
              <th className="px-2 py-1 border-b text-left">Contact Email</th>
              <th className="px-2 py-1 border-b text-left">Contact Phone</th>
              <th className="px-2 py-1 border-b text-left">Assigned</th>
              <th className="px-2 py-1 border-b text-left">File Name</th>
              <th className="px-2 py-1 border-b text-left">Created At</th>
              <th className="px-2 py-1 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pins.length > 0 ? (
              pins.map((pin) => (
                <tr key={pin._id} className="hover:bg-gray-100 dark:hover:bg-blue-700 dark:bg-blue-950">
                  <td className="px-2 py-1 border-b">{pin.createdBy?.username}</td>
                  <td className={`px-2 py-1 border text-xs ${getStatusClass(pin.location.status)}`}>
                    {pin.location.status}
                  </td>
                  <td className="px-2 py-1 border-b">{pin.location.address}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.contactName}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.contactEmail}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.contactPhoneNumber}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.assigned}</td>
                  <td className="px-2 py-1 border-b">{pin.location.info.fileName}</td>
                  <td className="px-2 py-1 border-b">{new Date(pin.createdAt).toLocaleString()}</td>
                  <td className="px-0 py-1 border-b text-center">
                    <Dropdown label={<HiDotsVertical className="text-gray-600 dark:text-white cursor-pointer" size={20}/>} color='dark' arrowIcon={false} inline>
                      <Dropdown.Item onClick={() => handleAction('edit', pin)} className='font-medium'>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('email', pin)} className='text-[#296aa3] font-bold'>Send <HiMail className="ml-3" size={20}/></Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAction('delete', pin)} className='text-red-600 font-bold'>Delete</Dropdown.Item>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-2 py-1 border-b text-center">No pins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Pin Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalHeader>Edit Pin Status</ModalHeader>
        <ModalBody>
          <div>
            <label htmlFor="status" className="block mb-2">Status</label>
            <select
              id="status"
              className="block w-full p-2 mb-4 border rounded"
              value={editedPin.status}
              onChange={(e) => setEditedPin({ status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* Show error for invalid status change */}
          {showStatusError && (
            <Alert color="failure" icon={HiDotsVertical}>
              Cannot set pin status to 'deleted'.
            </Alert>
          )}

          <div className="flex justify-between">
            <Button onClick={handleSaveEdit}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>Cancel</Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Delete Pin Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalHeader>Are you sure you want to delete this pin?</ModalHeader>
        <ModalBody>
          <div className="flex justify-between">
            <Button color="failure" onClick={handleDelete}>Yes, Delete</Button>
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>No, Cancel</Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
