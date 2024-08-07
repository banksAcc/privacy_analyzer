document.addEventListener('DOMContentLoaded', () => {
  const jsonButton = document.getElementById('jsonButton');
  jsonButton.addEventListener('click', () => {
      alert('{..JSON..} button clicked!');
  });

  // Fetch and display the location information
  navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const locationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

      fetch(locationUrl)
          .then(response => response.json())
          .then(data => {
              const locationElement = document.getElementById('location');
              const city = data.city || data.locality;
              locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${city}`;
          })
          .catch(error => {
              console.error('Error fetching location data:', error);
              document.getElementById('location').textContent = 'Error fetching location';
          });
  }, error => {
      console.error('Error getting location:', error);
      document.getElementById('location').textContent = 'Location access denied';
  });
});
