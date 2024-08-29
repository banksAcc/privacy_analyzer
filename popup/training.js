// Promot per il Few_Shot
const Few_Shot = [
    `Exemple 1: Text of privacy policy: Welcome to Instagram (\"Instagram,\" \"we,\" \"us\" or \"our\"). Instagram provides a fast, beautiful and fun way for you to share media through our content-sharing platform. Just snap a photo, choose a filter to transform the look and feel, add comments (if you like) and share! Our Privacy Policy explains how we and some of the companies we work with collect, use, share and protect information in relation to our mobile services, web site, and any software provided on or in connection with Instagram services (collectively, the \"Service\"), and your choices about the collection and use of your information. By using our Service you understand and agree that we are providing a platform for you to post content, including photos, comments and other materials (\"User Content\"), to the Service and to share User Content publicly. This means that other Users may search for, see, use, or share any of your User Content that you make publicly available through the Service, consistent with the terms and conditions of this Privacy Policy and our Terms of Use (which can be found at http://instagram.com/about/legal/terms/). Our Policy applies to all visitors, users, and others who access the Service (\"Users\").
    Expected result: 
   {
        "LLM_output_long": "Instagram collects, uses, and shares user content as part of its service, with publicly posted content visible to others. The policy applies to all users and explains how information is managed. The details on data access, user control options, and specific protections are limited, but general information about data collection is provided.",
        "general_cat_5": 3,
        "specific_cat_10": [
            {
                "code": 1,
                "LMM_output": "Instagram collects user content and info for service provision.",
                "LMM_rank": 2
            },
            {
                "code": 2,
                "LMM_output": "Third parties may access shared user content.",
                "LMM_rank": 3
            },
            {
                "code": 3,
                "LMM_output": "User content may be controlled by privacy settings.",
                "LMM_rank": 2
            },
            {
                "code": 4,
                "LMM_output": "No details provided on editing or deleting data.",
                "LMM_rank": 3
            },
            {
                "code": 5,
                "LMM_output": "No mention of data retention duration.",
                "LMM_rank": 3
            },
            {
                "code": 6,
                "LMM_output": "Limited protection details provided.",
                "LMM_rank": 2
            },
            {
                "code": 7,
                "LMM_output": "No mention of notification about policy changes.",
                "LMM_rank": 3
            },
            {
                "code": 8,
                "LMM_output": "No mention of Do Not Track signals.",
                "LMM_rank": 3
            },
            {
                "code": 9,
                "LMM_output": "No specific practices for different user groups.",
                "LMM_rank": 3
            },
            {
                "code": 10,
                "LMM_output": "General description of Instagram's service and policy coverage.",
                "LMM_rank": 0
            }
        ]
    }`
];

/*
// Promp per il Chaining
const Chaining = [
    // Step 1: Estrarre le informazioni chiave delle privacy policy
    `Step 1: Examine the following text from the privacy policy and identify the primary purpose for which user data is collected. Report the reason why the service collects user information. Text: "Instagram provides a platform for posting content, including photos, comments, and other materials, and for sharing content publicly. Our Privacy Policy explains how we and some of the companies we work with collect, use, share, and protect information related to our mobile services, website, and any software provided in connection with Instagram's services."`,

    // Step 2: Analisi della condivisione dei dati con terze parti
    `Step 2: Based on the information collected, assess whether the policy mentions how user data may be shared with third parties. Describe the contexts and conditions under which sharing occurs. Text: "Instagram shares information with some of the companies we work with to provide the service, in accordance with our privacy policy."`,

    // Step 3: Valutazione delle scelte e dei controlli disponibili per l'utente
   `Step 3: Analyze the control options and choices available to the user regarding the management of their data. Identify if the user can access, modify, or delete their information. Text: "By using our service, you agree to share your content publicly. You can manage sharing preferences through your account settings."`,

    // Step 4: Esame delle politiche di conservazione dei dati
    `Step 4: Evaluate how long user data is retained. Verify if the privacy policy explicitly indicates retention periods or conditions for data deletion. Text: "Instagram retains user information until the account is deleted or as required by law."`,

    // Step 5: Analisi delle misure di protezione dei dati adottate
    `Step 5: Considering the previous information, analyze the data protection measures adopted. Describe how users' personal information is safeguarded. Text: "Instagram uses security measures such as encryption to protect user data, in collaboration with partner companies."`,
    // Step 6: Revisione della gestione dei segnali Do Not Track (DNT)
    `Step 6: Verify if the policy mentions how Do Not Track (DNT) signals for online tracking and advertising. Analyze the implications of this management for user privacy. Text: "Instagram does not respond to Do Not Track signals, but complies with local regulations for tracking minors and users in certain jurisdictions."`,

    // Step 7: Identificazione di pratiche specifiche per gruppi particolari di utenti
    `Step 7: Examine the privacy policy to identify practices concerning specific groups of users, such as minors or residents of certain regions. Describe any differences in data treatment for these groups. Text: "Our Privacy Policy applies to all users of the service, including minors and users in Europe, in accordance with local laws."`,

    // Step 8: Sintesi delle informazioni estratte in un riepilogo coerente
    `Step 8: Based on the previous analyses, summarize all the extracted information into a single coherent overview of the privacy policy. Include the purpose of data collection, sharing with third parties, user controls, data protection, DNT signal management, and any specific practices for particular groups of users.`
];


*/

