// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "extractText") {
        mockApiCall({ sending_page_text: message.content })
            .then(data => {
                // Ottieni l'URL della pagina corrente
                let currentPageUrl = message.url || (sender.tab ? sender.tab.url : '');

                // Recupera la lista corrente dal chrome.storage.local
                chrome.storage.local.get({ processedDataList: [] }, function (result) {
                    let processedDataList = result.processedDataList;

                    // Trova l'indice dell'elemento con lo stesso URL
                    const existingIndex = processedDataList.findIndex(item => item.url === currentPageUrl);

                    if (existingIndex !== -1) {
                        // L'URL esiste già, sostituisci i dati con quelli più recenti
                        processedDataList[existingIndex].data = data;
                        console.log(`Dati aggiornati per l'URL: ${currentPageUrl}`);
                    } else {
                        // L'URL non esiste, aggiungi i nuovi dati
                        processedDataList.push({
                            url: currentPageUrl,
                            data: data
                        });
                        console.log("Nuovi dati aggiunti alla lista.");
                    }

                    // Salva la lista aggiornata nella memoria locale
                    chrome.storage.local.set({ processedDataList: processedDataList }, () => {
                        console.log("Dati memorizzati nella memoria locale.");
                        // Rispondi al content script con i dati elaborati
                        sendResponse({ success: true, data: data });
                    });
                });
            })
            .catch(error => {
                console.error('Errore nella chiamata mock:', error);
                sendResponse({ success: false, error: error });
            });
        // Indica che risponderai in modo asincrono
        return true;
    }
});

function ApiCall(data) {
    chrome.runtime.sendMessage({
        command: 'callApi',
        data: data
    }, (response) => {
        if (response.status === 'success') {
            return response.result;
        } else {
            console.log('Errore:', response.message);
        }
    });
}

function mockApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                processing_time: "2.5",
                output_date_time: new Date().toISOString(),
                sent_page_text: data.sending_page_text,
                LLM_output_short: "La primavera è finalmente arrivata, portando con sé fiori colorati e giornate più lunghe. È il momento ideale per passeggiate all'aria aperta e picnic nel parco. Non dimenticare di indossare occhiali da sole e protezione solare per goderti al massimo la stagione!",
                LLM_output_long: "La sostenibilità è diventata un tema cruciale nel contesto",
                general_cat_5: 1,
                specific_cat_10: [
                    {
                        code: 1,
                        type: "First Party Collection/Use",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 2
                    },
                    {
                        code: 2,
                        type: "Third Party Sharing/Collection",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 3
                    },
                    {
                        code: 3,
                        type: "User Choice/Control",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 2
                    },
                    {
                        code: 4,
                        type: "User Access, Edit, & Deletion",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 1
                    },
                    {
                        code: 5,
                        type: "Data Retention",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 4
                    },
                    {
                        code: 6,
                        type: "Data Security",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 4
                    },
                    {
                        code: 7,
                        type: "Policy Change",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 2
                    },
                    {
                        code: 8,
                        type: "Do Not Track",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 1
                    },
                    {
                        code: 9,
                        type: "International & Specific Audiences",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 4
                    },
                    {
                        code: 10,
                        type: "Other",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 3
                    }
                ]
            });
        }, 10000); // Simula un ritardo di 10 secondo
    });
}