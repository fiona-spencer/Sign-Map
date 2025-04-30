import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import clustering from 'density-clustering';
import { getDistance } from 'geolib';
import { Button } from 'flowbite-react';
import 'react-circular-progressbar/dist/styles.css';
import MapView from './mapView'; // Import your MapView component
import { HiCloudDownload, HiZoomIn,  } from 'react-icons/hi';

export default function TestPdf({newRef}) {
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
  // useEffect(() => {
  //   // Example of adding some content to printRefs (e.g., if you want to capture a ref)
  //   // You can also conditionally capture multiple elements if needed
  //   newRef.current.push(document.getElementById('someElementId')); // Pushing element reference
  // }, [newRef]);
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
<div className="p-4 px-8 space-y-6 rounded-lg shadow-sm border px-6 bg-[#ffffff7d] pb-6  dark:bg-[#148249b3] shadow-xl rounded-lg mt-4" id="someElementId" ref={newRef.current}>
  {/* Grouping Toggle */}
  <div className="flex justify-between items-center">
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

    {/* 📥 Download Button
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
        <div className="px-4">
          <Button
            className="flex items-center gap-3"
            color="light"
            
            onClick={handleDownloadPdf}
          >
            Download PDF of Grouped Pins
            <HiCloudDownload className="h-5 w-5  ml-2" />
          </Button>
        </div>
      )}
    </div> */}
</div>


      {/* Cluster Size Slider */}
      {groupBy === 'cluster' && (
            <div className="mt-2 flex items-center justify-center">
        <label className="font-extrabold text-red-100 bg-red-700 rounded-xl px-3 py-1 dark:text-gray-200 mr-9">
            Cluster Size (meters): {clusterSize}
          </label>
          <input
            type="range"
            min="200"
            max="2000"
            step="50"
            value={clusterSize}
            onChange={(e) => setClusterSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider max-w-3xl"
          />
        </div>
      )}

     

      {/* Zoom Slider */}
      <div className="mt-2 flex items-center justify-center">
      <label className="font-extrabold text-yellow-50 bg-yellow-400 rounded-xl dark:text-gray-200 mr-9 py-1 px-16">Zoom Level: {mapZoom}</label>
      <input id="default-range" 
          type="range" 
          min="1"
          max="20"
          value={mapZoom}
          onChange={(e) => setMapZoom(Number(e.target.value))}
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider max-w-3xl"/>
      </div>
 {/* 🗺️ Map View */}
 {filteredPins && filteredPins.length > 0 && (
  <div ref={addToRefs}>

        <MapView
          key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`} // Key to force re-render on zoom or center change
          center={mapCenter} // Pass the center dynamically
          zoom={mapZoom} // Pass the zoom level dynamically
          clusters={clusters} // Pass the clusters data
          clusterSize={clusterSize}
          setMapInstance={setMapInstance} // Pass the function to store the map instance
        />
  </div>

      )}
   
      {/* 📦 Clusters or Postal Code Groups */}
      {groupBy === 'postal' ? (
        <div>
  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Pins Grouped by Postal Code</h2>
  {groupedPins && Object.entries(groupedPins).map(([postalCode, pins]) => (
    <div
      key={postalCode}
      ref={addToRefs}
      className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 mb-6"
    >
      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
        Postal Code: {postalCode}
      </h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
        {pins.map((pin, index) => (
          <li key={index} className="flex flex-wrap gap-1 items-center">
            <span className="font-bold">{pin.location?.info?.contactName || 'Unnamed Contact'} </span>
            <span>— ({pin.location?.address})</span>
            {pin.location?.status && (
              <span
                className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${getStatusClass(pin.location.status)}`}
              >
                {pin.location.status}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

      ) : (
<div className="max-w-5xl mx-auto">
<h2 className="text-xl font-bold mb-4">Clusters (≤ {clusterSize} meters)</h2>
  {clusters.length > 0 ? (
    clusters.map((cluster, i) => (
      <div
        key={i}
        ref={addToRefs}
        className="border-2 border-green-500 rounded p-4 shadow-sm mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-xl bg-green-600 p-3 rounded-lg text-green-100">
            Cluster {i + 1}
          </h3>
          <Button
            onClick={() => {
              zoomToCluster(i);  // Ensure the correct cluster index is passed here
              window.scrollTo({
                top: 1650,
                behavior: 'smooth', // Smooth scrolling animation
              });
            }}
            className="text-sm font-bold text-red-600 bg-transparent outline-none rounded-md hover:bg-red-100 transition-colors"
            color='red'
          >
            <HiZoomIn className="h-5 w-5 mr-2" />
            Zoom to Cluster {i + 1}
          </Button>
        </div>

        <ul className="list-insidefont-medium text-xs bg-gray-100 rounded-md p-2 pt-4 shadow-md hover:shadow-lg transition-shadow duration-300">
          {cluster.map((pin, j) => (
            <li
              key={j}
              className="hover:bg-gray-200 rounded-md flex py-1 px-2 transition-colors duration-200"
            >
              <div className="font-bold text-gray-800 pr-1">
                {pin.location?.info?.contactName || 'Unnamed Contact'}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
  {pin.location?.address || 'No address provided'}
  {pin.location?.status && (
    <span className={`text-xs px-2 ml-1 rounded font-medium ${getStatusClass(pin.location.status)}`}>
      ({pin.location.status})
    </span>
  )}
</div>

            </li>
          ))}
        </ul>
      </div>
    ))
  ) : (
    <p className="text-gray-600">No clusters found based on the selected radius.</p>
  )}
</div>


      
      )}
    </div>
  );
}
