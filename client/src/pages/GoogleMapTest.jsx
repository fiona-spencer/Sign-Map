import React, { useEffect, useRef, useState } from 'react';

const GoogleMapTest = ({ apiKey }) => {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load Google Maps script
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onerror = () => {
      setError('❌ Failed to load Google Maps API. Check your key and restrictions.');
    };

    // Attach initMap globally so Google can call it
    window.initMap = () => {
      if (mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: 43.7, lng: -79.42 },
          zoom: 12,
        });
      }
    };

    return () => {
      delete window.initMap;
    };
  }, [apiKey]);

  return (
    <div style={{ height: '100vh' }}>
      {error ? (
        <p style={{ color: 'red', textAlign: 'center', paddingTop: '2rem' }}>{error}</p>
      ) : (
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
};

export default GoogleMapTest;
