document.addEventListener('DOMContentLoaded', () => {
    const jsonButton = document.getElementById('jsonButton');
    const teamLink = document.getElementById('teamLink');
    const moreText = document.getElementById('moreText');

    // Ottieni l'URL della pagina corrente
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let currentPageUrl = tabs[0].url;

        // Recupera la lista di dati salvata
        chrome.storage.local.get('processedDataList', function(result) {
            //let outputDiv = document.getElementById('output');
            let processedDataList = result.processedDataList || [];

            // Filtra i dati per l'URL della pagina corrente
            let currentPageData = processedDataList.find(entry => entry.url === currentPageUrl);

            if (currentPageData) {
                updateIconBasedOnGeneralCat(currentPageData.data);
            } else {
                //outputDiv.innerText = 'Nessun dato disponibile per questa pagina.';
            }
        });
    });
    
    //logica per scaricare il file json
    jsonButton.addEventListener('click', () => {
        chrome.storage.local.get('processedDataList', function(result) {
            if (result.processedDataList && result.processedDataList.length > 0) {
                let dataStr = JSON.stringify(result.processedDataList, null, 2);
                let blob = new Blob([dataStr], { type: 'application/json' });
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'processedDataList.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                console.log('Nessun dato da scaricare.');
            }
        });
    });
    
    //mostriamo link alla pagina about us
    teamLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.open('about_us.html', '_blank');
        window.close();
    });
    
    moreText.addEventListener('click', (event) => {
        event.preventDefault();
        window.open('about_us.html', '_blank');
        window.close();
    });

    //mostriamo la posizione dell'utente
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
    
    // Aggiungi il listener per il pulsante di pulizia
    document.getElementById('clearButton').addEventListener('click', function() {
        // Cancella i dati memorizzati nel browser
        chrome.storage.local.remove('processedDataList', function() {
            //document.getElementById('output').innerText = 'Dati cancellati.';
            console.log("Dati cancellati dalla memoria locale.");
        });
    });
    
});

function updateIconBasedOnGeneralCat(data) {

    for (let i = 0; i < 10; i++) {
        switch (data.specific_cat_10[i].LMM_rank) {
            case 1:
                document.getElementById(i+1).src = '../rank_icons/one_to_three/good_01.jpg';
                break;
            case 2:
                document.getElementById(i+1).src = '../rank_icons/one_to_three/neutral_02.jpg';
                break;
            case 3:
                document.getElementById(i+1).src  = '../rank_icons/one_to_three/bad_03.jpg';
                break;  
            default:
                document.getElementById(i+1).src  = '../rank_icons/one_to_three/no_info.jpg'; // Default icon
                break;
        }
    }

    for (let i = 12; i < 22; i++) {

        document.getElementById(i).innerText = data.specific_cat_10[i-12].LMM_output

    }
    switch ( data.general_cat_5) {
        case 1:
            document.getElementById(11).src = '../rank_icons/one_to_five/classA_01.jpg';
            break;
        case 2:
            document.getElementById(11).src = '../rank_icons/one_to_five/classB_02.jpg';
            break;
        case 3:
            document.getElementById(11).src = '../rank_icons/one_to_five/classC_03.jpg';
            break;
        case 4:
            document.getElementById(11).src = '../rank_icons/one_to_five/classD_04.jpg';
            break;
        case 5:
            document.getElementById(11).src = '../rank_icons/one_to_five/classE_05.jpg';
            break;   
        default:
            document.getElementById(11).src= '../rank_icons/one_to_five/classNo.jpg'; // Default icon
            break;
    }
}