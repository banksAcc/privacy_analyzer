document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'setFullText') {
            document.getElementById('fullText').textContent = request.text;
        }
    });
});
