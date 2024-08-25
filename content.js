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
    }
});

function extractText() {
    // Estrai il contenuto testuale della pagina
    let pageContent = document.body.innerText;
    return pageContent;
}