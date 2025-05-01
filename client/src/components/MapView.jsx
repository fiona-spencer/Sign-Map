import React from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  Circle,
  Marker,
  Popup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../assets/pin.png'; // ✅ Replace with your icon path

// Define your custom pin icon
const customPinIcon = L.icon({
  iconUrl: pinIcon,
  iconSize: [32, 32], // Width, Height
  iconAnchor: [16, 32], // Where to "pin" the icon on the map
  popupAnchor: [0, -32], // Where the popup appears relative to the icon
});

const MapView = ({ center, zoom, clusters, clusterSize, setMapInstance }) => {
  return (
    <div className="h-[500px] rounded overflow-hidden z-0 relative">
      <MapContainer
        className="h-full w-full rounded-lg z-10"
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        whenCreated={setMapInstance}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          {clusters.length > 0 &&
            clusters.map((cluster, idx) => (
              <LayersControl.Overlay key={idx} name={`Cluster ${idx + 1}`} checked>
                <LayerGroup>
                  <Circle
                    center={cluster[0] ? [cluster[0].location?.lat, cluster[0].location?.lng] : [43.6954, -79.3810]}
                    pathOptions={{ color: 'red', fillColor: 'pink', fillOpacity: 0.5 }}
                    radius={clusterSize * 1.2}
                  />
                  <Marker
                    position={cluster[0] ? [cluster[0].location?.lat, cluster[0].location?.lng] : [43.6954, -79.3810]}
                    icon={L.divIcon({
                      className: 'cluster-index',
                      html: `<div style="background-color: rgba(255, 255, 255, 0.7); padding: 5px 10px; border-radius: 50%; font-size: 16px; color: #000;">${idx + 1}</div>`,
                      iconSize: [30, 30],
                    })}
                  />
                  {cluster.map((pin, pinIdx) => {
                    const { lat, lng } = pin.location || {};
                    if (lat === 0 || lng === 0) return null;
                    return (
                      <Marker key={pinIdx} position={[lat, lng]} icon={customPinIcon}>
                        <Popup>
                          <strong>{pin.location?.info?.contactName || 'Unnamed Contact'}</strong><br />
                          {pin.location?.address}
                        </Popup>
                      </Marker>
                    );
                  })}
                </LayerGroup>
              </LayersControl.Overlay>
            ))}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MapView;
