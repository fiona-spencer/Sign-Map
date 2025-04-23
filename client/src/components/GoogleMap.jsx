import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import CreateReport from './createReport';
import ShowPins from './ShowPins';
import { ReportDetailsCard } from './ReportDetailsCard';

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

  const initMap = async () => {
    if (!mapRef.current) return;

    try {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

      const map = new Map(mapRef.current, { center, zoom, mapId });
      mapInstanceRef.current = map;

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
          map.setZoom(16);
          setAddress(place.name);
        }
      });

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
    } catch (error) {
      console.error('Map initialization error:', error);
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
            // Optionally notify parent or refetch pins here
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

  const handleClearAddress = () => {
    setAddress('');
    setMarkerPosition(null);

    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      searchInputRef.current.placeholder = 'Search for a place';
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
    <div className="rounded-lg shadow-sm border px-6 bg-[#ffffff7d] pb-6">
      <h3 className="text-xl font-bold p-4">View Toronto Reports</h3>

      {/* Search Bar */}
      <div className="p-4">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {/* Button to Create Report */}
      {address && !showCreateReportForm && (
        <div className="p-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreateReportForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-700 hover:scale-[1.02] transition-transform duration-200 ease-in-out focus:ring-2 focus:ring-blue-400"
            >
              Create Pin at {address}
            </button>
            <button
              onClick={handleClearAddress}
              className="bg-red-500 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-red-600 hover:scale-[1.02] transition-transform duration-200 ease-in-out focus:ring-2 focus:ring-red-400"
            >
              Clear Address
            </button>
          </div>
        </div>
      )}

      {/* Overlay and Create Report Form */}
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

      {/* Show Pins */}
      <ShowPins
  pins={filteredPins} // ← pass filtered pins here
  mapInstanceRef={mapInstanceRef}
  highlightedPin={highlightedPin}
  setHighlightedPin={setHighlightedPin}
  onSelectPin={(pin) => setSelectedReport(pin)}
/>


      {/* Map */}
      <div id="map" ref={mapRef} className="w-full h-[500px] rounded-lg"></div>

      {/* Report Details */}
      <div className="mt-4 rounded-xl border-gray-300 bg-transparent dark:text-white dark:bg-emerald-600">
        <ReportDetailsCard selectedReport={selectedReport} />
      </div>
    </div>
  );
};

export default GoogleMap;
