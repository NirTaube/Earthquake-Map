// Fetch earthquake data from the USGS API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    // Extract the necessary information from the GeoJSON data
    const earthquakes = data.features.map(feature => {
      return {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        magnitude: feature.properties.mag,
        depth: feature.geometry.coordinates[2]
      };
    });

    // Create the Leaflet map
    var map = L.map('map').setView([0, 0], 2);

    // Add tile layer (replace 'mapbox/streets-v11' with your desired tile layer)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Define the marker icons based on magnitude and depth
    function getMarkerIcon(magnitude) {
      return L.icon({
        iconUrl: 'marker.png', // Replace with your marker icon image
        iconSize: [magnitude * 5, magnitude * 5],
        iconAnchor: [magnitude * 2.5, magnitude * 2.5]
      });
    }

    // Plot the earthquakes on the map
    for (var i = 0; i < earthquakes.length; i++) {
      var earthquake = earthquakes[i];
      var marker = L.marker([earthquake.lat, earthquake.lng], { icon: getMarkerIcon(earthquake.magnitude) }).addTo(map);
      marker.bindPopup('Magnitude: ' + earthquake.magnitude + '<br>Depth: ' + earthquake.depth);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
