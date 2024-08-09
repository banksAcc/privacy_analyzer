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

function mockApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                processing_time: "2.5",
                output_date_time: new Date().toISOString(),
                sent_page_text: data.sending_page_text,
                LLM_output_short: "La primavera è finalmente arrivata, portando con sé fiori colorati e giornate più lunghe. È il momento ideale per passeggiate all'aria aperta e picnic nel parco. Non dimenticare di indossare occhiali da sole e protezione solare per goderti al massimo la stagione!",
                LLM_output_long: "La sostenibilità è diventata un tema cruciale nel contesto moderno, con un'attenzione crescente verso la riduzione dell'impatto ambientale e l'uso responsabile delle risorse. È un concetto che si estende a vari aspetti della nostra vita, dalle scelte quotidiane ai processi industriali, e implica un impegno collettivo per garantire un futuro più verde e vivibile. Una delle principali sfide della sostenibilità è ridurre l'impronta ecologica. Questo concetto riguarda il grado con cui le attività umane influenzano l'ambiente. L'uso eccessivo di risorse naturali, l'inquinamento e la produzione di rifiuti sono fattori che contribuiscono significativamente all'impronta ecologica. Per affrontare questi problemi, è fondamentale adottare pratiche più sostenibili, come l’efficienza energetica e l'uso di fonti di energia rinnovabile. Nel settore dell'edilizia, ad esempio, la sostenibilità si traduce nella progettazione e costruzione di edifici ecocompatibili. Gli edifici verdi sono progettati per ridurre il consumo di energia, minimizzare l'impatto ambientale e migliorare il benessere degli occupanti. Questo può includere l’uso di materiali sostenibili, sistemi di riscaldamento e raffreddamento ad alta efficienza e tecniche di costruzione che riducono gli sprechi. Il cambiamento delle abitudini di consumo è un altro aspetto cruciale. Adottare uno stile di vita a basso impatto, come scegliere prodotti realizzati con materiali riciclati e ridurre l'uso della plastica monouso, può fare una grande differenza. Inoltre, l'acquisto di cibi locali e stagionali non solo riduce le emissioni di carbonio associate al trasporto degli alimenti, ma supporta anche le economie locali. L'educazione e la sensibilizzazione giocano un ruolo fondamentale nella promozione della sostenibilità. È essenziale che le persone comprendano l'importanza delle pratiche sostenibili e come le loro scelte quotidiane influenzano l'ambiente. Le scuole e le università, insieme alle organizzazioni non governative, sono importanti per informare e motivare le persone a prendere decisioni più ecologiche. La tecnologia ha un impatto significativo sulla sostenibilità. Le innovazioni tecnologiche possono fornire soluzioni per molti dei problemi ambientali. Le tecnologie per la produzione di energia pulita, come i pannelli solari e le turbine eoliche, possono ridurre la dipendenza dai combustibili fossili. Inoltre, le tecnologie avanzate per il riciclaggio migliorano l'efficienza nella gestione dei rifiuti. Le politiche governative sono essenziali per creare un ambiente favorevole alla sostenibilità. Normative e incentivi possono incoraggiare pratiche ecocompatibili. Sussidi per le energie rinnovabili e leggi che limitano le emissioni di carbonio sono esempi di come le politiche pubbliche possono promuovere la sostenibilità. Anche le aziende hanno una responsabilità nella promozione della sostenibilità. Molte imprese stanno adottando politiche ambientali più rigorose e cercando di ridurre il loro impatto ambientale. Questo può includere la riduzione dei rifiuti, l'uso di energie rinnovabili e la sostenibilità nella catena di approvvigionamento. In sintesi, la sostenibilità è un obiettivo complesso che richiede l'impegno di tutti. Adottare pratiche più sostenibili è fondamentale per garantire un futuro migliore per il nostro pianeta e per le generazioni future. Ogni azione conta e contribuire alla sostenibilità è un passo importante verso la protezione dell'ambiente e il miglioramento della qualità della vita.",
                general_cat_5: 1,
                specific_cat_10: [
                    {
                        code: 1,
                        type: "First Party Collection/Use",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 1
                    },
                    {
                        code: 2,
                        type: "Third Party Sharing/Collection",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 2
                    },
                    {
                        code: 3,
                        type: "User Choice/Control",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 3
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
                        LMM_rank: 2
                    },
                    {
                        code: 6,
                        type: "Data Security",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 3
                    },
                    {
                        code: 7,
                        type: "Policy Change",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 1
                    },
                    {
                        code: 8,
                        type: "Do Not Track",
                        LMM_output: "Virtus est medium inter extremos vitia. Aurea mediocritas nos ad tranquillitatem animi et aequilibrium vitae ducit, inter fervorem et tristitiam.",
                        LMM_rank: 2
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
                        LMM_rank: 0
                    }
                ]
            });
        }, 1000); // Simula un ritardo di 1 secondo
    });
}
