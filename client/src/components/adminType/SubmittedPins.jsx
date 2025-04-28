import React, { useState, useEffect } from 'react';
import { HiCheckCircle, HiXCircle, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { TabItem, Tabs, Alert } from 'flowbite-react';
import { HiClipboardList } from 'react-icons/hi';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import pLimit from 'p-limit';

const SubmittedPins = () => {
  const [pins, setPins] = useState([]);
  const [acceptedPins, setAcceptedPins] = useState([]);
  const [rejectedPins, setRejectedPins] = useState([]);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(true);
  const [visiblePins, setVisiblePins] = useState({});
  const [buttonLoading, setButtonLoading] = useState(null);
  const [progressByFile, setProgressByFile] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({}); // To track selected status for each group
  
  const limit = pLimit(20); // Limit the concurrency to 5 requests

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
      const key = `${pin.location.info.fileName}-${pin.location.status}`;
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

  const handleBatchUpdate = async (group, status) => {
    const fileName = group[0].location.info.fileName;
    setButtonLoading(fileName);
    setProgressByFile((prev) => ({ ...prev, [fileName]: 0 }));
  
    const total = group.length;
    console.log(`Starting batch update for ${status} with total pins: ${total}`);
  
    const limitPromises = group.map((pin, index) =>
      limit(async () => {
        try {
          const response = await fetch(`/api/pin/updatePin/${pin._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
          if (!response.ok) throw new Error('Update failed');
  
          const progress = Math.round(((index + 1) / total) * 100);
          console.log(`Updating pin ${pin._id} - Progress: ${progress}%`);
          
          setProgressByFile((prev) => ({
            ...prev,
            [fileName]: progress,
          }));
        } catch (error) {
          console.error('Error updating pin:', error);
        }
      })
    );
  
    try {
      await Promise.all(limitPromises);
      fetchPins(); // Fetch updated pins
      setAlert(`${status} pins successfully`);
      console.log(`Batch update completed for ${status}`);
    } catch (error) {
      setAlert('Error: ' + error.message);
      console.error('Error in batch update:', error);
    } finally {
      setButtonLoading(null);
      setProgressByFile((prev) => ({ ...prev, [fileName]: 0 }));
      console.log(`Resetting progress for ${fileName}`);
    }
  };
  
  const toggleVisibility = (fileName) => {
    setVisiblePins((prevState) => ({
      ...prevState,
      [fileName]: !prevState[fileName],
    }));
  };

  const groupByFileName = (pinsArray) => {
    return pinsArray.reduce((acc, pin) => {
      const { fileName } = pin.location.info;
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
      <div className="mb-6">
        {alert && (
          <Alert color="success" onDismiss={() => setAlert('')}>
            {alert}
          </Alert>
        )}
      </div>

      <Tabs aria-label="Request Tabs" variant="default">
        <TabItem active title="Incoming Requests" icon={HiUserCircle}>
          <h3 className="text-xl font-semibold mb-2">Incoming Requests</h3>
          {Object.keys(pins).length === 0 ? (
            <p className="text-sm text-gray-500">No new requests.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(pins).map((groupKey) => {
                const group = pins[groupKey];
                // Only show groups where the status is 'pending'
                if (group.status !== 'pending') return null;

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
                    style={{ transition: 'transform 0.5s ease-in-out' }}
                  >
                    <h4 className="text-lg font-semibold">
                      {group.fileName} - Status: {group.status}
                    </h4>
                    <p className="text-sm">{`Number of Pins: ${group.pins.length}`}</p>
                    
                    {/* Dropdown for selecting status */}
                    <div className="mt-4 flex space-x-4">
                      <select
                        value={selectedStatus[group.fileName] || 'pending'}
                        onChange={(e) =>
                          setSelectedStatus((prevState) => ({
                            ...prevState,
                            [group.fileName]: e.target.value,
                          }))
                        }
                        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="resolved">Rejected</option>
                      </select>

                      {/* Done Button */}
                      <button
                        onClick={() => handleBatchUpdate(group.pins, selectedStatus[group.fileName] || 'pending')}
                        disabled={buttonLoading === group.fileName}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 ${
                          buttonLoading === group.fileName
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'hover:bg-blue-600 dark:hover:bg-blue-400'
                        }`}
                      >
                        {buttonLoading === group.fileName ? (
                          <div style={{ width: 24, height: 24 }}>
                            <CircularProgressbar
                              value={progressByFile[group.fileName] || 50}
                              text={`${progressByFile[group.fileName] || 0}%`}
                              styles={{
                                path: { stroke: '#fff' },
                                text: { fill: '#fff', fontSize: '16px' },
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            Done
                          </>
                        )}
                      </button>
                    </div>

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
                  <li key={fileName} className="border p-4 rounded-md bg-green-100 dark:bg-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                        <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBatchUpdate(group, 'pending')}
                      disabled={buttonLoading === fileName}
                      className={`mt-2 px-4 py-2 rounded-md text-white ${
                        buttonLoading === fileName
                          ? 'bg-yellow-300 cursor-not-allowed'
                          : 'bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400'
                      }`}
                    >
                      {buttonLoading === fileName ? (
                        <div className="w-6 h-6">
                          <CircularProgressbar
                            value={progressByFile[fileName] || 0}
                            text={`${progressByFile[fileName] || 0}%`}
                            styles={{
                              path: { stroke: '#fff' },
                              text: { fill: '#fff', fontSize: '28px' },
                            }}
                          />
                        </div>
                      ) : (
                        'Move to Pending'
                      )}
                    </button>
                    <ul className="space-y-2 mt-4">
                      {group.map((pin) => (
                        <li key={pin._id}>
                          <p>{`Pin ID: ${pin._id}`}</p>
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
                  <li key={fileName} className="border p-4 rounded-md bg-red-100 dark:bg-red-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                        <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBatchUpdate(group, 'pending')}
                      disabled={buttonLoading === fileName}
                      className={`mt-2 px-4 py-2 rounded-md text-white ${
                        buttonLoading === fileName
                          ? 'bg-yellow-300 cursor-not-allowed'
                          : 'bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400'
                      }`}
                    >
                      {buttonLoading === fileName ? (
                        <div className="w-6 h-6">
                          <CircularProgressbar
                            value={progressByFile[fileName] || 0}
                            text={`${progressByFile[fileName] || 0}%`}
                            styles={{
                              path: { stroke: '#fff' },
                              text: { fill: '#fff', fontSize: '28px' },
                            }}
                          />
                        </div>
                      ) : (
                        'Move to Pending'
                      )}
                    </button>
                    <ul className="space-y-2 mt-4">
                      {group.map((pin) => (
                        <li key={pin._id}>
                          <p>{`Pin ID: ${pin._id}`}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </TabItem>       </Tabs>
    </div>
  );
};

export default SubmittedPins;
