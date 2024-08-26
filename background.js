// Dichiarazione di una variabile globale
let sessionData = {};

browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

    // Ottieni l'URL della pagina che ha inviato il messaggio
    let sendingPageUrl = sender.url || (sender.tab ? sender.tab.url : '');

    // Dopo l'estrazione testo della pagina viene chiamata l'API ollama e viene salvato l'output
    if (message.type === "extractText") {
        if (await getConfigValue('useMockApi')) {
            mockApiCall({ sending_page_text: message.content })
                .then(data => {
                    // Ottieni l'URL della pagina corrente
                    let currentPageUrl = message.url || (sender.tab ? sender.tab.url : '');

                    // Recupera la lista corrente dal browser.storage.local
                    browser.storage.local.get({ processedDataList: [] }, function (result) {
                        let processedDataList = result.processedDataList;

                        // Trova l'indice dell'elemento con lo stesso URL
                        const existingIndex = processedDataList.findIndex(item => item.url === currentPageUrl);

                        if (existingIndex !== -1) {
                            // L'URL esiste già, sostituisci i dati con quelli più recenti
                            processedDataList[existingIndex].data = data;
                            console.log(`Dati aggiornati per l'URL (nuovo): ${currentPageUrl}`);
                        } else {
                            // L'URL non esiste, aggiungi i nuovi dati
                            processedDataList.push({
                                url: currentPageUrl,
                                data: data
                            });
                            console.log("Nuovi dati aggiunti alla lista.");
                        }

                        // Salva la lista aggiornata nella memoria locale
                        browser.storage.local.set({ processedDataList: processedDataList }, () => {
                            console.log("Dati memorizzati nella memoria locale.");
                            // Rispondi al content script con i dati elaborati
                            sendResponse({ success: true, data: data });
                        });
                    });
                })
                .catch(error => {
                    console.error('Errore nella chiamata API ', error);
                    sendResponse({ success: false, error: error });
                });

        } else {
            CallAPI({ sending_page_text: message.content }, sendingPageUrl, false)
                .then(data => {

                    if (!data) {
                        sendResponse({ success: false, error: "doppia chiamata" });
                        return
                    }

                    // Ottieni l'URL della pagina corrente
                    let currentPageUrl = message.url || (sender.tab ? sender.tab.url : '');

                    // Recupera la lista corrente dal browser.storage.local
                    browser.storage.local.get({ processedDataList: [] }, function (result) {
                        let processedDataList = result.processedDataList;

                        // Trova l'indice dell'elemento con lo stesso URL
                        const existingIndex = processedDataList.findIndex(item => item.url === currentPageUrl);

                        if (existingIndex !== -1) {
                            // L'URL esiste già, sostituisci i dati con quelli più recenti solo se sono dati validi
                            if (data.LLM_output_long != "ERRORE") {
                                processedDataList[existingIndex].data = data;
                                console.log(`Dati aggiornati per l'URL (non nuovo): ${currentPageUrl}`);
                            } else {
                                console.log(`Dati elaborati per l'URL: ${currentPageUrl} non validi, non aggiorno! `);
                            }
                        } else {
                            // L'URL non esiste, aggiungi i nuovi dati
                            processedDataList.push({
                                url: currentPageUrl,
                                data: data
                            });
                            console.log("Nuovi dati aggiunti alla lista.");
                        }

                        // Salva la lista aggiornata nella memoria locale
                        browser.storage.local.set({ processedDataList: processedDataList }, () => {
                            console.log("Dati memorizzati nella memoria locale.");
                            // Rispondi al content script con i dati elaborati
                            sendResponse({ success: true, data: data });
                        });
                    });
                })
                .catch(error => {
                    console.error('Errore nella chiamata API ', error);
                    sendResponse({ success: false, error: error });
                });

        }

        // Indica che risponderai in modo asincrono
        return true;
    };

    // Chiamata per le variabi d'ambiente
    if (message.action === "envVar") {
        await getConfigValue(message.data).then(result => {
            sendResponse({ result: result });
        }).catch(error => {
            sendResponse({ error: error.message });
        });

        // Indica che la risposta sarà inviata in modo asincrono
        return true;
    };

    // Chiamata per fare il prompt engineering
    if (message.type === "call_LLM_Api") {
        const data = message.data; 
        const site = message.site;

        console.log("Richiesta ricevuta per la chiamata all'Api");

        (async () => {
            try {
                saveIsLoading(true);

                console.log("Chiamata alla funzione CallAPI...");
                const apiResult = await CallAPI(data, site, false); // Chiamata alla funzione API
                
                saveIsLoading(false);

                // Invia la risposta direttamente con sendResponse
                console.log("Invio della risposta...", apiResult);
                sendResponse({
                    result: apiResult // Usa il risultato elaborato dalla funzione API
                });
            } catch (error) {
                saveIsLoading(false);
                console.error("Errore nella logica asincrona:", error);
                sendResponse({
                    error: error.message
                });
            } finally {

                // Questo viene eseguito indipendentemente dal successo o dal fallimento
                saveIsLoading(false);
            }
        })();

        // Indica che la risposta sarà gestita in modo asincrono
        return true;
    };

});

