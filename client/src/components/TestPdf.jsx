import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import GoogleMap from './GoogleMap';
import clustering from 'density-clustering';
import { getDistance } from 'geolib';

export default function TestPdf({ apiKey }) {
  const { filteredPins } = useSelector((state) => state.global);
  const [clusters, setClusters] = useState([]);
  const [groupBy, setGroupBy] = useState('postal'); // 'postal' or 'cluster'
  const [clusterSize, setClusterSize] = useState(1000); // Default cluster size in meters (1 km)

  // Helper function to extract postal codes
  const extractPostalCode = (address) => {
    if (!address) return 'Unknown';
    const match = address.match(/[A-Z]\d[A-Z][ ]?\d[A-Z]\d/i);
    return match ? match[0].toUpperCase().replace(/\s/, '') : 'Unknown';
  };

  // Group pins by postal code
  const groupedPins = filteredPins?.reduce((acc, pin) => {
    const postalCodeFromField = pin.location?.address?.postalCode;
    const fallbackFromAddress = extractPostalCode(pin.location?.address);
    const postalCode = postalCodeFromField || fallbackFromAddress;

    if (!acc[postalCode]) acc[postalCode] = [];
    acc[postalCode].push(pin);
    return acc;
  }, {});

  // Optional: Bounding box calculation (not used directly in the clustering)
  const coordinates = filteredPins?.map(pin => ({
    lat: pin.location?.lat,
    lng: pin.location?.lng
  })).filter(coord => coord.lat != null && coord.lng != null);

  const bounds = coordinates?.reduce((acc, { lat, lng }) => {
    if (lat < acc.minLat) acc.minLat = lat;
    if (lat > acc.maxLat) acc.maxLat = lat;
    if (lng < acc.minLng) acc.minLng = lng;
    if (lng > acc.maxLng) acc.maxLng = lng;
    return acc;
  }, {
    minLat: Infinity,
    maxLat: -Infinity,
    minLng: Infinity,
    maxLng: -Infinity,
  });

  // DBSCAN clustering setup
  useEffect(() => {
    if (!filteredPins || filteredPins.length === 0) return;

    const coords = filteredPins.map(pin => [pin.location?.lat, pin.location?.lng]);
    const dbscan = new clustering.DBSCAN();

    const distanceFn = (a, b) => {
      return getDistance(
        { latitude: a[0], longitude: a[1] },
        { latitude: b[0], longitude: b[1] }
      );
    };

    // Run DBSCAN with the current cluster size
    const result = dbscan.run(coords, clusterSize, 1, distanceFn); // Use clusterSize as epsilon
    const clustered = result.map(cluster =>
      cluster.map(index => filteredPins[index])
    );

    setClusters(clustered);
  }, [filteredPins, clusterSize]);

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
          <option value="postal">Postal Code</option>
          <option value="cluster">Proximity (≤ 1.0 km)</option>
        </select>
      </div>

      {/* Cluster Size Slider */}
      {groupBy === 'cluster' && (
        <div className="mt-4">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Cluster Size (in meters): {clusterSize}</label>
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

      {/* Grouping Display */}
      {groupBy === 'postal' ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Pins Grouped by Postal Code</h2>
          {groupedPins && Object.entries(groupedPins).map(([postalCode, pins]) => (
            <div key={postalCode} className="border border-gray-300 rounded p-3 shadow-sm mb-4">
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
              <div key={i} className="border border-green-400 rounded p-3 shadow-sm mb-4">
                <h3 className="font-semibold text-green-700 mb-2">Cluster {i + 1}</h3>
                <ul className="list-disc list-inside text-sm">
                  {cluster.map((pin, j) => (
                    <li key={j}>
                      {pin.location?.info?.contactName || 'Unnamed Contact'} — 
                      ({pin.location?.address}) ({pin.location?.status})
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No clusters found.</p>
          )}
        </div>
      )}
    </div>
  );
}
