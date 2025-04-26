import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import CreateReport from './createReport';
import ShowPins from './ShowPins';
import { ReportDetailsCard } from './ReportDetailsCard';
import { Alert } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import MapToPdf from './MapToPdf';
import { Button, Modal } from 'flowbite-react';

const GoogleMap = ({ apiKey, mapId = '42c8848d94ad7219', center = { lat: 43.7, lng: -79.42 },
  zoom = 12, }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchInputRef = useRef(null);

  const { filteredPins, mapState } = useSelector((state) => state.global);

  const defaultCenter = mapState?.center || { lat: 43.7, lng: -79.42 };
  const defaultZoom = mapState?.zoom || 12;

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showCreateReportForm, setShowCreateReportForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [address, setAddress] = useState('');
  const [placeholder, setPlaceholder] = useState('Search for a place');
  const [resetPinsTrigger, setResetPinsTrigger] = useState(0);
  const [viewMode, setViewMode] = useState(() => sessionStorage.getItem('viewMode') || 'default');
  const [showGeoJson, setShowGeoJson] = useState(() => JSON.parse(sessionStorage.getItem('showGeoJson')) || false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mapViewMode', viewMode);
    // localStorage.setItem('initMap', 'true');
  }, [viewMode]);

  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) {
        console.error("Map container not found.");
        return;
      }
  
      try {
        const map = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          mapId,
        });
  
        mapInstanceRef.current = map;
        setIsMapLoaded(true); // mark map as loaded
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    };
  
    const loadGoogleScript = () => {
      const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        existingScript.addEventListener('load', initMap);
        return;
      }
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;      
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps script.');
        setIsMapLoaded(false);
      };
  
      document.body.appendChild(script);
    };
  
    if (!window.google?.maps) {
      loadGoogleScript();
    } else {
      initMap();
    }
  
    return () => {
      const scriptToRemove = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
      delete window.initMap;
    };
  }, [apiKey]);


  //separate into two props


  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    document.body.appendChild(script);
  
    window.initMap = () => {
      setIsMapLoaded(true);
      initMap();
    };

    script.onerror = () => {
      setIsMapLoaded(false);
      console.error('Failed to load Google Maps script.');
    };
  
    return () => {
      const scriptToRemove = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (scriptToRemove && scriptToRemove.parentNode === document.body) {
        document.body.removeChild(scriptToRemove);
      }
      delete window.initMap;
    };
  }, [apiKey]);

  const featureStyleFunction = (feature) => ({
    fillColor: 'black',
    fillOpacity: 0.1,
    strokeWeight: 1,
  });

  const initMap = async () => {
    if (!mapRef.current) return;

    try {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
      const map = new Map(mapRef.current, { center: defaultCenter, zoom: defaultZoom, mapId });
      
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
          map.setZoom(13);
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

      const geoJsonLayer = new google.maps.Data();
      geoJsonLayer.loadGeoJson('/toronto_geo.geojson');
      geoJsonLayer.setStyle(featureStyleFunction);

      geoJsonLayer.addListener('click', (event) => {
        const postalCode = event.feature.getProperty('CFSAUID');
        setAlertMessage(postalCode ? `Postal Code: ${postalCode}` : 'Postal Code not found.');
        setAlertVisible(true);
      });

      geoJsonLayer.setMap(showGeoJson ? map : null);
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  };

  useEffect(() => {
    initMap();
  }, [isModalOpen, viewMode, showGeoJson]);

  const handleGeoJsonToggle = (e) => {
    const isChecked = e.target.checked;
    setShowGeoJson(isChecked);
    window.location.reload(); 
    sessionStorage.setItem('showGeoJson', isChecked.toString());
  };

  const fitBoundsToPins = () => {
    if (!mapInstanceRef.current || !filteredPins?.length) return;
    const bounds = new google.maps.LatLngBounds();

    filteredPins.forEach((pin) => {
      if (pin.location?.lat && pin.location?.lng) {
        bounds.extend(new google.maps.LatLng(pin.location.lat, pin.location.lng));
      }
    });

    if (!bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds, 50);
      const currentZoom = mapInstanceRef.current.getZoom();
      if (filteredPins.length === 1 && currentZoom < 12) {
        mapInstanceRef.current.setZoom(12);
      }
    }
  };

  useEffect(() => {
    if (isMapLoaded) fitBoundsToPins();
  }, [filteredPins, isMapLoaded]);

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

  return (
    <div className="rounded-lg shadow-sm border px-6 bg-[#ffffff7d] pb-6">
      {/* Button to open modal
      <Modal show={!isModalOpen}>
        <Modal.Header>Welcome to the Page</Modal.Header>
        <Modal.Body>
          <p>This is the page you're trying to enter. Please click Enter to proceed.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={toggleModal} className="bg-green-600 text-white hover:bg-green-700">
            Enter
          </Button>
        </Modal.Footer>
      </Modal> */}
      
      <h3 className="text-xl font-bold p-4">View Reports</h3>

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
        <Alert className="fixed bottom-20 right-4 z-50" color="warning">
          {alertMessage}
          <button
            onClick={() => setAlertVisible(false)}
            type="button"
            className="ml-5 rounded-lg border border-cyan-700 bg-transparent px-2 py-1.5 text-center text-xs font-medium text-cyan-700 hover:bg-cyan-800 hover:text-white"
          >
            <HiX className="w-4 h-4" />
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
                apiKey={apiKey}
                location={markerPosition}
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
        mapInstanceRef={mapInstanceRef}
        onSelectPin={(pin) => setSelectedReport(pin)}
        resetPinsTrigger={resetPinsTrigger}
      />
      <div ref={mapRef} style={{ height: '500px', width: '100%' }} className="my-4" />
      <div className="mt-4 rounded-xl border-gray-300 bg-transparent dark:text-white dark:bg-emerald-600">
        <ReportDetailsCard selectedReport={selectedReport} />
      </div>
    </div>
  );
};


export default GoogleMap;