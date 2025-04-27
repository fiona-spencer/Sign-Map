import React, { useState, useEffect } from 'react';
import { HiCheckCircle, HiXCircle, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { TabItem, Tabs, Alert } from 'flowbite-react';
import { HiClipboardList } from 'react-icons/hi';

const SubmittedPins = () => {
  const [pins, setPins] = useState([]);
  const [acceptedPins, setAcceptedPins] = useState([]);
  const [rejectedPins, setRejectedPins] = useState([]);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(true);
  const [visiblePins, setVisiblePins] = useState({});

  // Fetching Pins from the server
  const fetchPins = async () => {
    try {
      const response = await fetch('/api/pin/getPins');
      if (!response.ok) throw new Error('Failed to fetch pins');
      const data = await response.json();
      const groupedPins = groupPinsByRequest(data);
      setPins(groupedPins);
      setAcceptedPins(data.filter(pin => pin.location.status === 'accepted'));
      setRejectedPins(data.filter(pin => pin.location.status === 'resolved'));
    } catch (error) {
      setAlert('Error fetching pins: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const groupPinsByRequest = (pins) => {
    return pins.reduce((acc, pin) => {
      const key = `${pin.location.info.fileName}-${pin.location.status}`; // Use pin.location.info.fileName
      if (!acc[key]) {
        acc[key] = { pins: [], fileName: pin.location.info.fileName, status: pin.location.status };
      }
      acc[key].pins.push(pin);
      return acc;
    }, {});
  };

  useEffect(() => {
    fetchPins();
  }, []);

  // Handle updating pin status back to "pending"
  const handleMoveToPending = async (pin) => {
    try {
      const updatedPin = await fetch(`/api/pin/updatePin/${pin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'pending',
        }),
      }).then((response) => response.json());

      if (!updatedPin) {
        throw new Error('Failed to update pin status');
      }

      // Update the pins state after the status is changed to "pending"
      setPins((prevPins) => {
        return prevPins.map((group) => {
          group.pins = group.pins.map((p) =>
            p._id === pin._id ? { ...p, location: { ...p.location, status: 'pending' } } : p
          );
          return group;
        });
      });

      setAcceptedPins((prev) => prev.filter((p) => p._id !== pin._id)); // Remove from accepted
      setRejectedPins((prev) => prev.filter((p) => p._id !== pin._id)); // Remove from rejected

      setAlert('Pin has been moved back to pending.');
    } catch (error) {
      setAlert('Error moving pin to pending: ' + error.message);
    }
  };

  // Toggle visibility for a particular fileName
  const toggleVisibility = (fileName) => {
    setVisiblePins((prevState) => ({
      ...prevState,
      [fileName]: !prevState[fileName], // Toggle the visibility
    }));
  };

  // Group the accepted and rejected pins by fileName
  const groupByFileName = (pinsArray) => {
    return pinsArray.reduce((acc, pin) => {
      const { fileName } = pin.location.info; // Access fileName from pin.location.info
      if (!acc[fileName]) {
        acc[fileName] = [];
      }
      acc[fileName].push(pin);
      return acc;
    }, {});
  };

  const groupedAcceptedPins = groupByFileName(acceptedPins);
  const groupedRejectedPins = groupByFileName(rejectedPins);

  return (
    <div className="min-h-screen p-8 bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Alert Section */}
      <div className="mb-6">
        {alert && (
          <Alert color="success" onDismiss={() => setAlert('')}>
            {alert}
          </Alert>
        )}
      </div>

      {/* Tabs */}
      <Tabs aria-label="Request Tabs" variant="default">
        <TabItem active title="Incoming Requests" icon={HiUserCircle}>
          <h3 className="text-xl font-semibold mb-2">Incoming Requests</h3>
          {Object.keys(pins).length === 0 ? (
            <p className="text-sm text-gray-500">No new requests.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(pins).map((groupKey) => {
                const group = pins[groupKey];
                if (!group || !group.pins) return null;

                return (
                  <li
                    key={groupKey}
                    className={`border p-4 rounded-md transition-transform ${
                      group.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-700'
                        : group.status === 'accepted'
                        ? 'bg-green-100 dark:bg-green-700'
                        : 'bg-red-100 dark:bg-red-700'
                    }`}
                    style={{
                      transition: 'transform 0.5s ease-in-out',
                    }}
                  >
                    <h4 className="text-lg font-semibold">
                      {group.fileName} - Status: {group.status}
                    </h4>
                    <p className="text-sm">{`Number of Pins: ${group.pins.length}`}</p>
                    {group.status === 'pending' && (
                      <div className="mt-4 flex space-x-4">
                        <button
                          onClick={() => handleAcceptGroup(groupKey)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-400"
                        >
                          Accept <HiCheckCircle className="inline-block ml-2" />
                        </button>
                        <button
                          onClick={() => handleRejectGroup(groupKey)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-red-400"
                        >
                          Reject <HiXCircle className="inline-block ml-2" />
                        </button>
                      </div>
                    )}
                    <div className="mt-4">
                      <button
                        onClick={() => toggleVisibility(group.fileName)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-400"
                      >
                        {visiblePins[group.fileName] ? 'Hide Pins' : 'Show All Pins'}
                      </button>
                    </div>
                    {visiblePins[group.fileName] && (
                      <ul className="space-y-2 mt-4">
                        {group.pins.map((pin) => (
                          <li key={pin._id}>
                            <p>{`Pin ID: ${pin._id}`}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </TabItem>

        <TabItem title="Accepted Pins" icon={MdDashboard}>
          <h3 className="text-xl font-semibold mb-2">Accepted Pins</h3>
          {Object.keys(groupedAcceptedPins).length === 0 ? (
            <p className="text-sm text-gray-500">No requests have been accepted yet.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(groupedAcceptedPins).map((fileName) => {
                const group = groupedAcceptedPins[fileName];
                return (
                  <li
                    key={fileName}
                    className="border p-4 rounded-md bg-green-100 dark:bg-green-700"
                  >
                    <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                    <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                    <ul className="space-y-2 mt-4">
                      {group.map((pin) => (
                        <li key={pin._id}>
                          <p>{`Pin ID: ${pin._id}`}</p>
                          <button
                            onClick={() => handleMoveToPending(pin)}
                            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-400"
                          >
                            Move to Pending
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </TabItem>

        <TabItem title="Rejected Pins" icon={HiClipboardList}>
          <h3 className="text-xl font-semibold mb-2">Rejected Pins</h3>
          {Object.keys(groupedRejectedPins).length === 0 ? (
            <p className="text-sm text-gray-500">No requests have been rejected yet.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(groupedRejectedPins).map((fileName) => {
                const group = groupedRejectedPins[fileName];
                return (
                  <li
                    key={fileName}
                    className="border p-4 rounded-md bg-red-100 dark:bg-red-700"
                  >
                    <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                    <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                    <ul className="space-y-2 mt-4">
                      {group.map((pin) => (
                        <li key={pin._id}>
                          <p>{`Pin ID: ${pin._id}`}</p>
                          <button
                            onClick={() => handleMoveToPending(pin)}
                            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-400"
                          >
                            Move to Pending
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </TabItem>
      </Tabs>
    </div>
  );
};

export default SubmittedPins;
