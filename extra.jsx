const initMap = async () => {
    if (!mapRef.current) return;
  
    try {
      const { Map } = await google.maps.importLibrary('maps');
      const map = new Map(mapRef.current, {
        center: { lat: 43.7, lng: -79.42 }, // Centered on Toronto
        zoom: 12,
        mapId: '42c8848d94ad7219', // Replace with your Map ID
      });
  
      // Use the loadGeoJson method directly, assuming your GeoJSON is in the `public` folder
      map.data.loadGeoJson('/toronto_geo.geojson');
  
      // Style the polygons
      map.data.setStyle((feature) => ({
        fillColor: 'blue',
        fillOpacity: 0.4,
        strokeWeight: 1,
      }));
  
      // Add event listener for clicks on polygons
      map.data.addListener('click', (event) => {
        const postalCode = event.feature.getProperty('PC_NAME');
        alert(`Postal Code: ${postalCode}`);
      });
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  };
  