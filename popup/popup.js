document.addEventListener('DOMContentLoaded', () => {
    const jsonButton = document.getElementById('jsonButton');
    const teamLink = document.getElementById('teamLink');

    /*
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getPageText' }, response => {
            // Risposta ricevuta dall'API
            console.log('API Response:', response.apiResponse);
        });
    });
    */

    jsonButton.addEventListener('click', () => {
        chrome.storage.local.get('processedData', data => {
            const results = data.processedData || [];
            console.log('Data retrieved from storage:', results);
            const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'results.json';
            document.body.appendChild(a); // Necessario per Firefox
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });

    teamLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.open('about_us.html', '_blank');
        window.close();
    });

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

    chrome.storage.local.get('processedData', function(data) {
        if (data.processedData) {
            document.getElementById('output').innerText = JSON.stringify(data.processedData, null, 2);
        } else {
            document.getElementById('output').innerText = 'Nessun dato disponibile.';
        }
    });
    
    // Aggiungi il listener per il pulsante di pulizia
    document.getElementById('clearButton').addEventListener('click', function() {
        // Cancella i dati memorizzati nel browser
        chrome.storage.local.remove('processedData', function() {
            // Aggiorna l'interfaccia utente dopo aver pulito i dati
            document.getElementById('output').innerText = 'Dati cancellati.';
            console.log("Dati cancellati dalla memoria locale.");
        });
    });
    
});