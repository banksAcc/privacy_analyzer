document.body.style.border = "5px solid orange";

// Estrai il contenuto testuale della pagina
let pageContent = document.body.innerText;

// Invia il contenuto al background script
browser.runtime.sendMessage({ type: "extractText", content: pageContent });

// content.js
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getContent") {
        let pageContent = document.body.innerText;
        sendResponse({ content: pageContent });
    }
});