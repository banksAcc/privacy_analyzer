import axios from 'axios';
import fs from 'fs';

const url = 'http://localhost:11434/api/chat';

const privacyPolicyText = `

Inserire testo della privacy policy

`
;




const prompt = `
Analyze a privacy policy text and generate a JSON output conforming to the following structure:

{
  "processing_time": "Processing time in seconds.",
  "output_date_time": "ISO 8601 format e.g., YYYY-MM-DDTHH:MM:SS",
  "sent_page_text": "The text of the page sent to the LLM.",
  "LLM_output_short": "Brief output, 250 characters; if empty, processing not possible.",
  "LLM_output_long": "Full output, 2500 characters including spaces, periods, etc.",
  "general_cat_5": "Overall score from 1 to 5, where 1 is good and 5 is not good. Defines how the site handles privacy. If this value is out of range, then it was not possible to analyze the data.",
  "specific_cat_10": [
    {
      "code": 1,
      "type": "First Party Collection/Use",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 2,
      "type": "Third Party Sharing/Collection",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 3,
      "type": "User Choice/Control",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 4,
      "type": "User Access, Edit, & Deletion",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 5,
      "type": "Data Retention",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 6,
      "type": "Data Security",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 7,
      "type": "Policy Change",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 8,
      "type": "Do Not Track",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 9,
      "type": "International & Specific Audiences",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    },
    {
      "code": 10,
      "type": "Other",
      "LMM_output": "Description of maximum 150 characters",
      "LMM_rank": "Number from 1 to 3, where 1 is good and 3 is not good. Scores out of range indicate that it was not possible to deduce a value for this indicator."
    }
  ]
}

Use the following privacy policy text for the analysis:

"${privacyPolicyText}"
`;

// Dati da inviare nel corpo della richiesta
const data = {
    model: 'llama3.1',
    messages: [
        {
            role: 'user',
            content: prompt
        },
    ],
    stream: false,
    temperature: 0.7,
    stop: null
};

// Opzioni per la richiesta POST
const options = {
    method: 'POST',
    url: url,
    headers: {
        'Content-Type': 'application/json',
    },
    data: data,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
};

(async () => {
    try {
        const response = await axios(options);
        const outputFilePath = 'privacy_analyzer-main/LMM/output_analysis.json';

        fs.writeFileSync(outputFilePath, JSON.stringify(response.data, null, 2));
        console.log(`Analysis result saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error during request:', error.message);
    }
})();
