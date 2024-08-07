document.addEventListener('DOMContentLoaded', () => {
    const jsonButton = document.getElementById('jsonButton');
    const previewElement = document.getElementById('textPreview');

    // Richiedi il testo della pagina al content script
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getPageText' }, response => {
            const text = response.text;
            const maxLength = 200; // Imposta la lunghezza massima dell'anteprima
            previewElement.textContent = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        });
    });

    jsonButton.addEventListener('click', () => {
        // Apri una nuova scheda con il testo completo
        chrome.tabs.create({ url: 'popup/text_viewer.html' }, tab => {
            chrome.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    chrome.tabs.sendMessage(tabId, { action: 'setFullText', text: previewElement.textContent });
                    chrome.tabs.onUpdated.removeListener(onUpdated);
                }
            });
        });
    });

    const teamLink = document.getElementById('teamLink');
    teamLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.open('about_us.html', '_blank');
        window.close();
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
