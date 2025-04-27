import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import clustering from 'density-clustering';
import { getDistance } from 'geolib';
import { Button } from 'flowbite-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MapView from './mapView'; // Import your MapView component

export default function TestPdf() {
  const { filteredPins } = useSelector((state) => state.global);
  const [clusters, setClusters] = useState([]);
  const [groupBy, setGroupBy] = useState('cluster');
  const [clusterSize, setClusterSize] = useState(1000);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const printRefs = useRef([]);
  const [mapInstance, setMapInstance] = useState(null); // Store map instance in state
  const [mapCenter, setMapCenter] = useState([43.68, -79.34]); // Default center
  const [mapZoom, setMapZoom] = useState(13); // Default zoom level

  const addToRefs = (el) => {
    if (el && !printRefs.current.includes(el)) {
      printRefs.current.push(el);
    }
  };

  const extractPostalCode = (address) => {
    if (!address) return 'Unknown';
    const match = address.match(/[A-Z]\d[A-Z][ ]?\d[A-Z]\d/i);
    return match ? match[0].toUpperCase().replace(/\s/, '') : 'Unknown';
  };

  const groupedPins = filteredPins?.reduce((acc, pin) => {
    const postalCodeFromField = pin.location?.address?.postalCode;
    const fallbackFromAddress = extractPostalCode(pin.location?.address);
    const postalCode = postalCodeFromField || fallbackFromAddress;
    if (!acc[postalCode]) acc[postalCode] = [];
    acc[postalCode].push(pin);
    return acc;
  }, {});

  useEffect(() => {
    if (!filteredPins || filteredPins.length === 0) return;

    const validPins = filteredPins.filter(
      pin => pin.location?.lat !== 0 && pin.location?.lng !== 0
    );

    const coords = validPins.map(pin => [pin.location.lat, pin.location.lng]);
    const dbscan = new clustering.DBSCAN();

    const distanceFn = (a, b) => getDistance(
      { latitude: a[0], longitude: a[1] },
      { latitude: b[0], longitude: b[1] }
    );

    const result = dbscan.run(coords, clusterSize, 1, distanceFn);
    const clustered = result.map(cluster =>
      cluster.map(index => validPins[index])
    );

    setClusters(clustered);
  }, [filteredPins, clusterSize]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setProgress(0);
    console.log("Preparing PDF...");
    await new Promise(resolve => setTimeout(resolve, 500));

    const elements = printRefs.current;
    if (!elements.length) {
      console.warn("No elements found to print.");
      setDownloading(false);
      return;
    }

    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

    for (let i = 0; i < elements.length; i++) {
      try {
        const canvas = await html2canvas(elements[i], {
          scale: 2,
          useCORS: true,
          scrollY: -window.scrollY,
        });

        const data = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        setProgress(Math.round(((i + 1) / elements.length) * 100));
      } catch (error) {
        console.error(`Error rendering element ${i} to canvas:`, error);
        alert("An error occurred while generating the PDF. Check the console for details.");
        setDownloading(false);
        return;
      }
    }

    pdf.save("pins.pdf");
    console.log("PDF saved successfully.");
    setDownloading(false);
  };

  const zoomToCluster = (clusterIndex) => {
    console.log("zoomToCluster triggered for cluster index:", clusterIndex);
  
    const clusterData = clusters; // Use clusters directly, assuming they are in correct order
    if (!clusterData || !clusterData[clusterIndex]) {
      console.log("Cluster data not found.");
      return;
    }
  
    const cluster = clusterData[clusterIndex];
    if (!cluster || cluster.length === 0) {
      console.log("No valid data in this cluster.");
      return;
    }
  
    // Assuming you want to zoom to the center of the first pin in the cluster (you can adjust as needed)
    const { lat, lng } = cluster[0].location;
  
    if (isNaN(lat) || isNaN(lng)) {
      console.log("Invalid lat/lng data.");
      return;
    }
  
    console.log(`Zooming to: [${lat}, ${lng}]`);
  
    // Update map center and zoom level
    setMapCenter([lat, lng]);
    setMapZoom(15); // Adjust zoom level as necessary
  };
  


  return (
    <div className="p-4 space-y-6">
      {/* Grouping Toggle */}
      <div className="flex items-center gap-4">
        <label className="font-semibold text-gray-700 dark:text-gray-200">Group Pins By:</label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="border px-3 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="cluster">Proximity (≤ {clusterSize} m)</option>
          <option value="postal">Postal Code</option>
        </select>
      </div>

      {/* Cluster Size Slider */}
      {groupBy === 'cluster' && (
        <div className="mt-2">
          <label className="font-semibold text-gray-700 dark:text-gray-200">
            Cluster Size (meters): {clusterSize}
          </label>
          <input
            type="range"
            min="200"
            max="2000"
            step="50"
            value={clusterSize}
            onChange={(e) => setClusterSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* 🗺️ Map View */}
      {filteredPins && filteredPins.length > 0 && (
        <MapView
          key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`} // Key to force re-render on zoom or center change
          center={mapCenter} // Pass the center dynamically
          zoom={mapZoom} // Pass the zoom level dynamically
          clusters={clusters} // Pass the clusters data
          setMapInstance={setMapInstance} // Pass the function to store the map instance
        />
      )}

      {/* Zoom Slider */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700 dark:text-gray-200">Zoom Level: {mapZoom}</label>
        <input
          type="range"
          min="1"
          max="20"
          value={mapZoom}
          onChange={(e) => setMapZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 📥 Download Button */}
      <div className="mt-4 flex items-center gap-4">
        {downloading ? (
          <div className="w-12 h-12">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textSize: '28px',
                pathColor: '#1D4ED8',
                textColor: '#1F2937',
              })}
            />
          </div>
        ) : (
          <Button onClick={handleDownloadPdf} color="dark" outline>
            Download PDF of Grouped Pins
          </Button>
        )}
      </div>

      {/* 📦 Clusters or Postal Code Groups */}
      {groupBy === 'postal' ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Pins Grouped by Postal Code</h2>
          {groupedPins && Object.entries(groupedPins).map(([postalCode, pins]) => (
            <div key={postalCode} ref={addToRefs} className="border border-gray-300 rounded p-3 shadow-sm mb-4">
              <h3 className="font-semibold text-blue-600 mb-2">Postal Code: {postalCode}</h3>
              <ul className="list-disc list-inside text-sm">
                {pins.map((pin, index) => (
                  <li key={index}>
                    {pin.location?.info?.contactName || 'Unnamed Contact'} —
                    ({pin.location?.address}) ({pin.location?.status})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
<div>
  <h2 className="text-xl font-bold mb-2">Clusters (≤ {clusterSize} meters)</h2>
  {clusters.length > 0 ? (
    clusters.map((cluster, i) => (
      <div key={i} ref={addToRefs} className="border border-green-400 rounded p-3 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-green-700">Cluster {i + 1}</h3>
          <Button
            onClick={() => zoomToCluster(i)} // Ensure the correct cluster index is passed here
            className="text-sm border-2"
            color="red"
          >
            Zoom to Cluster {i + 1} {/* Display cluster number */}
          </Button>
        </div>
        <ul className="list-disc list-inside text-sm">
          {cluster.map((pin, j) => (
            <li key={j}>
              {pin.location?.info?.contactName || 'Unnamed Contact'} —
              {pin.location?.address} ({pin.location?.status})
            </li>
          ))}
        </ul>
      </div>
    ))
  ) : (
    <p>No clusters found based on the selected radius.</p>
  )}
</div>

      
      )}
    </div>
  );
}
