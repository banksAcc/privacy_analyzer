FASE 1 -> estrarre le informazioni chiave


You are an expert in analyzing privacy policies. Given the following text, extract the key points related to the following categories:

1. Collection of user information
2. Sharing with third parties
3. User choices and control
4. User access, edit, and deletion
5. Data retention
6. Data security
7. Policy changes
8. Do Not Track signals
9. Special practices for specific user groups
10. Additional general or introductory text

Text to analyze:
"${textToAnnotate}"

Please provide a summary of the information for each category.


FASE 2 -> classificare le informazioni


You have extracted the following information from a privacy policy:
"${extractedInformation}"

Now, classify each piece of information under the specific categories you analyzed:

1. Collection of user information
2. Sharing with third parties
3. User choices and control
4. User access, edit, and deletion
5. Data retention
6. Data security
7. Policy changes
8. Do Not Track signals
9. Special practices for specific user groups
10. Additional general or introductory text

For each category, assign a rank from 1 to 3 where 1 is very good and 3 is very bad. Provide a short summary (max 100 characters) for each classification.


FASE 3 -> Generare l'output finale


You have classified the information as follows:

"${classifiedInformation}"

Now, format this information in the following JSON structure:

{
    "LLM_output_long": "max 400 char",
    "general_cat_5": 1,
    "specific_cat_10": [
        {
            "code" : 1,
            "LMM_output" : "max 100 char",
            "LMM_rank": 2
        },
        ...
    ]
}

Please generate the JSON response.