const Chaining = [
    // Step 1: Extract key information
    `Step 1: Read the following privacy policy text and identify the key points regarding data collection, usage, and protection. Provide a summary of the main information. Text: "Welcome to Instagram (\"Instagram,\" \"we,\" \"us\" or \"our\"). Instagram provides a fast, beautiful and fun way for you to share media through our content-sharing platform. Just snap a photo, choose a filter to transform the look and feel, add comments (if you like) and share! Our Privacy Policy explains how we and some of the companies we work with collect, use, share and protect information in relation to our mobile services, web site, and any software provided on or in connection with Instagram services (collectively, the \"Service\"), and your choices about the collection and use of your information. By using our Service you understand and agree that we are providing a platform for you to post content, including photos, comments and other materials (\"User Content\"), to the Service and to share User Content publicly. This means that other Users may search for, see, use, or share any of your User Content that you make publicly available through the Service, consistent with the terms and conditions of this Privacy Policy and our Terms of Use (which can be found at http://instagram.com/about/legal/terms/). Our Policy applies to all visitors, users, and others who access the Service (\"Users\")."`,

    // Step 2: Analyze data collection
    `Step 2: Based on the extracted information, determine how and why the service provider collects user information. Provide a brief summary of the purpose behind data collection. Text: "[Insert summary from Step 1]"`,

    // Step 3: Assess data sharing with third parties
    `Step 3: Evaluate if the policy mentions how user data may be shared with third parties. Describe the contexts and conditions under which this sharing occurs. Text: "[Insert summary from Step 1]"`,

    // Step 4: Review user control options
    `Step 4: Analyze the control options and choices available to the user regarding the management of their data. Specify if the user can access, modify, or delete their information. Text: "[Insert summary from Step 1]"`,

    // Step 5: Examine data retention policies
    `Step 5: Evaluate how long user data is retained. Verify if the privacy policy explicitly mentions retention periods or conditions for data deletion. Text: "[Insert summary from Step 1]"`,

    // Step 6: Assess data protection measures
    `Step 6: Analyze the data protection measures adopted. Describe how users' personal information is safeguarded. Text: "[Insert summary from Step 1]"`,

    // Step 7: Review notification of policy changes
    `Step 7: Verify if the policy describes how users will be informed about changes to the privacy policy. Specify how and when these notifications are made. Text: "[Insert summary from Step 1]"`,

    // Step 8: Evaluate handling of Do Not Track (DNT) signals
    `Step 8: Examine whether the privacy policy mentions how Do Not Track (DNT) signals for online tracking and advertising are managed. Analyze the implications of this management for user privacy. Text: "[Insert summary from Step 1]"`,

    // Step 9: Identify practices for specific user groups
    `Step 9: Identify any practices specific to particular groups of users, such as minors or residents of certain regions (e.g., Europe or California). Describe any differences in data treatment for these groups. Text: "[Insert summary from Step 1]"`,

    // Step 10: Synthesize and categorize information
    `Step 10: Based on the previous analyses, synthesize the extracted information, organizing it into the 10 specific categories (data collection, sharing with third parties, user controls, retention, protection, policy change notifications, DNT signal management, and practices for specific user groups). Provide a final summary that encapsulates the privacy policy coherently.`
];

// Funzione per inviare la richiesta di chiamata all'api verso il backgroud
export async function promptApiCall(type) {
    let data;

    switch (type) {

        case "RAG":
            data = RAG;
            break

        case "Chaining":
            data = Chaining;
            break

        case "Few_Shot":
            data = Few_Shot;
            break

        default:
            data = []
    };

    try {
        // Invia il messaggio al background script
        await browser.runtime.sendMessage({
            action: "call_LLM_Api",
            data: data,
            type: type,
        });

        return;
    } catch (error) {
        console.error("Errore durante l'invio del messaggio:", error);
        throw error;
    }
}
