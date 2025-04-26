// loadGoogleMap.js
let googleMapsScriptLoaded = false;

export const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (googleMapsScriptLoaded) {
      return resolve(); // If already loaded, resolve immediately.
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.onload = () => {
      googleMapsScriptLoaded = true;
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Failed to load Google Maps script"));
    };

    document.body.appendChild(script);
  });
};
