import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import 'react-quill/dist/quill.snow.css';
import CreateReport from './createReport';

import {
  FaSkullCrossbones, FaFireExtinguisher, FaTaxi, FaPlug, FaDog,
  FaBuilding, FaTree, FaSnowflake, FaRegTrashAlt, FaLandmark,
  FaBug, FaWineBottle, FaWater
} from 'react-icons/fa';

const iconOptions = [
  { label: 'poison', icon: <FaSkullCrossbones /> },
  { label: 'fire', icon: <FaFireExtinguisher /> },
  { label: 'ttc', icon: <FaTaxi /> },
  { label: 'hydro', icon: <FaPlug /> },
  { label: 'animal', icon: <FaDog /> },
  { label: 'building', icon: <FaBuilding /> },
  { label: 'tree', icon: <FaTree /> },
  { label: 'snow', icon: <FaSnowflake /> },
  { label: 'garbage', icon: <FaRegTrashAlt /> },
  { label: 'parks', icon: <FaLandmark /> },
  { label: 'health', icon: <FaBug /> },
  { label: 'graffiti', icon: <FaWineBottle /> },
  { label: 'water', icon: <FaWater /> },
];

const departmentColors = {
  poison: 'bg-red-500',
  fire: 'bg-red-700',
  ttc: 'bg-yellow-200',
  hydro: 'bg-blue-500',
  animal: 'bg-orange-800',
  building: 'bg-indigo-900',
  tree: 'bg-green-500',
  snow: 'bg-cyan-500',
  garbage: 'bg-gray-500',
  parks: 'bg-red-500',
  health: 'bg-red-900',
  graffiti: 'bg-pink-500',
  water: 'bg-blue-300',
};

const GoogleMap = ({ apiKey, mapId = '42c8848d94ad7219', center = { lat: 43.7, lng: -79.42 }, zoom = 12 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markersData, setMarkersData] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showCreateReportForm, setShowCreateReportForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // New states for address, latitude, and longitude
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
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

  // Initialize map
  const initMap = async () => {
    if (!mapRef.current) return;

    try {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

      const map = new Map(mapRef.current, { center, zoom, mapId });
      mapInstanceRef.current = map;

      map.addListener('click', (e) => {
        setMarkerPosition(e.latLng);
        setShowCreateReportForm(true);

        // Geocode the position to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address);
            setLatitude(e.latLng.lat());
            setLongitude(e.latLng.lng());
          }
        });
      });
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  };

  // Fetch reports from database
  useEffect(() => {
    if (!isMapLoaded) return;

    fetch('/api/report/getReports')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.reports)) {
          setMarkersData(data.reports);
        } else {
          console.error('Invalid report data:', data);
        }
      })
      .catch(console.error);
  }, [isMapLoaded]);

  // Render marker
  const createMarker = (map, position, reportData) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'group relative flex items-center justify-center';

    const bgColor = departmentColors[reportData.category] || 'bg-blue-500';

    const iconOnly = document.createElement('div');
    iconOnly.className = `${bgColor.replace('500', '600')} border-2 border-white text-white rounded-lg p-2 shadow-md`;

    const category = iconOptions.find(opt => opt.label === reportData.category);
    const icon = category ? category.icon : <FaSkullCrossbones />;
    iconOnly.innerHTML = ReactDOMServer.renderToString(icon);

    const tooltip = document.createElement('div');
    tooltip.className = `absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-base font-semibold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[9999] pointer-events-none whitespace-nowrap`;
    tooltip.textContent = reportData.title;

    markerElement.appendChild(iconOnly);
    markerElement.appendChild(tooltip);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: markerElement,
    });

    marker.addListener('click', () => setSelectedReport(reportData));
  };

  // Render markers from DB
  useEffect(() => {
    if (markersData.length > 0 && mapInstanceRef.current) {
      markersData.forEach(report => {
        const pos = { lat: report.position.lat, lng: report.position.lng };
        createMarker(mapInstanceRef.current, pos, report);
      });
    }
  }, [markersData]);

  // Submit new report
  const handleCreateMarker = async (reportData) => {
    setIsSubmitting(true);

    try {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: markerPosition.lat(), lng: markerPosition.lng() };

      geocoder.geocode({ location: latlng }, async (results, status) => {
        if (status === "OK" && results[0]) {
          const locationName = results[0].formatted_address;

          const response = await fetch('/api/report/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reportData, locationName, position: latlng }),
          });

          const result = await response.json();
          if (result.success) {
            const fullReport = { ...reportData, locationName, position: latlng };
            createMarker(mapInstanceRef.current, latlng, fullReport);
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

      {/* Map */}
      <div id="map" ref={mapRef} className="w-full h-[500px]"></div>

      {/* Selected Report Details */}
      {selectedReport && (
        <div className="mt-4 p-4 border-t border-gray-300 bg-white dark:bg-gray-800 dark:text-white">
          <h4 className="text-lg font-semibold">Report Details</h4>
          <p><strong>Title:</strong> {selectedReport.title}</p>
          <p><strong>Category:</strong> {selectedReport.category}</p>
          <p><strong>Description:</strong> {selectedReport.content}</p>
          <p><strong>Location:</strong> {selectedReport.locationName}</p>
          <p><strong>Date:</strong> {new Date(selectedReport.dateOfIncident).toLocaleString()}</p>
          <p><strong>Contact:</strong> {selectedReport.fullName} ({selectedReport.email})</p>
          <p><strong>Severity:</strong> {selectedReport.severity}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
