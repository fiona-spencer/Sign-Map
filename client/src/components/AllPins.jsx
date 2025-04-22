import { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';

export default function AllPins() {
  const [pins, setPins] = useState([]);  // State to store fetched pins
  const [loading, setLoading] = useState(true);  // Loading state for fetch
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/pin/getPins'); // API call to backend
        if (response.ok) {
          const data = await response.json();
          setPins(data);
        } else {
          throw new Error('Failed to fetch pins');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();  // Call to fetch pins when component mounts
  }, []); // Empty dependency array ensures this runs only once after initial render

  // Function to convert HTML to plain text
  const getPlainTextFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Show loading state
  if (loading) {
    return <div className="text-center mt-2 text-gray-700">Loading pins...</div>;
  }

  // Show error state
  if (error) {
    return <div className="text-center mt-2 text-red-500 dark:text-red-400">{error}</div>;
  }

  // Show message if no pins are available
  if (!pins || pins.length === 0) {
    return <div className="text-center mt-2 text-red-500 dark:text-red-400">No pins available.</div>;
  }

  return (
    <div className="flex flex-col justify-start max-w-screen-lg mx-auto">
      {pins.map((pin) => {
        // Convert description HTML to plain text
        const plainTextDescription = getPlainTextFromHTML(pin.location.info.description || "");
        
        return (
          <Card 
            key={pin._id} 
            className="w-[78%] mx-auto my-1 shadow-sm hover:border-[#419d71c2] hover:border-4 dark:hover:bg-gray-700 transition-all duration-100"
          >
            {/* Title and Status */}
            <div className="flex justify-between items-start mb-1">
              <div>
                <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                  {pin.location.info.title || "No Title"}
                </h5>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-300">
                  Status: {pin.location.status || "Unknown"}
                </p>
              </div>

              {/* User Info - Positioned at the top right */}
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {pin.createdBy?.username || "N/A"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {pin.createdBy?.userType || "N/A"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-1 border-t border-gray-300 bg-white dark:bg-gray-800 dark:text-white">
              <div>
                <label className="block text-xs font-medium mb-1">Description:</label>
                <textarea
                  readOnly
                  value={plainTextDescription || "No description available"}
                  className="w-full h-12 p-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded resize-none "
                />
              </div>

              {/* Location Address */}
              <p className="text-xs"><strong>Location:</strong> {pin.location.address || "No address available"}</p>

              {/* Date of Incident */}
              <p className="text-xs"><strong>Date Created:</strong> {new Date(pin.createdAt).toLocaleDateString()}</p>

              {/* Phone Number */}
              {pin.phoneNumber && (
                <p className="text-xs"><strong>Phone Number:</strong> {pin.phoneNumber}</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
