import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMap from '../components/GoogleMap';

export default function Map({ apiKey }) {
  const [isReady, setIsReady] = useState(false);
  const mapState = useSelector((state) => state.global.mapState); // Redux state

  useEffect(() => {
    const isReloading = sessionStorage.getItem("mapReloading");

    if (mapState === "on" && !isReloading) {
      sessionStorage.setItem("mapReloading", "true");
      window.location.reload();
    } else if (isReloading) {
      sessionStorage.removeItem("mapReloading");
      setIsReady(true);
    } else {
      // Allow immediate load if mapState isn't "on"
      setIsReady(true);
    }
  }, [mapState]);

  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent dark:bg-gray-800">
      <GoogleMap apiKey={apiKey} />
    </div>
  );
}
