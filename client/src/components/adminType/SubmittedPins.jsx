import React, { useState, useEffect } from 'react';
import { HiCheckCircle, HiXCircle, HiUserCircle, HiUpload, HiOutlineRefresh, HiTrash, HiChevronLeft } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { TabItem, Tabs, Alert, Button } from 'flowbite-react';
import { HiClipboardList } from 'react-icons/hi';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import pLimit from 'p-limit';
import Settings from '../../pages/Settings'

const SubmittedPins = () => {
  const [pins, setPins] = useState([]);
  const [acceptedPins, setAcceptedPins] = useState([]);
  const [inprogressPins, setInprogressPins] = useState([]);
  const [resolvedPins, SetResolvedPins] = useState([]);
  const [deletedPins, setDeletedPins] = useState([]);
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
      setInprogressPins(data.filter(pin => pin.location.status === 'in-progress'));
      SetResolvedPins(data.filter(pin => pin.location.status === 'resolved'));
      setDeletedPins(data.filter(pin => pin.location.status === 'deleted'));
    } catch (error) {
      setAlert('Error fetching pins: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-black dark:bg-yellow-400 dark:text-white';
      case 'accepted': return 'bg-blue-400 text-white dark:bg-blue-700';
      case 'in-progress': return 'bg-orange-400 text-white dark:bg-orange-500';
      case 'resolved': return 'bg-green-400 text-white dark:bg-green-700';
      case 'deleted': return 'bg-red-400 text-white dark:bg-red-600';
      default: return 'bg-gray-500 text-white dark:bg-gray-700';
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
  const groupedInprogressPins = groupByFileName(inprogressPins);
  const groupedResolvedPins = groupByFileName(resolvedPins);
  const groupedDeletedPins = groupByFileName(deletedPins);

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
                  className={`border border-gray-200 dark:border-gray-700 p-4 rounded-md transition-transform ${getStatusClass(group.status)}`}
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
  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
>
  <option value="pending">Pending</option>
  <option value="accepted">Accepted</option>
  <option value="in-progress">In Progress</option>
  <option value="resolved">Completed</option>
  <option value="deleted">Deleted</option>
</select>


                      {/* Done Button */}
                      <Button
                        onClick={() => handleBatchUpdate(group.pins, selectedStatus[group.fileName] || 'pending')}
                        color="dark"
                        pill
                        outline
                        disabled={buttonLoading === group.fileName}
                        className={`flex items-center justify-center space-x-2 ${
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
                      </Button>
                    </div>

                    <div className="mt-4">
                      <Button
                        onClick={() => toggleVisibility(group.fileName)}
                        className="underline"
                        color='none'
                      >
                        {visiblePins[group.fileName] ? 'Hide Pins' : 'Show All Pins'}
                      </Button>
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

        <TabItem title="Accepted" icon={MdDashboard}>
          <h3 className="text-xl font-semibold mb-2">Accepted Pins</h3>
          {Object.keys(groupedAcceptedPins).length === 0 ? (
            <p className="text-sm text-gray-500">No requests have been accepted yet.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(groupedAcceptedPins).map((fileName) => {
                const group = groupedAcceptedPins[fileName];
                return (
                  <li key={fileName} 
                  className={`border p-4 rounded-md ${getStatusClass('accepted')}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                        <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBatchUpdate(group, 'pending')}
                      disabled={buttonLoading === fileName}
                      className="bg-yellow-200 mt-4"
                      color='yellow'
                      pill
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
                    </Button>
                    <div className="mt-4">
  <Button
    onClick={() => toggleVisibility(fileName)}
    className="flex underline"
    color="none"
  >
    {visiblePins[fileName] ? 'Hide Pins' : 'Show Pins'}
  </Button>

  {visiblePins[fileName] && (
    <ul className="space-y-2 mt-2 border-t pt-2">
      {group.map((pin) => (
        <li key={pin._id}>
          <p>{`Pin ID: ${pin._id}`}</p>
        </li>
      ))}
    </ul>
  )}
</div>

                  </li>
                );
              })}
            </ul>
          )}
        </TabItem>

        <TabItem title="In Progress" icon={HiOutlineRefresh}>
          <h3 className="text-xl font-semibold mb-2">In progress</h3>
          {Object.keys(groupedInprogressPins).length === 0 ? (
            <p className="text-sm text-gray-500">No requests have been rejected yet.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(groupedInprogressPins).map((fileName) => {
                const group = groupedInprogressPins[fileName];
                return (
                  <li
                  key={fileName}
                  className={`border p-4 rounded-md ${getStatusClass('in-progress')}`}
                  >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                      <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                    </div>
                  </div>
                  <Button
                      onClick={() => handleBatchUpdate(group, 'pending')}
                      disabled={buttonLoading === fileName}
                      className="bg-yellow-200 mt-4"
                      color='yellow'
                      pill
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
                    </Button>
                    <div className="mt-4">
  <Button
    onClick={() => toggleVisibility(fileName)}
    className="flex underline"
    color="none"
  >
    {visiblePins[fileName] ? 'Hide Pins' : 'Show Pins'}
  </Button>

  {visiblePins[fileName] && (
    <ul className="space-y-2 mt-2 border-t pt-2">
      {group.map((pin) => (
        <li key={pin._id}>
          <p>{`Pin ID: ${pin._id}`}</p>
        </li>
      ))}
    </ul>
  )}
</div>

                </li>
                
                );
              })}
            </ul>
          )}
        </TabItem>       
        <TabItem title="Resolved" icon={HiCheckCircle}>
          <h3 className="text-xl font-semibold mb-2">Rejected Pins</h3>
          {Object.keys(groupedResolvedPins).length === 0 ? (
            <p className="text-sm text-gray-500">No requests have been rejected yet.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(groupedResolvedPins).map((fileName) => {
                const group = groupedResolvedPins[fileName];
                return (
                  <li key={fileName}
                  className={`border p-4 rounded-md ${getStatusClass('resolved')}`}                   >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                        <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBatchUpdate(group, 'pending')}
                      disabled={buttonLoading === fileName}
                      className="bg-yellow-200 mt-4"
                      color='yellow'
                      pill
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
                    </Button>
                    <div className="mt-4">
  <Button
    onClick={() => toggleVisibility(fileName)}
    className="flex underline"
    color="none"
  >
    {visiblePins[fileName] ? 'Hide Pins' : 'Show Pins'}
  </Button>

  {visiblePins[fileName] && (
    <ul className="space-y-2 mt-2 border-t pt-2">
      {group.map((pin) => (
        <li key={pin._id}>
          <p>{`Pin ID: ${pin._id}`}</p>
        </li>
      ))}
    </ul>
  )}
</div>

                  </li>
                );
              })}
            </ul>
          )}
        </TabItem>       
        <TabItem title="Deleted" icon={HiTrash}>
          <h3 className="text-xl font-semibold mb-2">Rejected Pins</h3>
          {Object.keys(groupedDeletedPins).length === 0 ? (
            <p className="text-sm text-gray-500">No requests have been rejected yet.</p>
          ) : (
            <ul className="space-y-4">
              {Object.keys(groupedDeletedPins).map((fileName) => {
                const group = groupedDeletedPins[fileName];
                return (
                  <li key={fileName} 
                  className={`border p-4 rounded-md ${getStatusClass('deleted')}`}                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{`File: ${fileName}`}</h4>
                        <p className="text-sm">{`Number of Pins: ${group.length}`}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBatchUpdate(group, 'pending')}
                      disabled={buttonLoading === fileName}
                      className="bg-yellow-200 mt-4"
                      color='yellow'
                      pill
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
                    </Button>
                    <div className="mt-4">
  <Button
    onClick={() => toggleVisibility(fileName)}
    className="flex underline"
    color="none"
  >
    {visiblePins[fileName] ? 'Hide Pins' : 'Show Pins'}
  </Button>

  {visiblePins[fileName] && (
    <ul className="space-y-2 mt-2 border-t pt-2">
      {group.map((pin) => (
        <li key={pin._id}>
          <p>{`Pin ID: ${pin._id}`}</p>
        </li>
      ))}
    </ul>
  )}
</div>

                  </li>
                );
              })}
            </ul>
          )}
        </TabItem>       
      
        </Tabs>
        <Settings/>
    </div>
  );
};

export default SubmittedPins;
