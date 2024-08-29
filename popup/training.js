// Promot per il Few_Shot
const Few_Shot = [
    `Exemple 1: Text of privacy policy: Welcome to Instagram (\"Instagram,\" \"we,\" \"us\" or \"our\"). Instagram provides a fast, beautiful and fun way for you to share media through our content-sharing platform. Just snap a photo, choose a filter to transform the look and feel, add comments (if you like) and share! Our Privacy Policy explains how we and some of the companies we work with collect, use, share and protect information in relation to our mobile services, web site, and any software provided on or in connection with Instagram services (collectively, the \"Service\"), and your choices about the collection and use of your information. By using our Service you understand and agree that we are providing a platform for you to post content, including photos, comments and other materials (\"User Content\"), to the Service and to share User Content publicly. This means that other Users may search for, see, use, or share any of your User Content that you make publicly available through the Service, consistent with the terms and conditions of this Privacy Policy and our Terms of Use (which can be found at http://instagram.com/about/legal/terms/). Our Policy applies to all visitors, users, and others who access the Service (\"Users\").
    Expected result: 
   {
    "LLM_output_long": "Instagram collects, uses, and shares user content as part of its service, with publicly posted content visible to others. The policy applies to all users and explains how information is managed. The details on data access, user control options, and specific protections are limited, but general information about data collection is provided.",
    "general_cat_5": 4,
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
}


`
];

// Promp per il Chaining
const Chaining = [
    `Step 1: Extract the main purpose of data collection from the following privacy policy text. Text: "Our service collects user information to improve the overall experience. We share this information with selected partners to provide additional services."`,

    `Step 2: Based on the extracted purpose of data collection, identify if there is any mention of user control over their data in the following text. Text: "Users can manage their preferences through their account settings. We retain information until the user decides to delete their account."`,

    `Step 3: Considering the mention of user control, analyze how the data is protected in the following text. Text: "We protect information through encryption. We will notify users in case of changes to the policy."`,

    `Step 4: Review the policy’s response to Do Not Track signals and describe the implications. Text: "We do not respond to Do Not Track signals. Data collection practices for children comply with local regulations."`,

    `Step 5: Summarize all the extracted information from the previous steps into a single, coherent privacy policy summary.`
];

// Promot per il RAG
const RAG = [
    "How and why does the service collect user information?",
    "With whom is user data shared, and for what purpose?",
    "What control options are available to users?",
    "If and how can users access, edit, or delete their information?",
    "How long is user data retained?",
    "How is user data protected?",
    "If and how will users be informed about changes to the privacy policy?",
    "If and how are Do Not Track signals honored?",
    "What practices apply to specific groups of users (e.g., children, Europeans, California residents)?",
    "Additional sub-labels for general information, contact details, and practices not covered by other categories.",

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
        // Invia il messaggio al background script con un ID unico
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
