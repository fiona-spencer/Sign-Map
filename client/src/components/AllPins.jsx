import { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';
import { useLocation } from 'react-router-dom';

// Helper for status color styling
const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-200 text-yellow-700';
    case 'accepted': return 'bg-blue-100 text-blue-700';
    case 'in-progress': return 'bg-orange-100 text-orange-700';
    case 'resolved': return 'bg-green-100 text-green-700';
    case 'deleted': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function AllPins() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('searchTerm')?.toLowerCase() || '';

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/pin/getPins');
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

    fetchPins();
  }, []);

  const getPlainTextFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Filter pins based on the search term
  const filteredPins = pins.filter((pin) => {
    const address = pin.location?.address?.toLowerCase() || '';
    const contactName = pin.location?.info?.contactName?.toLowerCase() || '';
    const description = getPlainTextFromHTML(pin.location?.info?.description || '').toLowerCase();

    return (
      address.includes(searchTerm) ||
      contactName.includes(searchTerm) ||
      description.includes(searchTerm)
    );
  });

  if (loading) return <div className="text-center mt-2 text-gray-700">Loading pins...</div>;
  if (error) return <div className="text-center mt-2 text-red-500 dark:text-red-400">{error}</div>;
  if (!filteredPins || filteredPins.length === 0) return <div className="text-center mt-2 text-red-500 dark:text-red-400">No pins found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-screen-xl mx-auto p-8">
      {filteredPins.map((pin) => {
        const description = getPlainTextFromHTML(pin.location?.info?.description || '');
        const status = pin.location?.status || 'Unknown';
        const statusClass = getStatusClass(status);
        const imageUrl = pin.location?.info?.image || '/default-image.png';

        return (
          <Card
            key={pin._id}
            className="w-full shadow-md hover:border-[#419d71c2] hover:border-4 dark:hover:bg-gray-700 transition-all duration-50"
          >
            <div className="flex flex-col space-y-2">
              {/* Title and User Info */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {pin.location?.info?.contactName || 'No Title'}
                </h2>
                <div className="text-xs text-right text-gray-600 dark:text-gray-300 ml-4">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {pin.createdBy?.username || 'N/A'}
                  </p>
                  <p>{pin.createdBy?.userType || 'N/A'}</p>
                </div>
              </div>

              {/* Status */}
              <div className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusClass}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>

              <hr className="border-t border-gray-300 dark:border-gray-600" />

              {/* Contact Info */}
              <div className="text-xs">
                <p><strong>Contact:</strong> {pin.location?.info?.contactName || 'N/A'}</p>
                <p><strong>Email:</strong> {pin.location?.info?.contactEmail || 'N/A'}</p>
                <p><strong>Phone:</strong> {pin.location?.info?.contactPhoneNumber || 'N/A'}</p>
              </div>

              {/* Address */}
              <p className="text-xs"><strong>Location:</strong> {pin.location?.address || 'No address available'}</p>

              {/* Created Date */}
              <p className="text-[10px] text-gray-500">
                Created on: {new Date(pin.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
