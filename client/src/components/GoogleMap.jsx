import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import CreateReport from './createReport';
import ShowPins from './ShowPins';
import { ReportDetailsCard } from './ReportDetailsCard';
import { Alert, Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';

const GoogleMap = ({
  apiKey,
  filteredPins,
  mapId = '42c8848d94ad7219',
  center = { lat: 43.7, lng: -79.42 },
  zoom = 12,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showCreateReportForm, setShowCreateReportForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [highlightedPin, setHighlightedPin] = useState(null);
  const [address, setAddress] = useState('');
  const [placeholder, setPlaceholder] = useState('Search for a place');
  const [resetPinsTrigger, setResetPinsTrigger] = useState(0);
  const [viewMode, setViewMode] = useState(() => sessionStorage.getItem('viewMode') || 'default');
  const [showGeoJson, setShowGeoJson] = useState(() => JSON.parse(sessionStorage.getItem('showGeoJson')) || false); // New state for checkbox
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  useEffect(() => {
    localStorage.setItem('mapViewMode', viewMode);
  }, [viewMode]);

  const navigate = useNavigate();

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

  const featureStyleFunction = (feature) => {
    return {
      fillColor: 'black',
      fillOpacity: 0.1,
      strokeWeight: 1,
    };
  };

  // Initialize the map and all its features
  const initMap = async () => {
    if (!mapRef.current) return;

    try {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

      const map = new Map(mapRef.current, {
        center,
        zoom,
        mapId,
      });

      mapInstanceRef.current = map;

      // 🗺️ KMZ Layer (if applicable)
      const kmzUrl = 'https://your-server-url/path/to/your-file.kmz'; // Change this to your KMZ file URL
      const kmzLayer = new google.maps.KmlLayer({
        url: kmzUrl,
        suppressInfoWindows: true, // Optionally suppress info windows
        map: map,
      });

      // 🔍 Autocomplete
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ['place_id', 'geometry', 'name'],
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const newLat = place.geometry.location.lat();
          const newLng = place.geometry.location.lng();

          setMarkerPosition(new google.maps.LatLng(newLat, newLng));
          map.setCenter({ lat: newLat, lng: newLng });
          map.setZoom(13);
          setAddress(place.name);
        }
      });

      // 🖱️ Click Handler for the map
      map.addListener('click', (e) => {
        setMarkerPosition(e.latLng);
        setShowCreateReportForm(true);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address);
          }
        });

        map.setZoom(18);

        if (searchInputRef.current) {
          searchInputRef.current.value = '';
          searchInputRef.current.placeholder = 'Search for a place';
        }
      });

      // GeoJSON Layer
      const geoJsonLayer = new google.maps.Data();
      geoJsonLayer.loadGeoJson('/toronto_geo.geojson'); // Make sure it's in the public folder

      // Apply feature style to the GeoJSON layer
      geoJsonLayer.setStyle(featureStyleFunction);

      // Add event listener for clicks on polygons
      geoJsonLayer.addListener('click', (event) => {
        const postalCode = event.feature.getProperty('CFSAUID');
        // Set the alert message
        if (postalCode) {
          setAlertMessage(`Postal Code: ${postalCode}`);
        } else {
          setAlertMessage('Postal Code not found.');
        }
    
        // Make the alert visible
        setAlertVisible(true);
      });

      // Toggle GeoJSON visibility based on the checkbox
      if (showGeoJson) {
        geoJsonLayer.setMap(map);
      } else {
        geoJsonLayer.setMap(null);
      }

      if (viewMode === 'default' || viewMode === 'both') {
        window.reload();
      }

    } catch (error) {
      console.error('Map initialization error:', error);
    }
  };

  useEffect(() => {
    initMap();
  }, [viewMode, showGeoJson]); // Listen to both viewMode and showGeoJson changes

  // Handle GeoJSON visibility toggle
  const handleGeoJsonToggle = (e) => {
    const isChecked = e.target.checked;
    setShowGeoJson(isChecked);

    // Save the state to session storage
    sessionStorage.setItem('showGeoJson', isChecked.toString());

    // If unchecked, reload the window
    if (isChecked || !isChecked) {
      window.location.reload();
    }
  };

  const handleCreateMarker = async (reportData) => {
    setIsSubmitting(true);

    try {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: markerPosition.lat(), lng: markerPosition.lng() };

      geocoder.geocode({ location: latlng }, async (results, status) => {
        if (status === 'OK' && results[0]) {
          const locationName = results[0].formatted_address;

          const response = await fetch('/api/pin/createPin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reportData, locationName, position: latlng }),
          });

          const result = await response.json();
          if (result.success) {
            setShowCreateReportForm(false);
            setResetPinsTrigger(prev => prev + 1);
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

  const handleClearAddress = () => {
    setAddress('');
    setMarkerPosition(null);

    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      searchInputRef.current.placeholder = 'Search for a place';
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
      mapInstanceRef.current.setCenter(center);
    }
  };

  const fitBoundsToPins = () => {
    if (!mapInstanceRef.current) return;
    if (!filteredPins || !Array.isArray(filteredPins) || filteredPins.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    filteredPins.forEach((pin) => {
      if (pin.location && pin.location.lat && pin.location.lng) {
        bounds.extend(new google.maps.LatLng(pin.location.lat, pin.location.lng));
      }
    });

    if (bounds.isEmpty()) return;

    const map = mapInstanceRef.current;
    map.fitBounds(bounds, 50);

    const currentZoom = map.getZoom();
    const minimumZoom = 12;

    if (filteredPins.length === 1 && currentZoom < minimumZoom) {
      map.setZoom(minimumZoom);
    }
  };

  useEffect(() => {
    if (isMapLoaded) {
      fitBoundsToPins();
    }
  }, [filteredPins, isMapLoaded]);

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-sm border px-6 bg-[#ffffff7d] pb-6">
      <h3 className="text-xl font-bold p-4">View Reports</h3>
 {/* Conditionally render the Flowbite alert */}

      {/* GeoJSON toggle checkbox */}
      <div className="mb-4">
        <label className="mr-4">Show GeoJSON Layer:</label>
        <input
          type="checkbox"
          checked={showGeoJson}
          onChange={handleGeoJsonToggle}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="p-4">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      {alertVisible && (
        <Alert
          className="fixed bottom-20 right-4 z-50"
          color="warning" // You can change the color (e.g., 'success', 'danger', 'warning', 'info')
          // Close the alert on click
        >
          {alertMessage}
          <button
          onClick={() => setAlertVisible(false)} 
          type="button"
          className="ml-5 rounded-lg border border-cyan-700 bg-transparent px-2 py-1.5 text-center text-xs font-medium text-cyan-700 hover:bg-cyan-800 hover:text-white focus:ring-4 focus:ring-cyan-300 dark:border-cyan-800 dark:text-cyan-800 dark:hover:text-white"
        >
          <HiX className='h-2 w-2'/>
        </button>
        </Alert>
      )}
      {/* Other components */}
      {address && !showCreateReportForm && (
        <div className="p-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreateReportForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-700"
            >
              Create Pin at {address}
            </button>
            <button
              onClick={handleClearAddress}
              className="bg-red-500 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-red-600"
            >
              Clear Address
            </button>
          </div>
        </div>
      )}

      {showCreateReportForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCreateReportForm(false)} />
          <div className="fixed inset-0 justify-center items-start z-50 pt-20 overflow-y-auto pb-16">
            <div>
              <CreateReport
                position={markerPosition}
                address={address}
                onClose={() => setShowCreateReportForm(false)}
                onSubmit={handleCreateMarker}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </>
      )}

      <ShowPins
        pins={filteredPins}
        mapInstanceRef={mapInstanceRef}
        highlightedPin={highlightedPin}
        setHighlightedPin={setHighlightedPin}
        resetPinsTrigger={resetPinsTrigger}
        onSelectPin={(pin) => setSelectedReport(pin)}
      />

      <div id="map" ref={mapRef} className="w-full h-[500px] rounded-lg"></div>

      <div className="mt-4 rounded-xl border-gray-300 bg-transparent dark:text-white dark:bg-emerald-600">
        <ReportDetailsCard selectedReport={selectedReport} />
      </div>
    </div>
  );
};

export default GoogleMap;
