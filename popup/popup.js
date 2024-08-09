document.addEventListener('DOMContentLoaded', () => {
    const jsonButton = document.getElementById('jsonButton');
    const teamLink = document.getElementById('teamLink');
    const moreText = document.getElementById('moreText');
    const infoIcon = document.getElementById('infoIcon');
    const clearButton = document.getElementById('clearButton');
    const pieChart = document.getElementById('pie-chart');


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
                updateIconPageNotEvaluated();
                chrome.tabs.sendMessage(tabs[0].id, { action: "getContent" }, function (response) {
                    let currentPageUrl = tabs[0].url;
                    try {
                        chrome.runtime.sendMessage({
                        type: "extractText",
                        content: response.content,
                            url: currentPageUrl // Ottieni l'URL della scheda corrente
                        },function (response) {
                        // Richiesta di estrazione completata, ora possiamo aggiornare le icone
                            if (response && response.success && response.data) {
                                updateIconBasedOnGeneralCat(response.data);
                            } else {
                                console.error("Errore durante l'elaborazione dei dati.");
                            }
                        });
                    } catch (error) {
                        console.log("Url pagina non definito: ", error.message);
                        updateIconPageNotEvaluated();
                    }
                });
            }
        });
    });

    infoIcon.addEventListener('click', function () {
        var menu = document.getElementById('fanMenu');
        menu.classList.toggle('show');
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

    //gestiamo visualizzazione del testo completo del LLM
    moreText.addEventListener('click', (event) => {

        const blocksToModifyVisibility = document.querySelectorAll('.container'); // Seleziona gli elementi da nascondere
        let currentDisplay;
        blocksToModifyVisibility.forEach(block => {
            // Ottieni lo stile computato dell'elemento
            currentDisplay = window.getComputedStyle(block).display;
            
            // Alterna la visibilità
            if (currentDisplay === 'none') {
                block.style.display = 'block'; // Mostra l'elemento
            } else {
                block.style.display = 'none'; // Nasconde l'elemento
            }
        });
        if (currentDisplay == 'none')
            document.getElementById("pie-chart").style.display = "block";
        else
        document.getElementById("pie-chart").style.display = "none";
            
        // Ottieni l'URL della pagina corrente
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let currentPageUrl = tabs[0].url;
        
            getCurretPageData(currentPageUrl, function(output) {
                if (output) {
                    if (document.getElementById(25).innerText == output.data.LLM_output_short) {
                        document.getElementById(25).innerText = output.data.LLM_output_long;
                        document.getElementById("moreText").innerText = "Less...";
                    }
                    else {
                        document.getElementById(25).innerText = output.data.LLM_output_short;
                        document.getElementById("moreText").innerText = "More...";
                    }
                } else {
                    updateIconPageNotEvaluated();
                    console.log('Nessun dato disponibile per questa pagina.');
                }
            });
        });
    });

    // Aggiungi il listener per il pulsante di pulizia
    clearButton.addEventListener('click', function() {
        // Cancella i dati memorizzati nel browser
        chrome.storage.local.remove('processedDataList', function() {
            //document.getElementById('output').innerText = 'Dati cancellati.';
            console.log("Dati cancellati dalla memoria locale.");
            // Chiudi il popup dell'estensione
            window.close();
        });
    });

    // Aggiungi il listener per il pulsante di pie chart
    pieChart.addEventListener('click', () => {
        const typeValue = pieChart.getAttribute('type');
        console.log("putno 1");
        // Puoi anche gestire logica basata sul valore 'type'
        if (typeValue === 'showPie') {
            pieChart.setAttribute('type', 'showText');
            pieChart.classList.add('fa-comments');
            pieChart.classList.remove('fa-chart-pie');
            hideDisplayBlockInfoForPie(true);
        } else {
            pieChart.setAttribute('type', 'showPie');
            pieChart.classList.add('fa-chart-pie');
            pieChart.classList.remove('fa-comments');
            hideDisplayBlockInfoForPie(false);
        }
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
    const blocksToModifyVisibility = document.querySelectorAll('.container'); // Seleziona gli elementi da nascondere
    blocksToModifyVisibility.forEach(block => {
        block.style.display = 'block';
    });

    document.getElementById("pie-chart").style.display = 'block';
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById(25).innerText = data.LLM_output_short;
    document.getElementById("moreText").style.display = 'block';
}

function updateIconPageNotEvaluated() {
    const blocksToModifyVisibility = document.querySelectorAll('.container'); // Seleziona gli elementi da nascondere
    blocksToModifyVisibility.forEach(block => {
        block.style.display = 'none';
    });

    document.getElementById("pie-chart").style.display = 'none';
    document.getElementById("moreText").style.display = 'none';
    document.getElementById(11).src = '../rank_icons/one_to_five/classNo.jpg'; // Default icon
    document.getElementById("loading-spinner").style.display = "block";
    document.getElementById(25).innerText = "The analysis did not give valid results. Reload the page or reopen the popup. If the problem persists, it may be a data problem on this page.";

}

function getCurretPageData(currentPageUrl, callback) {
    chrome.storage.local.get('processedDataList', function (result) {
        let processedDataList = result.processedDataList || [];
        // Filtra i dati per l'URL della pagina corrente
        let currentPageData = processedDataList.find(entry => entry.url === currentPageUrl);
        callback(currentPageData); // Passa i dati alla callback
    });
}

function hideDisplayBlockInfoForPie(hide) {
    if (hide) {
        //hide the element
        for (let i = 0; i < 10; i++) 
            document.getElementById(i + 1).style.display = 'none';
        for (let i = 12; i < 22; i++)
            document.getElementById(i).style.display = 'none';
    } else {
        //show the element
        for (let i = 0; i < 10; i++) 
            document.getElementById(i + 1).style.display = 'flex';
        for (let i = 12; i < 22; i++)
            document.getElementById(i).style.display = 'flex';
    }
    
}