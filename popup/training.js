// Promot per il Few_Shot
const Few_Shot = [
    `Exemple 1: Text of privacy policy: Our service collects user information to improve the overall experience. We share this information with selected partners to provide additional services. Users can manage their preferences through their account settings. We retain information until the user decides to delete their account. We protect information through encryption. We will notify users in case of changes to the policy. We do not respond to Do Not Track signals. Data collection practices for children comply with local regulations.
    Expected result: 
    {
        "LLM_output_long": "We collect and share information to improve services. Users can manage preferences. We retain data until account deletion and protect information with encryption. Notifications of policy changes will be sent. We do not respond to Do Not Track.",
        "general_cat_5": 1,
        "specific_cat_10": [
            {
                "code" : 1,
                "LLM_output" : "Collection for service improvement.",
                "LLM_rank": 1
            },
            {
                "code" : 2,
                "LLM_output" : "Sharing with selected partners.",
                "LLM_rank": 2
            },
            {
                "code" : 3,
                "LLM_output" : "User-manageable preferences.",
                "LLM_rank": 1
            },
            {
                "code" : 4,
                "LLM_output" : "Data accessible and modifiable.",
                "LLM_rank": 1
            },
            {
                "code" : 5,
                "LLM_output" : "Retention until account deletion.",
                "LLM_rank": 2
            },
            {
                "code" : 6,
                "LLM_output" : "Protection through encryption.",
                "LLM_rank": 1
            },
            {
                "code" : 7,
                "LLM_output" : "Notifications for policy changes.",
                "LLM_rank": 1
            },
            {
                "code" : 8,
                "LLM_output" : "We do not respond to Do Not Track.",
                "LLM_rank": 3
            },
            {
                "code" : 9,
                "LLM_output" : "Compliance for children's data collection.",
                "LLM_rank": 1
            },
            {
                "code" : 10,
                "LLM_output" : "General data collection practices.",
                "LLM_rank": 2
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