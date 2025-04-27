import pLimit from 'p-limit';

export const fetchLatLng = async (address) => {
  const apiKey = import.meta.env.VITE_API_KEY; // Replace with your API key
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Helper function for delay

  // Helper function to fetch geocode data for a single address
  const geocodeAddress = async (address) => {
    try {
      console.log(`Geocoding address: ${address}`); // Log the address being geocoded

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await res.json();

      // Log the full response from the API for debugging
      console.log('Geocoding API response:', data);

      if (data.status === 'OK') {
        const lat = data.results[0]?.geometry.location.lat || 0;
        const lng = data.results[0]?.geometry.location.lng || 0;
        return { lat, lng };
      } else {
        // Log specific geocoding error
        console.error('Geocoding failed for address:', address, 'Status:', data.status, 'Error message:', data.error_message);
        return { lat: 0, lng: 0 };
      }
    } catch (error) {
      console.error('Geocoding error for address:', address, 'Error:', error);
      return { lat: 0, lng: 0 };
    }
  };

  try {
    // Fetch lat and lng for the single address
    const result = await geocodeAddress(address);
    return result; // Return the result which is an object with lat and lng
  } catch (error) {
    console.error('Error fetching lat/lng for address:', address);
    return { lat: 0, lng: 0 }; // Return default values on error
  }
};

export const batchFetchLatLng = async (addresses, batchSize = 10) => {
  const limit = pLimit(batchSize); // Limit the number of concurrent requests (e.g., 5 at a time)
  let allResults = [];
  let failedCount = 0;

  // Ensure addresses is an array and not empty
  if (!Array.isArray(addresses) || addresses.length === 0) {
    console.error('Invalid input: addresses should be a non-empty array');
    return [];
  }

  try {
    // Process the addresses in batches using p-limit for parallelism control
    const chunks = chunkArray(addresses, batchSize); // Split the addresses into batches
    const chunkResults = await Promise.all(
      chunks.map(async (batch) => {
        // Wait for all the promises in the batch to complete
        const batchResult = await Promise.all(
          batch.map(async (address) => {
            try {
              const { lat, lng } = await fetchLatLng(address); // Fetch lat/lng for each address
              return { address, lat, lng };
            } catch (error) {
              console.error('Error geocoding address:', address, error);
              failedCount++; // Increment failedCount in case of error
              return { address, lat: 0, lng: 0 }; // Return 0,0 for failed geocoding
            }
          })
        );
        return batchResult;
      })
    );

    // Flatten the result from all chunks
    allResults = chunkResults.flat();
    
    console.log('Total entries processed:', allResults.length);
    console.log('Failed entries:', failedCount);
  } catch (error) {
    console.error('Batch geocoding failed:', error);
  }

  return allResults;
};

// Helper function to split an array into chunks of a specified size
const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};
