// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "extractText") {
        ApiCall({ sending_page_text: message.content })
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

async function ApiCall(data) {
    const result = await ApiCall_1(data);
    return elaborateOutput(result.response, data.sending_page_text);
}

function elaborateOutput(data, inputText) { 
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
        console.error('Errore nella conversione in JSON:', error);

        // Composizione del JSON finale
        const errorJson = {
            processing_time: "",
            output_date_time: "",
            sent_page_text: inputText,
            LLM_output_short: "ERRORE - LLM HA RISPOSTO IN MANIERA NON COFORME ALLO STANDARD",
            LLM_output_long: "ERRORE",
            general_cat_5: -1,
            specific_cat_10: Object.entries(typeMapping).map(([code, type]) => ({
                code: parseInt(code), // Converte la chiave da stringa a numero
                type: type,
                LMM_output: "ERRORE",
                LMM_rank: -1
            }))
        };
        return errorJson;
    }
}

async function ApiCall_1(data) {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'new-gem',
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
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Errore nella chiamata API:', error.message);
        throw error;  // Rifiuta la promessa in caso di errore
    }
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