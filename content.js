// Per motivi di test
document.body.style.border = "5px solid orange";

// Invia il contenuto al background script
browser.runtime.sendMessage({ type: "extractText", content: extractText() });

// content.js
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === 'reloadLMM') {
        browser.runtime.sendMessage({ type: "extractText", content: extractText() });
    };

    if (request.action === "getContent") {
        sendResponse({ content: extractText() });
    };

    if (request.action === "requestIsLoading") {
        console.log("chiamata per requestIsLoading content.js");
        getIsLoadingStatus().then(isLoading => {
            console.log("isLoading: ", isLoading);
            sendResponse({ isLoading: isLoading });
        }).catch(error => {
            sendResponse({ error: error.message });
        });

        return true; // Indica che la risposta sarà inviata in modo asincrono
    }

});

function extractText() {
    // Estrai il contenuto testuale della pagina
    let pageContent = document.body.innerText;
    return pageContent;
}
