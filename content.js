document.body.style.border = "5px solid orange";

// Estrai il contenuto testuale della pagina
let pageContent = document.body.innerText;

// Invia il contenuto al background script
chrome.runtime.sendMessage({type: "extractText", content: pageContent});