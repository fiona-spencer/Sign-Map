import GoogleMap from '../components/GoogleMap';
import React, { useState, useEffect } from 'react';


export default function Map({ mapState, apiKey, pins }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isReloading = sessionStorage.getItem("mapReloading");

    if (mapState === "on" && !isReloading) {
      sessionStorage.setItem("mapReloading", "true");
      window.location.reload();
    } else if (isReloading) {
      sessionStorage.removeItem("mapReloading");
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }, [mapState]);

  if (!isReady) return <div>Loading map...</div>;

  return (
    <div className=' bg-[#29a37277] dark:bg-gray-800'>
      <GoogleMap apiKey={apiKey} filteredPins={pins} />
    </div>
  );
}
