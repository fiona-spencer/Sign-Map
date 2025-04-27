import React from 'react';
import { MapContainer, TileLayer, LayersControl, LayerGroup, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet to use custom divIcon
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react';

const MapView = ({ center, zoom, clusters, setMapInstance }) => {
  return (
    <div className="h-96 rounded overflow-hidden z-0 relative">
      <MapContainer
        className="h-full w-full rounded-lg z-10"
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        whenCreated={setMapInstance} // Set the map instance here
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
                  {/* Circle for the cluster */}
                  <div>

                 
                  <Circle id="exclude-circle"
                    center={cluster[0] ? [cluster[0].location?.lat, cluster[0].location?.lng] : [43.6954, -79.3810]}
                    pathOptions={{ color: 'red', fillColor: 'pink', fillOpacity: 0.5 }}
                    radius={500}
                  />
                  {/* Render the cluster index as a label inside the circle */}
                  <Marker
                    position={cluster[0] ? [cluster[0].location?.lat, cluster[0].location?.lng] : [43.6954, -79.3810]}
                    icon={L.divIcon({
                      className: 'cluster-index',
                      html: `<div style="background-color: rgba(255, 255, 255, 0.7); padding: 5px 10px; border-radius: 50%; font-size: 16px; color: #000;">${idx + 1}</div>`,
                      iconSize: [30, 30],
                    })}
                  />
                   </div>
                  {/* Render the pins inside the cluster */}
                  {cluster.map((pin, pinIdx) => {
                    const { lat, lng } = pin.location || {};
                    if (lat === 0 || lng === 0) return null;
                    return (
                      <Marker key={pinIdx} position={[lat, lng]}>
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
