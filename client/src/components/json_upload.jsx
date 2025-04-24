import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { fetchLatLng } from '../../../api/utils/geocoding';
import CreatePinsFromFile from './CreatePinsFromFile';

export default function JsonUpload() {
  const [parsedPins, setParsedPins] = useState([]);
  const [error, setError] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isValid, setIsValid] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

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
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Upload JSON File</h2>
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
