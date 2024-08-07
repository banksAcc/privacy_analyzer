document.body.style.border = "5px solid green";

// Funzione per estrarre il testo della pagina
function getPageText() {
  return document.body.innerText;
}

// Invia il testo della pagina al popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageText') {
      sendResponse({ text: getPageText() });
  }
});
