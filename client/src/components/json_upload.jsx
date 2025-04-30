import React, { useState } from "react";
import { Alert } from "flowbite-react"; // Assuming you have flowbite installed
import { HiInformationCircle } from "react-icons/hi"; // Assuming you're using react-icons for icons
import CreatePinsFromFile from './CreatePinsFromFile'; // Adjust the import path for CreatePinsFromFile component
import { useSelector } from "react-redux";

export default function JsonUpload() {
  const [copied, setCopied] = useState(false);
  const [fileTitle, setFileTitle] = useState('');
  const [parsedPins, setParsedPins] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const jsonData = [
    {
      "Populus ID": "2707146",
      "First Name": "Joanna",
      "Last Name": "Kovats",
      "Civic Address": "3rd Fl-41 1st Ave",
      "St Num": "3rd Fl-41",
      "St Name": "1st Ave",
      "City (Civic Address)": "Toronto",
      "Province (Civic Address)": "ON",
      "Postal Code (Civic Address)": "M4M1W7",
      "City (Mailing Address)": "Toronto",
      "Province (Mailing Address)": "ON",
      "Postal Code (Mailing Address)": "M4M1W7",
      "Preferred Phone Number": "416-992-3233",
      "Preferred Email": "joakov_2011@yahoo.ca"
    }
  ]
  ;

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
  
      if (!Array.isArray(data) || !data.every(item =>
        item["First Name"] && item["Last Name"] && item["Civic Address"]
      )) {
        throw new Error('Invalid format. Missing required fields.');
      }
  
      setFileTitle(file.name);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const pins = [];
  
      for (const entry of data) {
        const firstName = entry["First Name"].trim();
        const lastName = entry["Last Name"].trim();
        const fullName = `${firstName} ${lastName}`.trim();
  
        // Extract and normalize address parts
        let streetNumber = entry["St Num"]?.trim() || "";
        const streetName = entry["St Name"]?.trim() || "";
        const city = entry["City (Civic Address)"]?.trim() || "";
        const province = entry["Province (Civic Address)"]?.trim() || "";
        const postalCode = entry["Postal Code (Civic Address)"]?.trim() || "";
        let aptNum = null;
  
        // Detect and extract apartment/unit prefix from streetNumber
        const hyphenOrSpaceMatch = streetNumber.match(/^([A-Za-z-]+-\d+)(?:[\s-])?(\d+)$/);
        if (hyphenOrSpaceMatch) {
          aptNum = hyphenOrSpaceMatch[1];        // e.g., "B-25"
          streetNumber = hyphenOrSpaceMatch[2];  // e.g., "9"
        }
  
        // Format full civic address
        let address = `${streetNumber} ${streetName}, ${city}, ${province} ${postalCode}, Canada`;
        if (aptNum) {
          address = `${aptNum} (apt) ${streetNumber} (st.) ${streetName}, ${city}, ${province} ${postalCode}, Canada`;
        }
        address = address.replace(/\s*,\s*/g, ", ").trim();
  
        // Process phone and email
        const phoneRaw = entry["Preferred Phone Number"]?.replace(/\D/g, '');
        const email = emailRegex.test(entry["Preferred Email"] || '') ? entry["Preferred Email"] : 'email error';
        const formattedPhone = phoneRaw?.length === 10
          ? `${phoneRaw.slice(0, 3)}-${phoneRaw.slice(3, 6)}-${phoneRaw.slice(6)}`
          : 'phone# error';
  
        // Build pin
        pins.push({
          populusId: entry["Populus ID"], // Adding Populus ID here
          createdBy: currentUser?.username || 'Unknown',
          location: {
            address,
            lat: 0,
            lng: 0,
            info: {
              title: fullName,
              contactName: fullName,
              contactEmail: email,
              contactPhoneNumber: formattedPhone,
              description: 'N/A',
              icon: 'default',
              image: 'N/A',
              fileName: file.name,
            },
            status: 'pending',
          },
          phoneNumber: formattedPhone,
          email,
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
        <th>Populus ID</th>
        <th>Contact Name</th>
        <th>Address</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      {parsedPins.map((pin, idx) => (
        <tr key={idx} className="border-t dark:border-gray-600">
          <td>{pin.populusId}</td> {/* Display Populus ID here */}
          <td>{pin.location.info.contactName}</td>
          <td>{pin.location.address}</td>
          <td className={pin.email === 'email error' ? 'text-red-500' : ''}>{pin.email}</td>
          <td className={pin.phoneNumber === 'phone# error' ? 'text-red-500' : ''}>{pin.phoneNumber}</td>
          <td>{pin.createdAt}</td>
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
