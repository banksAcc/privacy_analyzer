const { time } = require("console");

let results = [];
document.body.style.border = "5px solid orange";


function getPageText() {
    return document.body.innerText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageText') {
        const text = getPageText();
        const data = {
            sending_page_text: text,
            sending_date_time: new Date().toISOString()
        };

        // Utilizza la chiamata mock invece di fetch
        mockApiCall(data)
            .then(apiResponse => {
                // Aggiungi controllo per duplicati
                chrome.storage.local.get('apiResults', storageData => {
                    const storedResults = storageData.apiResults || [];
                    
                    const isDuplicate = storedResults.some(result => 
                        result.sent_page_text === apiResponse.sent_page_text &&
                        result.sending_date_time === apiResponse.sending_date_time
                    );

                    if (!isDuplicate) {
                        storedResults.push(apiResponse);
                        chrome.storage.local.set({ 'apiResults': storedResults }, () => {
                            console.log('Data saved to storage:', storedResults);
                            sendResponse({ apiResponse: apiResponse });
                        });
                    } else {
                        console.log('Duplicate data found. Skipping save.');
                        sendResponse({ apiResponse: apiResponse });
                    }
                    
                });
            })
            .catch(error => console.error('API Error:', error));

        // Indica che la risposta verrà inviata in seguito
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
                LLM_output_short: "Mock output breve",
                LLM_output_long: "Mock output completo",
                general_cat_5: 1,
                specific_cat_10: [
                    {
                        code: 1,
                        type: "First Party Collection/Use",
                        LMM_output: "Mock descrizione",
                        LMM_rank: 1
                    },
                    {
                        code: 2,
                        type: "Third Party Sharing/Collection",
                        LMM_output: "Mock descrizione",
                        LMM_rank: 2
                    },
                    {
                        code: 3,
                        type: "User Choice/Control",
                        LMM_output: "Mock descrizione",
                        LMM_rank: 3
                    },
                    {
                        code: 4,
                        type: "User Access, Edit, & Deletion",
                        LMM_output: "Descrizione di max 500 caratteri",
                        LMM_rank: 1
                    },
                    {
                        code: 5,
                        type: "Data Retention",
                        LMM_output: "Descrizione di max 500 caratteri",
                        LMM_rank: 3
                    },
                    {
                        code: 6,
                        type: "Data Security",
                        LMM_output: "Descrizione di max 500 caratteri",
                        LMM_rank: 2
                    },
                    {
                        code: 7,
                        type: "Policy Change",
                        LMM_output: "Descrizione di max 500 caratteri",
                        LMM_rank: 1
                    },
                    {
                        code: 8,
                        type: "Do Not Track",
                        LMM_output: "Descrizione di max 500 caratteri",
                        LMM_rank: 1
                    },
                    {
                        code: 9,
                        type: "International & Specific Audiences",
                        LMM_output: "Descrizione di max 500 caratteri",
                        LMM_rank: 2
                    },
                    {
                        code: 10,
                        type: "Other",
                        LMM_output: "Descrizione di max 500 caratteri",
                        LMM_rank: 1
                    }
                ]
            });
        }, 1000); // Simula un ritardo di 1 secondo
    });
}
