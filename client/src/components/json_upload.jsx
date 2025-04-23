import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

export default function JsonUpload() {
  const [parsedPins, setParsedPins] = useState([]);
  const [error, setError] = useState(null);
  const [fileTitle, setFileTitle] = useState("");  // This holds the file name
  const [statusMessage, setStatusMessage] = useState(""); 
  const [isValid, setIsValid] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [publishError, setPublishError] = useState(null);  // To track publishing errors
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data) || !data.every(item => item.contactName && item.address)) {
        throw new Error('Invalid format. Each entry must include at least contactName and address.');
      }

      setFileTitle(file.name);  // Store the uploaded file name
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const pins = [];

      for (const entry of data) {
        const validEmail = entry.contactEmail && emailRegex.test(entry.contactEmail) ? entry.contactEmail : null;

        let latLngData = await fetchLatLng(entry.address); // Wait for geocoding response

        let rawDigits = entry.contactPhoneNumber?.replace(/\D/g, ''); 

        if (rawDigits && rawDigits.startsWith('1')) {
          rawDigits = rawDigits.slice(1); 
        }

        const formattedPhone = rawDigits && rawDigits.length === 10
          ? `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 6)}-${rawDigits.slice(6)}`
          : null;

        const pin = {
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
              image: entry.image && entry.image.trim() !== '' ? entry.image : 'N/A',
            },
            status: 'pending',
          },
          phoneNumber: formattedPhone || 'phone# error',
          email: validEmail || 'email error',
          createdAt: new Date().toLocaleDateString('en-US'),
          status: 'pending',
        };
        
        pins.push(pin);  // Store each pin after processing
      }

      setParsedPins(pins);

      const hasError = pins.some(pin => pin.location.info.contactEmail === 'email error' || pin.location.info.contactPhoneNumber === 'phone# error');
      
      if (hasError) {
        setIsValid(false);
        setStatusMessage('Some information is missing or incorrect, please fix before submitting.');
        setError(null);
      } else {
        setIsValid(true);
        setStatusMessage('Everything looks great, you can submit');
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      setParsedPins([]);
      setIsValid(false);
      setStatusMessage('Invalid file format or data.');
    }
  };

  const fetchLatLng = async (address) => {
    const apiKey = 'AIzaSyA1wOqcLSGKkhNJQYP9wH06snRuvSJvRJY'; // Replace with your own API key
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await res.json();
      if (data.status === 'OK') {
        const lat = data.results[0]?.geometry.location.lat || 0;
        const lng = data.results[0]?.geometry.location.lng || 0;
        return { lat, lng };
      } else {
        console.error('Geocoding failed for address:', address);
        return { lat: 0, lng: 0 }; // Default values if geocoding fails
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return { lat: 0, lng: 0 }; // Default values if there’s an error
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Loop through all the parsed pins and send them one by one.
    try {
      // Create an array to hold the responses for each pin
      const results = [];
  
      for (let pin of parsedPins) {
        const dataToSend = {
          createdBy: {
            userName: currentUser?.username,
            userEmail: currentUser?.email, // or get it from form data
          },
          location: {
            address: pin.location?.address,
            lat: pin.location?.lat,
            lng: pin.location?.lng,
            info: {
              description: 'Description here', // Customize this based on your form or data
              icon: 'default', // Customize based on your form or data
              image: pin.location?.info?.image, // Customize based on your form or data
              populusId: 'PopulusId', // Populate this from your form data
              contactName: pin.location?.info?.contactName, // Use contact name from parsed pin
              contactEmail: pin.location?.info?.contactEmail, // Use contact email from parsed pin
              contactPhoneNumber: pin.location?.info?.contactPhoneNumber, // Use contact phone number
              assigned: 'assigned person', // Populate this field accordingly
              fileName: fileTitle, // Populate this field accordingly
            },
            status: 'pending',
          },
        };
  
        // Make an API call for each pin
        const res = await fetch('/api/pin/createPin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify(dataToSend),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || 'Server error occurred');
        }
  
        results.push(data);  // Collect the successful results
      }
  
      // If all pins are created successfully, navigate to the success page
      setPublishError(null);
      navigate(`/successfullyCreated`);
  
    } catch (error) {
      console.error('Error submitting pins:', error);
      setPublishError(error.message || 'Something went wrong. Please try again.');
    }
  };
  

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Upload JSON File</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {statusMessage && (
        <Alert color={isValid ? "success" : "failure"} className="mb-4" icon={HiInformationCircle}>
          <span>{statusMessage}</span>
        </Alert>
      )}

      {parsedPins.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto border border-collapse text-xs text-center">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Contact Name</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Address</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Contact Email</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Contact Phone</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Created At</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">File Title</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Image</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Created By</th>
                <th className="px-2 py-1 text-gray-700 dark:text-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {parsedPins.map((pin, idx) => (
                <tr key={idx} className="border-t dark:border-gray-600">
                  <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{pin.location.info.contactName}</td>
                  <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{pin.location.address}</td>
                  <td className={`px-2 py-1 ${pin.location.info.contactEmail === 'email error' ? 'text-red-500' : 'text-gray-800 dark:text-gray-100'}`}>
                    {pin.location.info.contactEmail}
                  </td>
                  <td className={`px-2 py-1 ${pin.location.info.contactPhoneNumber === 'phone# error' ? 'text-red-500' : 'text-gray-800 dark:text-gray-100'}`}>
                    {pin.location.info.contactPhoneNumber}
                  </td>
                  <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{pin.createdAt}</td>
                  <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{fileTitle}</td>
                  <td className="px-2 py-1 text-gray-800 dark:text-gray-100">
                    {pin.location.info.image === 'N/A' ? (
                      'N/A'
                    ) : (
                      <img src={pin.location.info.image} alt="Pin" className="w-14 h-14 object-cover mx-auto" />
                    )}
                  </td>
                  <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{pin.createdBy}</td>
                  <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{pin.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {parsedPins.length > 0 && isValid && !error && (
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
