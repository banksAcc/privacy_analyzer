document.addEventListener('DOMContentLoaded', () => {
    
    // Variabile globale per memorizzare i riferimenti ai grafici
    const charts = {};
    
    const jsonButton = document.getElementById('jsonButton');
    const teamLink = document.getElementById('teamLink');
    const moreText = document.getElementById('moreText');
    const infoIcon = document.getElementById('infoIcon');
    const clearButton = document.getElementById('clearButton');
    const pieChart = document.getElementById('pie-chart');

    // Ottieni l'URL della pagina corrente
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentPageUrl = tabs[0].url;

        // Recupera la lista di dati salvata
        chrome.storage.local.get('processedDataList', function (result) {
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
                        }, function (response) {
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
        chrome.storage.local.get('processedDataList', function (result) {
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
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let currentPageUrl = tabs[0].url;

            getCurretPageData(currentPageUrl, function (output) {
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
    clearButton.addEventListener('click', function () {
        // Cancella i dati memorizzati nel browser
        chrome.storage.local.remove('processedDataList', function () {
            //document.getElementById('output').innerText = 'Dati cancellati.';
            console.log("Dati cancellati dalla memoria locale.");
            // Chiudi il popup dell'estensione
            window.close();
        });
    });

    // Gestisci l'evento click sul pieChart
    pieChart.addEventListener('click', () => {
        const typeValue = pieChart.getAttribute('type');

        if (typeValue === 'showPie') {
            pieChart.setAttribute('type', 'showText');
            pieChart.classList.add('fa-comments');
            pieChart.classList.remove('fa-chart-pie');
            hideDisplayBlockInfoForPie(true);

            chrome.storage.local.get('processedDataList', function (result) {
                if (result.processedDataList && result.processedDataList.length > 0) {
                    const processedDataList = result.processedDataList;

                    for (let i = 30; i <= 39; i++) {
                        const chartData = getDataForChart(i - 29, processedDataList);
                        const canvasId = i.toString();
                        const ctx = document.getElementById(canvasId).getContext('2d');

                        // Distruggi il grafico esistente se presente
                        if (charts[canvasId]) {
                            charts[canvasId].destroy();
                        }

                        // Crea un nuovo grafico
                        charts[canvasId] = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels: chartData.labels,
                                datasets: [{
                                    data: chartData.data,
                                    backgroundColor: chartData.backgroundColors,
                                    borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false // Disabilita la legenda
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (tooltipItem) {
                                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        // Ottieni l'URL della pagina corrente
                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            let currentPageUrl = tabs[0].url;

                            // Evidenzia lo spicchio corrispondente
                            highlightChartSlice(currentPageUrl, processedDataList, charts[canvasId], i - 29);
                        });
                    }
                } else {
                    console.log('Nessun dato disponibile nella cache.');
                }
            });

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
                document.getElementById(i + 1).src = '../rank_icons/one_to_three/good_01.jpg';
                break;
            case 2:
                document.getElementById(i + 1).src = '../rank_icons/one_to_three/neutral_02.jpg';
                break;
            case 3:
                document.getElementById(i + 1).src = '../rank_icons/one_to_three/bad_03.jpg';
                break;
            default:
                document.getElementById(i + 1).src = '../rank_icons/one_to_three/no_info.jpg'; // Default icon
                break;
        }
    }

    for (let i = 12; i < 22; i++) {

        document.getElementById(i).innerText = data.specific_cat_10[i - 12].LMM_output

    }

    const pieFather = document.querySelectorAll('.chart-container'); // Seleziona gli elementi da nascondere
    pieFather.forEach(block => {
        block.style.display = 'none';
    });

    switch (data.general_cat_5) {
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
            document.getElementById(11).src = '../rank_icons/one_to_five/classNo.jpg'; // Default icon
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

        const pieFather = document.querySelectorAll('.chart-container'); // Seleziona gli elementi da nascondere
        pieFather.forEach(block => {
            block.style.display = 'flex';
        });

    } else {
        //show the element
        for (let i = 0; i < 10; i++)
            document.getElementById(i + 1).style.display = 'flex';
        for (let i = 12; i < 22; i++)
            document.getElementById(i).style.display = 'flex';

        const pieFather = document.querySelectorAll('.chart-container'); // Seleziona gli elementi da nascondere
        pieFather.forEach(block => {
            block.style.display = 'none';
        });

    }

}

// Funzione per estrarre e preparare i dati per il grafico
function getDataForChart(code, processedDataList) {
    let counts = {
        rank1: 0,
        rank2: 0,
        rank3: 0,
        outOfRange: 0
    };

    let labels = ['Good', 'Neutral', 'Bad', 'No Data'];

    // Conta le occorrenze di ciascun LMM_rank per lo specifico 'code'
    processedDataList.forEach(item => {
        const specificData = item.data.specific_cat_10.find(cat => cat.code === code);
        if (specificData) {
            if (specificData.LMM_rank === 1) {
                counts.rank1++;
            } else if (specificData.LMM_rank === 2) {
                counts.rank2++;
            } else if (specificData.LMM_rank === 3) {
                counts.rank3++;
            } else {
                counts.outOfRange++;
            }
        }
    });

    // Calcola il totale delle occorrenze
    const total = counts.rank1 + counts.rank2 + counts.rank3 + counts.outOfRange;

    // Prepara i dati per il grafico a torta
    const data = [
        ((counts.rank1 / total) * 100).toFixed(0),
        ((counts.rank2 / total) * 100).toFixed(0),
        ((counts.rank3 / total) * 100).toFixed(0),
        ((counts.outOfRange / total) * 100).toFixed(0)
    ];

    const backgroundColors = ['#75B34F', '#979797', '#cf6420', '#c13934'];

    return { data, labels, backgroundColors };
}

function highlightChartSlice(pageUrl, processedDataList, chart, code) {

    let spicificData;
    // Trova l'oggetto che corrisponde all'URL della pagina
    const dataItem = processedDataList.find(item => item.url === pageUrl);

    if (dataItem) {
        // Cerca il tipo nella lista specific_cat_10 usando il code
        const category = dataItem.data.specific_cat_10.find(cat => cat.code === code);
        if (category) {
            spicificData = category;

        } else {
            console.log('Codice non trovato nella lista specific_cat_10 per l\'URL dato.');
            return; // Esci dalla funzione se il codice non è trovato
        }
    } else {
        console.log('URL non trovato nella lista dei dati elaborati.');
        return; // Esci dalla funzione se l'URL non è trovato
    }

    // Step 2: Confronta con i dati del grafico e trova l'indice corrispondente
    let label;

    switch (spicificData.LMM_rank) {
        case 1:
            label = 'Good'
            break;
        case 2:
            label = 'Neutral'
            break;
        case 3:
            label = 'Bad'
            break;
        default:
            label = 'No Data'
    };

    const sliceIndex = chart.data.labels.indexOf(label);

    if (sliceIndex !== -1) {
        // Step 3: Evidenzia lo spicchio modificando il colore del bordo
        chart.data.datasets[0].borderColor[sliceIndex] = '#000000'; // Imposta il colore del bordo a nero
        chart.data.datasets[0].borderWidth[sliceIndex] = 5; // Imposta lo spessore del bordo a 5

        // Aggiorna il grafico per riflettere le modifiche
        chart.update();
    } else {
        console.log('Tipo di dato non trovato nel grafico.');
    }
}