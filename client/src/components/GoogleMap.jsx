import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import CreateReport from './CreateReport'; // Import the CreateReport component
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import { FaSkullCrossbones, FaFireExtinguisher, FaTaxi, FaPlug, FaDog, FaBuilding, FaTree, FaSnowflake, FaRegTrashAlt, FaLandmark, FaBug, FaWineBottle, FaWater } from 'react-icons/fa';

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
  const [selectedReport, setSelectedReport] = useState(null); // State for the selected report
  const navigate = useNavigate();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places&callback=onGoogleMapsLoaded&v=weekly`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => setIsMapLoaded(true);
      script.onerror = () => {
        console.error('Google Maps API failed to load');
        setIsMapLoaded(false);
      };
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
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Fetch reports with latitude and longitude
  useEffect(() => {
    if (isMapLoaded) {
      fetch('/api/report/getReports') // Fetch reports from the API
        .then((response) => response.json())
        .then((data) => {
          console.log('Database Response:', data); // Log the entire database response
  
          if (data && Array.isArray(data.reports) && data.reports.length > 0) {
            setMarkersData(data.reports); // Store reports
          } else {
            console.error('Invalid or empty report data:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching reports:', error);
        });
    }
  }, [isMapLoaded]);

  const createMarker = (map, position, reportData) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'group relative flex items-center justify-center';
  
    const bgColor = departmentColors[reportData.category] || 'bg-blue-500';
  
    // Icon Only
    const iconOnly = document.createElement('div');
    iconOnly.className = `${bgColor.replace('500', '600')} border-2 border-white text-white rounded-lg p-2 shadow-md`;
    const categoryData = iconOptions.find(opt => opt.label === reportData.category);
    const icon = categoryData ? categoryData.icon : <FaSkullCrossbones />;
    iconOnly.innerHTML = ReactDOMServer.renderToString(icon);
  
    // Tooltip for Title
    const tooltip = document.createElement('div');
    tooltip.className = `
  absolute -top-10 left-1/2 transform -translate-x-1/2 
  bg-black text-white text-base font-semibold px-3 py-1 rounded opacity-0 
  group-hover:opacity-100 transition-opacity duration-300 
  z-[9999] pointer-events-none whitespace-nowrap antialiased
`;

  
    tooltip.textContent = reportData.title;
  
    markerElement.appendChild(iconOnly);
    markerElement.appendChild(tooltip);
  
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: markerElement,
    });
  
    marker.addListener('click', () => {
      setSelectedReport(reportData);
    });
  
    return marker;
  };
  
  useEffect(() => {
    if (markersData.length > 0 && mapInstanceRef.current) {
      markersData.forEach(report => {
        const position = { lat: report.position.lat, lng: report.position.lng };
        createMarker(mapInstanceRef.current, position, report);
      });
    }
  }, [markersData]);

  const handleCreateMarker = async (reportData) => {
    setIsSubmitting(true);
    try {
      const geocoder = new google.maps.Geocoder();
  
      const latlng = {
        lat: markerPosition.lat(),
        lng: markerPosition.lng(),
      };
  
      geocoder.geocode({ location: latlng }, async (results, status) => {
        if (status === "OK" && results[0]) {
          const locationName = results[0].formatted_address;
  
          const response = await fetch('/api/report/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...reportData,
              locationName,
              position: latlng,
            }),
          });
  
          const result = await response.json();
          if (result.success) {
            const fullReport = {
              ...reportData,
              locationName,
              position: latlng,
            };
  
            createMarker(mapInstanceRef.current, latlng, fullReport);
            setMarkersData(prev => [...prev, fullReport]);
            setShowCreateReportForm(false);
          } else {
            console.error('Failed to create marker:', result);
          }
        } else {
          console.error('Geocoding failed:', status);
        }
      });
  
    } catch (error) {
      console.error('Error creating marker:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p>Loading map...</p>
          <div className="spinner-border animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <h3 className="text-xl font-bold p-4">View Toronto Reports</h3>

      {showCreateReportForm && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <CreateReport 
            position={markerPosition}
            onClose={() => setShowCreateReportForm(false)}
            onSubmit={handleCreateMarker}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      <div id="map" ref={mapRef} className="w-full h-[500px]"></div>

      {selectedReport && (
        <div className="mt-4 p-4 border-t border-gray-300 bg-white">
          <h4 className="text-lg font-semibold">Report Details</h4>
          <p><strong>Title:</strong> {selectedReport.title}</p>
          <p><strong>Category:</strong> {selectedReport.category}</p>
          <p><strong>Description:</strong> {selectedReport.content}</p>
          <p><strong>Location:</strong> {selectedReport.locationName}</p>
          <p><strong>Date of Incident:</strong> {new Date(selectedReport.dateOfIncident).toLocaleString()}</p>
          <p><strong>Contact:</strong> {selectedReport.fullName} ({selectedReport.email})</p>
          <p><strong>Severity:</strong> {selectedReport.severity}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
