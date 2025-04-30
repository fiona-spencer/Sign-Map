import React, { useState } from "react";
import { Alert } from "flowbite-react"; // Assuming you have flowbite installed
import { HiInformationCircle } from "react-icons/hi"; // Assuming you're using react-icons for icons
import CreatePinsFromFile from './CreatePinsFromFile'; // Adjust the import path for CreatePinsFromFile component

export default function JsonUpload() {
  const [copied, setCopied] = useState(false);
  const [fileTitle, setFileTitle] = useState('');
  const [parsedPins, setParsedPins] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const jsonData = [
    {
      contactName: "John Smith",
      address: "350 Victoria St, Toronto, ON M5B 2K3, Canada",
      contactEmail: "johnsmith@example.com",
      contactPhoneNumber: "+1-647-555-9911",
      image: "https://via.placeholder.com/100x100.png?text=Emily",
    },
    {
      contactName: "Sally Joe",
      address: "100 King St W, Toronto, ON M5X 1A9, Canada",
      contactEmail: "sally.joek@example.com",
      contactPhoneNumber: "416-555-8822",
    }
  ];

  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data) || !data.every(item => item.contactName && item.address)) {
        throw new Error('Invalid format. Each entry must include contactName and address.');
      }

      setFileTitle(file.name);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const pins = [];

      for (const entry of data) {
        const validEmail = entry.contactEmail && emailRegex.test(entry.contactEmail) ? entry.contactEmail : null;
        const latLngData = await fetchLatLng(entry.address);

        let rawDigits = entry.contactPhoneNumber?.replace(/\D/g, '');
        if (rawDigits?.startsWith('1')) rawDigits = rawDigits.slice(1);

        const formattedPhone = rawDigits?.length === 10
          ? `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 6)}-${rawDigits.slice(6)}`
          : null;

        pins.push({
          createdBy: currentUser?.username || 'Unknown',
          location: {
            address: entry.address,
            lat: latLngData.lat || 0,
            lng: latLngData.lng || 0,
            info: {
              title: entry.contactName,
              contactName: entry.contactName,
              contactEmail: validEmail || 'email error',
              contactPhoneNumber: formattedPhone || 'phone# error',
              description: 'N/A',
              icon: 'default',
              image: entry.image?.trim() || 'N/A',
            },
            status: 'pending',
          },
          phoneNumber: formattedPhone || 'phone# error',
          email: validEmail || 'email error',
          createdAt: new Date().toLocaleDateString('en-US'),
          status: 'pending',
        });
      }

      setParsedPins(pins);
      const hasError = pins.some(pin => pin.email === 'email error' || pin.phoneNumber === 'phone# error');
      setIsValid(!hasError);
      setStatusMessage(hasError ? 'Fix errors before submitting.' : 'Ready to submit.');
      setError(null);
    } catch (err) {
      setError(err.message);
      setParsedPins([]);
      setIsValid(false);
      setStatusMessage('Invalid file format or data.');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">

      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Example JSON</h2>
      {/* Copy JSON Box */}
      <div className="relative">

        <label htmlFor="json-copy-text" className="sr-only">JSON Data</label>
        <textarea
          id="json-copy-text"
          value={jsonString}
          readOnly
          disabled
          rows={10}
          className="col-span-6 bg-gray-50 border border-gray-300 text-sm font-mono rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-3 inline-flex items-center justify-center bg-white border-gray-200 border h-8"
        >
          {!copied ? (
            <span className="inline-flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 18 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
              </svg>
              <span className="text-xs font-semibold">Copy</span>
            </span>
          ) : (
            <span className="inline-flex items-center">
              <svg
                className="w-3 h-3 text-blue-700 dark:text-blue-500 mr-1"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 16 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-500">Copied</span>
            </span>
          )}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Upload JSON File</h2>
      <input type="file" accept=".json" onChange={handleFileUpload} className="mb-4" />

      {statusMessage && (
        <Alert color={isValid ? "success" : "failure"} className="mb-4" icon={HiInformationCircle}>
          <span>{statusMessage}</span>
        </Alert>
      )}

      {parsedPins.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>File Name:</strong> {fileTitle}</p>
            <p><strong>Created By:</strong> {parsedPins[0]?.createdBy || 'Unknown'}</p>
            <p><strong>Created At:</strong> {new Date().toLocaleDateString('en-US')}</p>
            <p><strong>Status:</strong> {parsedPins[0]?.status || 'pending'}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-collapse text-xs text-center">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th>Contact Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Created At</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {parsedPins.map((pin, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-600">
                    <td>{pin.location.info.contactName}</td>
                    <td>{pin.location.address}</td>
                    <td className={pin.email === 'email error' ? 'text-red-500' : ''}>{pin.email}</td>
                    <td className={pin.phoneNumber === 'phone# error' ? 'text-red-500' : ''}>{pin.phoneNumber}</td>
                    <td>{pin.createdAt}</td>
                    <td>
                      {pin.location.info.image === 'N/A' ? 'N/A' : (
                        <img src={pin.location.info.image} alt="Pin" className="w-12 h-12 object-cover mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}



      {parsedPins.length > 0 && isValid && !error && (
        <CreatePinsFromFile
          parsedPins={parsedPins}
          fileTitle={fileTitle}
          currentUser={currentUser}
          onSuccess={() => navigate(`/successfullyCreated`)}
          onError={(msg) => setPublishError(msg)}
        />
      )}

      

      {publishError && <p className="text-red-500 mt-2">{publishError}</p>}

      
    </div>
  );
}
