// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "extractText") {
        mockApiCall({sending_page_text: message.content})
        .then(data => {
            // Recupera la lista corrente dal chrome.storage.local
            chrome.storage.local.get({processedDataList: []}, function(result) {
                let processedDataList = result.processedDataList;

                // Aggiungi il nuovo dato alla lista
                processedDataList.push(data);

                // Salva la lista aggiornata nella memoria locale
                chrome.storage.local.set({processedDataList: processedDataList}, () => {
                    console.log("Dati mock aggiunti alla lista nella memoria locale.");
                });
            });
        })
        .catch(error => console.error('Errore nella chiamata mock:', error));
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
