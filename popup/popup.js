document.getElementById('extract').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractPrivacyPolicy' }, (response) => {
        document.getElementById('output').textContent = JSON.stringify(response, null, 2);
      });
    });
  });
  