// Reset isLoading al riavvio dell'estensione
browser.runtime.onStartup.addListener(() => {
    // Azzera il valore di isLoading
    saveIsLoading(false);
});

// Se l'estensione viene ricaricata:
browser.runtime.onInstalled.addListener((details) => {
    saveIsLoading(false);
});

// Questa è la funzione da chiamare per l'api, cerca di restituire un json come in LLM/Mod_output.json
async function CallAPI(data, site, enableDoubleSite) {
    const result = await ApiCall(data, site, enableDoubleSite);
    return elaborateOutput(result.response, data.sending_page_text, result.skipped);
}

// Qui avviene la chiama fisica all'api, generalmente non è necessario usare questa funzione, usare CallAPI 
async function ApiCall(data, site, enableDoubleSite) {
    try {
        // Controlla se una chiamata API per questo sito è già in corso
        if (sessionData[site] && !sessionData[site].isComplete && !enableDoubleSite) {
            console.log(`Chiamata API già in corso per il sito: ${site}. Chiamata ignorata.`);
            return { skipped: true, message: "API call already in progress for this site." };
        }

        // Imposta il flag iniziale nel sessionData per indicare che la chiamata è iniziata
        if (!enableDoubleSite)
            sessionData[site] = {
                isComplete: false,
                site: site
            };

        const response = await fetch(await getConfigValue('apiUrl'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: await getConfigValue('modelName'),
                prompt: data.sending_page_text,
                stream: false,
                options: {
                    temperature: 2
                },
                format: 'json',
                keep_alive: 100000
            })
        });

        if (!response.ok) {
            // Elimina l'entry corrispondente da sessionData in caso di errore
            if (!enableDoubleSite)
                delete sessionData[site];

            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const result = await response.json();

        // Imposta il flag nel sessionData per indicare che la chiamata è completata
        if (!enableDoubleSite)
            sessionData[site].isComplete = true;

        return result;
    } catch (error) {

        // Elimina l'entry corrispondente da sessionData in caso di errore
        if (!enableDoubleSite)
            delete sessionData[site];

        console.error('Errore nella chiamata API', error.message);
        throw error;  // Rifiuta la promessa in caso di errore
    }
}

