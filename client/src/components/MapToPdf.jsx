import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function MapToPdf({ filteredPins = [], apiKey }) {
  const mapRefs = useRef([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const mapContainerRefs = useRef([]);
  const hiddenMapRef = useRef(null);

  // Ensure pins update correctly
  useEffect(() => {
    mapRefs.current = [];
    mapContainerRefs.current = [];
  }, [filteredPins]);

  const addToRefs = (el, containerEl) => {
    if (el && !mapRefs.current.includes(el)) {
      mapRefs.current.push(el);
    }
    if (containerEl && !mapContainerRefs.current.includes(containerEl)) {
      mapContainerRefs.current.push(containerEl);
    }
  };

  const loadMapForPin = async (el, pin) => {
    // if (!window.google || !el) return;

    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    new Map(el, {
      center: { lat: pin.location.lat, lng: pin.location.lng },
      zoom: 10,
      disableDefaultUI: true,
      mapId: '42c8848d94ad7219',
    });

    new AdvancedMarkerElement({
      map: el.__gm,
      position: { lat: pin.location.lat, lng: pin.location.lng },
    });
  };

  const handleGeneratePdf = async () => {
    if (!filteredPins.length) return;
  
    setIsGenerating(true);
    setProgress(0);
  
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });
  
    for (let i = 0; i < filteredPins.length; i++) {
      const pin = filteredPins[i];
  
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '600px';
      mapDiv.style.height = '400px';
      hiddenMapRef.current.appendChild(mapDiv);
  
      await loadMapForPin(mapDiv, pin);
  
      await new Promise((res) => setTimeout(res, 1500)); // wait for map to render
  
      // Capture map screenshot with html2canvas
      const canvas = await html2canvas(mapDiv, { scale: 2 });
      const imgData = canvas.toDataURL('image/png'); // Ensure it's PNG
  
      // Check the generated image data
      if (!imgData || !imgData.startsWith('data:image/png')) {
        console.error('Invalid image data');
        continue;
      }
  
      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
  
      if (i > 0) pdf.addPage(); // Add a new page if it's not the first pin
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
      mapDiv.remove(); // Clean up the map div
  
      setProgress(Math.round(((i + 1) / filteredPins.length) * 100));
    }
  
    pdf.save('zoomed-pins.pdf');
    setIsGenerating(false);
  };
  

  return (
    <div className="my-6 space-y-4">
      {isGenerating ? (
        <div className="flex flex-col items-center gap-2">
          <div style={{ width: 80, height: 80 }}>
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: '#2563eb',
                textColor: '#111827',
                trailColor: '#e5e7eb',
              })}
            />
          </div>
          <p className="text-sm text-gray-600">Generating PDF...</p>
        </div>
      ) : (
        <Button onClick={handleGeneratePdf}>
          Generate Map PDF
        </Button>
      )}

      {/* Hidden map container */}
      <div ref={hiddenMapRef} style={{ display: 'none' }}></div>
    </div>
  );
}
