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


// Promp per il Chaining
const Chaining = [
    // Step 1: Estrazione punti chiave
    `Step 1: Read the following privacy policy text and identify the key points regarding data collection, usage, and protection. Provide a summary of the main information. Text: "Welcome to Instagram (\"Instagram,\" \"we,\" \"us\" or \"our\"). Instagram provides a fast, beautiful and fun way for you to share media through our content-sharing platform. Just snap a photo, choose a filter to transform the look and feel, add comments (if you like) and share! Our Privacy Policy explains how we and some of the companies we work with collect, use, share and protect information in relation to our mobile services, web site, and any software provided on or in connection with Instagram services (collectively, the \"Service\"), and your choices about the collection and use of your information. By using our Service you understand and agree that we are providing a platform for you to post content, including photos, comments and other materials (\"User Content\"), to the Service and to share User Content publicly. This means that other Users may search for, see, use, or share any of your User Content that you make publicly available through the Service, consistent with the terms and conditions of this Privacy Policy and our Terms of Use (which can be found at http://instagram.com/about/legal/terms/). Our Policy applies to all visitors, users, and others who access the Service (\"Users\")."`,

    // Step 2: Analisi raccolta dati
    `Step 2: Based on the extracted information, determine how and why the service provider collects user information. Provide a brief summary of the purpose behind data collection. Text: "[Insert summary from Step 1]"`,

    // Step 3: Valutazione condivisione dati con terze parti
    `Step 3: Evaluate if the policy mentions how user data may be shared with third parties. Describe the contexts and conditions under which this sharing occurs. Text: "[Insert summary from Step 1]"`,

    // Step 4: Analisi opzioni di controllo dell'utente
    `Step 4: Analyze the control options and choices available to the user regarding the management of their data. Specify if the user can access, modify, or delete their information. Text: "[Insert summary from Step 1]"`,

    // Step 5: Analisi politiche di conservazione dei dati
    `Step 5: Evaluate how long user data is retained. Verify if the privacy policy explicitly mentions retention periods or conditions for data deletion. Text: "[Insert summary from Step 1]"`,

    // Step 6: Valutazione misure di protezione dati
    `Step 6: Analyze the data protection measures adopted. Describe how users' personal information is safeguarded. Text: "[Insert summary from Step 1]"`,

    // Step 7: Esaminare se le policy informano gli utenti delle modifiche di policy
    `Step 7: Verify if the policy describes how users will be informed about changes to the privacy policy. Specify how and when these notifications are made. Text: "[Insert summary from Step 1]"`,

    // Step 8: Evaluate handling of Do Not Track (DNT) signals
    `Step 8: Examine whether the privacy policy mentions how Do Not Track (DNT) signals for online tracking and advertising are managed. Analyze the implications of this management for user privacy. Text: "[Insert summary from Step 1]"`,

    // Step 9: Identificare policy riguardo una specifica parte di utenti come ad esempio minori
    `Step 9: Identify any practices specific to particular groups of users, such as minors or residents of certain regions (e.g., Europe or California). Describe any differences in data treatment for these groups. Text: "[Insert summary from Step 1]"`,

    // Step 10: Sintetizzazione e categorizzazione delle informazioni
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
