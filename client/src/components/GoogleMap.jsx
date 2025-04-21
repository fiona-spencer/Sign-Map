import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import CreateReport from './createReport';
import ShowPins from './ShowPins'; // Import ShowPins component
import { ReportDetailsCard } from './ReportDetailsCard';

const GoogleMap = ({ apiKey, mapId = '42c8848d94ad7219', center = { lat: 43.7, lng: -79.42 }, zoom = 12 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchInputRef = useRef(null); // Reference for the search input
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markersData, setMarkersData] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showCreateReportForm, setShowCreateReportForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [highlightedPin, setHighlightedPin] = useState(null);  // Track the highlighted pin
  const [address, setAddress] = useState(''); // Store the selected address

  const navigate = useNavigate();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) return;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places&callback=onGoogleMapsLoaded&v=weekly`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => setIsMapLoaded(true);
      script.onerror = () => setIsMapLoaded(false);
    };

    window.onGoogleMapsLoaded = () => initMap();

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      setIsMapLoaded(true);
    }

    return () => {
      const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (script) document.body.removeChild(script);
      delete window.onGoogleMapsLoaded;
    };
  }, [apiKey]);

  // Initialize map and set up autocomplete
const initMap = async () => {
  if (!mapRef.current) return;

  try {
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    const map = new Map(mapRef.current, { center, zoom, mapId });
    mapInstanceRef.current = map;

    // Setup the Autocomplete service
    const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ['place_id', 'geometry', 'name'],
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();

        // Set the new marker position
        setMarkerPosition(new google.maps.LatLng(newLat, newLng));

        // Re-center the map and zoom in closer (you can adjust the zoom value to your preference)
        map.setCenter({ lat: newLat, lng: newLng });
        map.setZoom(16); // Adjust zoom level to 16 for a closer view

        // Update the address in state
        setAddress(place.name);
      }
    });

    // Adding click listener for adding custom markers and zooming in closer
    map.addListener('click', (e) => {
      setMarkerPosition(e.latLng);
      setShowCreateReportForm(true);

      // Geocode the position to get the address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: e.latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });

      // Zoom in closer (you can adjust this value to zoom in as needed)
      map.setZoom(18);
    });
  } catch (error) {
    console.error('Map initialization error:', error);
  }
};



  // Submit new report
  const handleCreateMarker = async (reportData) => {
    setIsSubmitting(true);

    try {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: markerPosition.lat(), lng: markerPosition.lng() };

      geocoder.geocode({ location: latlng }, async (results, status) => {
        if (status === "OK" && results[0]) {
          const locationName = results[0].formatted_address;

          const response = await fetch('/api/pin/createPin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reportData, locationName, position: latlng }),
          });

          const result = await response.json();
          if (result.success) {
            const fullReport = { ...reportData, locationName, position: latlng };
            setMarkersData(prev => [...prev, fullReport]);
            setShowCreateReportForm(false);
          } else {
            console.error('Report submission failed:', result);
          }
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="">
      <h3 className="text-xl font-bold p-4">View Toronto Reports</h3>

      {/* Search Bar */}
      <div className="p-4">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a place"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {/* Overlay and Create Report Form */}
      {showCreateReportForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCreateReportForm(false)} />
          <div className="fixed inset-0 justify-center items-start z-50 pt-20 overflow-y-auto pb-16">
            <div>
              <CreateReport
                position={markerPosition}
                onClose={() => setShowCreateReportForm(false)}
                onSubmit={handleCreateMarker}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </>
      )}

      {/* Show Pins */}
      <ShowPins
        markersData={markersData}
        mapInstanceRef={mapInstanceRef}
        highlightedPin={highlightedPin}
        setHighlightedPin={setHighlightedPin}  // Pass state and setter to ShowPins
        onSelectPin={(pin) => setSelectedReport(pin)} // Update this line
      />


      {/* Map */}
      <div id="map" ref={mapRef} className="w-full h-[500px]"></div>

      <div className="mt-4 p-4 border-t border-gray-300 bg-white dark:bg-gray-800 dark:text-white">
        
        <ReportDetailsCard selectedReport={selectedReport}/>

      </div>
    </div>
  );
};

export default GoogleMap;
