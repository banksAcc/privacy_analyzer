let results = [];

function getPageText() {
    return document.body.textContent;
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
                    /*

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
                    */
                    storedResults.push(apiResponse);
                    chrome.storage.local.set({ 'apiResults': storedResults }, () => {
                        console.log('Data saved to storage:', storedResults);
                        sendResponse({ apiResponse: apiResponse });
                    });
                });
            })
            .catch(error => console.error('API Error:', error));

        // Indica che la risposta verrà inviata in seguito
        return true;
    }
});
