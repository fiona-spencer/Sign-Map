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
  const [pinClicked, setPinClicked] = useState(null); // To track the clicked pin
  const markersRef = useRef([]);

  // Load new pins from props
  useEffect(() => {
    if (Array.isArray(propPins) && propPins.length > 0) {
      setPins(propPins);
    } else {
      setPins([]);
      markersRef.current.forEach(marker => marker.setMap(null)); // Remove old markers
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
    pins.forEach((pin, index) => {
      const position = { lat: pin.location.lat, lng: pin.location.lng };
      const marker = createMarker(mapInstanceRef.current, position, pin, index);
      markersRef.current.push(marker);
    });
  }, [pins, mapInstanceRef]);

  // Reset pins when parent triggers it
  useEffect(() => {
    setPins([]);
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, [resetPinsTrigger]);

  const createMarker = (map, position, pinData, index) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'group relative flex items-center justify-center';

    const status = pinData.location.status || 'default';
    const statusClass = getStatusClass(status);

    const iconOnly = document.createElement('div');
    iconOnly.className = `${statusClass} border-2 border-white text-white rounded-lg p-2 shadow-md transition-all duration-300 ease-in-out`;  // Added transition-duration

    const categoryData = iconOptions.find(opt => opt.label === 'default');
    const icon = categoryData ? categoryData.icon : <FaMapPin />;
    iconOnly.innerHTML = ReactDOMServer.renderToString(icon);

    // Tooltip for Title
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
      console.log('Pin clicked:', pinData);
      if (onSelectPin) onSelectPin(pinData);
    
      if (pinClicked === index) {
        setPinClicked(null);
      } else {
        setPinClicked(index);
    
        markersRef.current.forEach((marker, i) => {
          const iconEl = marker.getIconElement();
    
          if (i !== index) {
            iconEl.classList.add('opacity-50');
            iconEl.classList.remove('scale-100');
            iconEl.classList.add('scale-50');

          } else {
            iconEl.classList.add('opacity-100');
          }
    
          iconEl.classList.add('transition-all', 'duration-300', 'ease-in-out');
        });
      }
    
      // 🔁 Delay reloading only the clicked pin to let animation complete
        const clickedMarker = markersRef.current[index];
        if (clickedMarker) {
          clickedMarker.setMap(null);
          markersRef.current[index] = null;
        }
    
        const position = { lat: pinData.location.lat, lng: pinData.location.lng };
        const newMarker = createMarker(mapInstanceRef.current, position, pinData, index);
        markersRef.current[index] = newMarker;
    });
    
    

    return marker;
  };
  return (
    <>
  {pins.length === 0 ? (
    <div className="fixed bottom-4 right-4 max-w-sm z-50">
      <Alert color="failure" icon={HiInformationCircle}>
        No pins found on the map. Please try again or create a new report.
      </Alert>
    </div>
  ) : (
    <div className="fixed bottom-4 right-4 max-w-sm z-50">
      <Alert color="info" icon={HiInformationCircle}>
        Showing {pins.length} pin{pins.length > 1 ? 's' : ''} on the map.
      </Alert>
    </div>
  )}
</>

  );
};

export default ShowPins;
