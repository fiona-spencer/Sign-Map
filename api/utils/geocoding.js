export const fetchLatLng = async (address) => {
  const apiKey = 'AIzaSyA1wOqcLSGKkhNJQYP9wH06snRuvSJvRJY'; // Replace with your API key
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Helper function for delay

  const geocodeAddress = async (address) => {
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
        console.error('Geocoding failed for:', address);
        return { lat: 0, lng: 0 };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
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
