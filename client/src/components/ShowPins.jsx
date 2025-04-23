import React, { useEffect, useState, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { FaMapPin } from 'react-icons/fa';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from "react-icons/hi";

const iconOptions = [
  { label: 'default', icon: <FaMapPin /> },
];

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-200 text-black';
    case 'accepted': return 'bg-blue-500 text-white';
    case 'in-progress': return 'bg-orange-500 text-white';
    case 'resolved': return 'bg-green-500 text-white';
    case 'deleted': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const ShowPins = ({ pins: propPins = null, mapInstanceRef, onSelectPin, resetPinsTrigger }) => {
  const [pins, setPins] = useState([]);
  const [highlightedPin, setHighlightedPin] = useState(null);
  const markersRef = useRef([]);

  // Load new pins from props
  useEffect(() => {
    if (Array.isArray(propPins) && propPins.length > 0) {
      setPins(propPins);
    } else {
      setPins([]);
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
  }, [propPins]);

  // Add pins to map
  useEffect(() => {
    if (!mapInstanceRef.current || pins.length === 0 || !window.google) return;

    // Clean up old markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    pins.forEach(pin => {
      const position = { lat: pin.location.lat, lng: pin.location.lng };
      const marker = createMarker(mapInstanceRef.current, position, pin);
      markersRef.current.push(marker);
    });
  }, [pins, mapInstanceRef]);

  // Reset pins when parent triggers it
  useEffect(() => {
    setPins([]);
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, [resetPinsTrigger]);

  const createMarker = (map, position, pinData) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'group relative flex items-center justify-center';

    const status = pinData.location.status || 'default';
    const statusClass = getStatusClass(status);

    const iconOnly = document.createElement('div');
    iconOnly.className = `${statusClass} border-2 border-white text-white rounded-lg p-2 shadow-md`;

    const categoryData = iconOptions.find(opt => opt.label === 'default');
    const icon = categoryData ? categoryData.icon : <FaMapPin />;
    iconOnly.innerHTML = ReactDOMServer.renderToString(icon);

    const tooltip = document.createElement('div');
    tooltip.className = `
      absolute -top-10 left-1/2 transform -translate-x-1/2 
      bg-black text-white text-base font-semibold px-3 py-1 rounded opacity-0 
      group-hover:opacity-100 transition-opacity duration-300 
      z-[9999] pointer-events-none whitespace-nowrap antialiased
    `;
    tooltip.textContent = pinData.location?.info?.contactName || 'No contact name';

    markerElement.appendChild(iconOnly);
    markerElement.appendChild(tooltip);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: markerElement,
    });

    marker.getIconElement = () => iconOnly;

    marker.addListener('click', () => {
      if (onSelectPin) onSelectPin(pinData);

      if (highlightedPin) {
        const prevIcon = highlightedPin.getIconElement();
        prevIcon.className = `${getStatusClass('default')} border-2 border-white text-white rounded-lg p-2 shadow-md`;
        highlightedPin.setIcon({ url: '', scaledSize: new google.maps.Size(32, 32) });
      }

      setHighlightedPin(marker);

      const iconEl = marker.getIconElement();
      iconEl.className = `${statusClass.replace('200', '700')} border-2 border-white text-white rounded-lg p-2 shadow-lg`;

      marker.setIcon({ url: '', scaledSize: new google.maps.Size(40, 40) });
    });

    return marker;
  };

  return (
    <>
      {pins.length === 0 && (
        <div className="fixed  bottom-4 right-4 max-w-sm z-50">
        <Alert color="failure" icon={ HiInformationCircle }>
          No pins found on the map. Please try again or create a new report.
        </Alert>
      </div>
      
      )}
    </>
  );
};

export default ShowPins;
