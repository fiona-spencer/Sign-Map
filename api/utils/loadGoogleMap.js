// Load the Google Maps script with a promise
export const loadGoogleMapsScript = (apiKey) => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(); // If the API is already loaded, resolve immediately
        return;
      }
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Google Maps API script failed to load'));
      script.onload = () => resolve(); // Resolve once the script is fully loaded
      document.head.appendChild(script);
    });
  };
  