import React, { useEffect } from 'react';
import GoogleMap from "../components/GoogleMap";

const MAP_STATE = {
  ON: "on",
  OFF: "off",
};

export default function Map({ mapState }) {
  useEffect(() => {
    const isReloading = sessionStorage.getItem("mapReloading");

    if (mapState === MAP_STATE.OFF) {
      // Mark that a reload is happening
      sessionStorage.setItem("mapReloading", "true");

      // Replace the current page to force a faster reload (without history)
      window.location.replace(window.location.href); 
    } else if (isReloading) {
      // Set the mapState to ON after reload and clean up sessionStorage
      localStorage.setItem("mapState", MAP_STATE.ON);
      sessionStorage.removeItem("mapReloading");
    }
  }, [mapState]);

  return (
    <div>
      <GoogleMap apiKey="AIzaSyA1wOqcLSGKkhNJQYP9wH06snRuvSJvRJY" />
    </div>
  );
}
