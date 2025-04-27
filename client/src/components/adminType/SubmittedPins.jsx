import React, { useState, useEffect } from 'react';

const SubmittedPins = () => {
  // Simulating state for incoming requests and history
  const [incomingRequests, setIncomingRequests] = useState([
    { id: 1, title: 'Request #1', description: 'Request description here', accepted: null },
    { id: 2, title: 'Request #2', description: 'Another request description', accepted: null },
    { id: 3, title: 'Request #3', description: 'A different request description', accepted: null },
  ]);

  const [history, setHistory] = useState([]);

  // Handle request acceptance
  const handleAccept = (id) => {
    const updatedRequests = incomingRequests.map((request) =>
      request.id === id ? { ...request, accepted: true } : request
    );
    setIncomingRequests(updatedRequests);

    const acceptedRequest = incomingRequests.find((request) => request.id === id);
    setHistory((prevHistory) => [...prevHistory, acceptedRequest]);
  };

  // Handle request rejection
  const handleReject = (id) => {
    const updatedRequests = incomingRequests.map((request) =>
      request.id === id ? { ...request, accepted: false } : request
    );
    setIncomingRequests(updatedRequests);
  };

  return (
    <div className="min-h-screen p-8 bg-white text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-semibold mb-4">Submitted Pins</h1>

      {/* Inbox Section */}
      <div className="mb-6">
        <h3 className="text-2xl mb-2">Incoming Requests</h3>
        {incomingRequests.length === 0 ? (
          <p>No new requests.</p>
        ) : (
          <ul className="space-y-4">
            {incomingRequests.map((request) => (
              <li
                key={request.id}
                className={`border p-4 rounded-md ${
                  request.accepted === null
                    ? 'bg-yellow-100 dark:bg-yellow-700'
                    : request.accepted
                    ? 'bg-green-100 dark:bg-green-700'
                    : 'bg-red-100 dark:bg-red-700'
                }`}
              >
                <h4 className="text-xl font-semibold">{request.title}</h4>
                <p>{request.description}</p>
                {request.accepted === null ? (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-400"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-red-400"
                    >
                      Reject
                    </button>
                  </div>
                ) : request.accepted ? (
                  <p className="text-green-600">Accepted</p>
                ) : (
                  <p className="text-red-600">Rejected</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* History Section */}
      <div className="mb-6">
        <h3 className="text-2xl mb-2">History of Accepted Requests</h3>
        {history.length === 0 ? (
          <p>No accepted requests yet.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((request) => (
              <li
                key={request.id}
                className="border p-4 rounded-md bg-green-100 dark:bg-green-700"
              >
                <h4 className="text-xl font-semibold">{request.title}</h4>
                <p>{request.description}</p>
                <p className="text-green-600">Accepted</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SubmittedPins;
