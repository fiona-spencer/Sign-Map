import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server'; // Needed for rendering React icons to HTML
import { FaMapPin } from 'react-icons/fa'; // Use a default map pin icon

// Default icon styles and colors
const defaultIconStyle = 'bg-blue-500 border-2 border-white text-white rounded-lg p-2 shadow-md';

// Define the icon and department colors
const iconOptions = [
  { label: 'default', icon: <FaMapPin /> },  // Using the default icon
];

const departmentColors = {
  'default': 'bg-blue-500',
};

const ShowPins = ({ pins: propPins = null, mapInstanceRef, onSelectPin }) => {
  const [pins, setPins] = useState([]);
  const [highlightedPin, setHighlightedPin] = useState(null);  // Track the highlighted pin

  // Log the propPins to the console
  console.log('Prop Pins:', propPins);  // Log the passed pins prop

  useEffect(() => {
    // Use propPins directly if they are passed as a prop
    if (propPins && Array.isArray(propPins)) {
      setPins(propPins);
    }
  }, [propPins]);  // Re-run this effect when propPins changes

  useEffect(() => {
    if (!mapInstanceRef.current || pins.length === 0 || !window.google) return;

    pins.forEach(pin => {
      // Log the lat and lng of each pin
      console.log('Pin Lat:', pin.location.lat, 'Pin Lng:', pin.location.lng);

      const position = { lat: pin.location.lat, lng: pin.location.lng };
      createMarker(mapInstanceRef.current, position, pin);
    });
  }, [pins, mapInstanceRef]);

  // Function to get the status class for the marker
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

  const createMarker = (map, position, pinData) => {
    // Create marker container
    const markerElement = document.createElement('div');
    markerElement.className = 'group relative flex items-center justify-center';

    // Get status and corresponding background color from pin.location.status
    const status = pinData.location.status || 'default'; // Use 'default' if status is undefined
    const statusClass = getStatusClass(status);

    // Icon Only with Tailwind styling (using default icon)
    const iconOnly = document.createElement('div');
    iconOnly.className = `${statusClass} border-2 border-white text-white rounded-lg p-2 shadow-md`;
    
    // Using the default icon
    const categoryData = iconOptions.find(opt => opt.label === 'default');
    const icon = categoryData ? categoryData.icon : <FaMapPin />;
    iconOnly.innerHTML = ReactDOMServer.renderToString(icon); // Render the icon to HTML

    // Tooltip for Title
    const tooltip = document.createElement('div');
    tooltip.className = `
      absolute -top-10 left-1/2 transform -translate-x-1/2 
      bg-black text-white text-base font-semibold px-3 py-1 rounded opacity-0 
      group-hover:opacity-100 transition-opacity duration-300 
      z-[9999] pointer-events-none whitespace-nowrap antialiased
    `;
    tooltip.textContent = pinData.location.info.title;

    // Append the icon and tooltip to the marker element
    markerElement.appendChild(iconOnly);
    markerElement.appendChild(tooltip);

    // Create the marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: markerElement,
    });

    // Add click listener to handle marker selection
    marker.addListener('click', () => {
      if (onSelectPin) {
        onSelectPin(pinData);
      }

      // Reset the previously highlighted pin (if any)
      if (highlightedPin) {
        // Reset the previous pin's background color to the default
        highlightedPin.setIcon({
          url: 'defaultIconPath',  // Reset to original state or change icon as needed
          scaledSize: new google.maps.Size(32, 32), // Adjust size if needed
        });

        // You could also reset the pin's background color here if you want
        const prevIconElement = highlightedPin.getIconElement();
        prevIconElement.className = `${departmentColors['default']} border-2 border-white text-white rounded-lg p-2 shadow-md`;
      }

      // Set the current pin as highlighted and change its background color
      setHighlightedPin(marker);

      // Change the selected pin's background color to a highlighted state
      const iconElement = marker.getIconElement();
      iconElement.className = `${statusClass.replace('200', '700')} border-2 border-white text-white rounded-lg p-2 shadow-lg`;  // Highlight color

      // You can also change the icon size here or use a different icon
      marker.setIcon({
        url: 'highlightedIconPath',  // Optional: Use a different icon for the highlighted state
        scaledSize: new google.maps.Size(40, 40), // Adjust size if needed
      });
    });

    return marker;
  };

  return null;
};

export default ShowPins;
