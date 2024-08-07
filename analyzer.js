/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractPrivacyPolicy') {
      let policyData = extractPrivacyPolicy();
      sendResponse(policyData);
    }
  });
  
  function extractPrivacyPolicy() {
    // Qui inserisci il codice per estrarre le informazioni essenziali dalla privacy policy.
    let policyFeatures = {
      title: document.querySelector('h1') ? document.querySelector('h1').innerText : 'No title found',
      paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.innerText)
    };
    return policyFeatures;
  }
*/
document.body.style.border = "5px solid red";