// Funzione per elaborare il testo dell'api e restituire un output json ben formattato
function elaborateOutput(data, inputText, skipped) {
    if (skipped) {
        return false;
    }
    // Mappatura dei tipi basati sui codici
    const typeMapping = {
        1: "First Party Collection/Use",
        2: "Third Party Sharing/Collection",
        3: "User Choice/Control",
        4: "User Access, Edit, & Deletion",
        5: "Data Retention",
        6: "Data Security",
        7: "Policy Change",
        8: "Do Not Track",
        9: "International & Specific Audiences",
        10: "Other"
    };

    try {
        // 1. Rimuovi i caratteri di a capo e gli escape
        // Usa il metodo replace per rimuovere \n e \\
        const cleanedData = data
            .replace(/\\n/g, '')  // Rimuove i caratteri di a capo \n
            .replace(/\\(.)/g, '$1'); // Rimuove gli escape \

        // 2. Converte la stringa in JSON
        const jsonData = JSON.parse(cleanedData);

        // Composizione del JSON finale
        const finalJson = {
            processing_time: "",
            output_date_time: "",
            sent_page_text: inputText,
            LLM_output_short: jsonData.LLM_output_long.slice(0, 250),
            LLM_output_long: jsonData.LLM_output_long,
            general_cat_5: jsonData.general_cat_5,
            specific_cat_10: jsonData.specific_cat_10.map(item => ({
                code: item.code,
                type: typeMapping[item.code] || "Unknown",
                LMM_output: item.LMM_output,
                LMM_rank: item.LMM_rank
            }))
        };

        return finalJson;

    } catch (error) {

        // Gestisci eventuali errori nella conversione JSON
        console.log('Errore nella conversione in JSON:', error);

        // Composizione del JSON finale
        const errorJson = {
            processing_time: "",
            output_date_time: "",
            sent_page_text: inputText,
            LLM_output_short: "ERRORE - LLM HA RISPOSTO IN MANIERA NON CONFORME ALLO STANDARD",
            LLM_output_long: "ERRORE",
            general_cat_5: -1,
            specific_cat_10: Object.entries(typeMapping).map(([code, type]) => ({
                code: parseInt(code), // Converte la chiave da stringa a numero
                type: type,
                LMM_output: "ERRORE",
                LMM_rank: -1
            }))
        };

        //console.log(errorJson);
        return errorJson;
    }
}

// Chiamata finta per testare il sistema, riestituisce dati casuali sui punteggi
function mockApiCall(data) {

    // Funzione per non avere valori sempre uguali e poter testare bene l'estensione
    function getRandomInt(min, max) {
        // Assicurati che min e max siano numeri interi e min sia minore o uguale a max
        min = Math.ceil(min);
        max = Math.floor(max);

        // Genera un numero intero casuale tra min e max inclusi
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                processing_time: "2.5",
                output_date_time: new Date().toISOString(),
                sent_page_text: data.sending_page_text,
                LLM_output_short: "La primavera è finalmente arrivata, portando con sé fiori colorati e giornate più lunghe. È il momento ideale per passeggiate all'aria aperta e picnic nel parco. Non dimenticare di indossare occhiali da sole e protezione solare per goderti al massimo la stagione!",
                LLM_output_long: "La sostenibilità è diventata un tema cruciale nel contesto",
                general_cat_5: getRandomInt(0, 5),
                specific_cat_10: [
                    {
                        code: 1,
                        type: "First Party Collection/Use",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 2,
                        type: "Third Party Sharing/Collection",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 3,
                        type: "User Choice/Control",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 4,
                        type: "User Access, Edit, & Deletion",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 5,
                        type: "Data Retention",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 6,
                        type: "Data Security",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 7,
                        type: "Policy Change",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 8,
                        type: "Do Not Track",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 9,
                        type: "International & Specific Audiences",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    },
                    {
                        code: 10,
                        type: "Other",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: getRandomInt(0, 3)
                    }
                ]
            });
        }, 1000); // Simula un ritardo di 1 secondo
    });
}

// Funzione per ottenere una variabile di configurazione specifica
async function getConfigValue(key) {
    return loadConfig().then(config => config[key]);
}

// Funzione per caricare la configurazione
async function loadConfig() {
    return fetch(browser.runtime.getURL('config.json'))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

// Funzione per impostare lo stato di loading
function saveIsLoading(isLoading) {
    return new Promise((resolve, reject) => {
        browser.storage.local.set({ isLoading: isLoading }).then(() => {
            resolve();
        }).catch((error) => {
            reject(new Error(error));
        });
    });
}