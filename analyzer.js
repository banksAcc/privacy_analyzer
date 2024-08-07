let results = [];

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

        fetch('http://localhost:3000/get_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(apiResponse => {
            results.push(apiResponse);
            chrome.storage.local.set({ 'apiResults': results }, () => {
                sendResponse({ apiResponse: apiResponse });
            });
        })
        .catch(error => console.error('API Error:', error));

        // Indica che la risposta verrà inviata in seguito
        return true;
    }
});
