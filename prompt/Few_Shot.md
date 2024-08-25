### Exemple 1:
Text of privacy policy:
"Our service collects user information to improve the overall experience. We share this information with selected partners to provide additional services. Users can manage their preferences through their account settings. We retain information until the user decides to delete their account. We protect information through encryption. We will notify users in case of changes to the policy. We do not respond to Do Not Track signals. Data collection practices for children comply with local regulations."
Expected result:
{
    "LLM_output_long": "We collect and share information to improve services. Users can manage preferences. We retain data until account deletion and protect information with encryption. Notifications of policy changes will be sent. We do not respond to Do Not Track.",
    "general_cat_5": 2,
    "specific_cat_10": [
        {
            "code" : 1,
            "LMM_output" : "Collection for service improvement.",
            "LMM_rank": 1
        },
        {
            "code" : 2,
            "LMM_output" : "Sharing with selected partners.",
            "LMM_rank": 2
        },
        {
            "code" : 3,
            "LMM_output" : "User-manageable preferences.",
            "LMM_rank": 1
        },
        {
            "code" : 4,
            "LMM_output" : "Data accessible and modifiable.",
            "LMM_rank": 1
        },
        {
            "code" : 5,
            "LMM_output" : "Retention until account deletion.",
            "LMM_rank": 2
        },
        {
            "code" : 6,
            "LMM_output" : "Protection through encryption.",
            "LMM_rank": 1
        },
        {
            "code" : 7,
            "LMM_output" : "Notifications for policy changes.",
            "LMM_rank": 1
        },
        {
            "code" : 8,
            "LMM_output" : "We do not respond to Do Not Track.",
            "LMM_rank": 3
        },
        {
            "code" : 9,
            "LMM_output" : "Compliance for children's data collection.",
            "LMM_rank": 1
        },
        {
            "code" : 10,
            "LMM_output" : "General data collection practices.",
            "LMM_rank": 2
        }
    ]
}


### Exemple 2:
Text of privacy policy:
"We collect browsing data to personalize advertising. Data may be shared with advertising partners. Users have no options to control this data. Data is retained for one year. We protect the data with standard security measures. We will notify of privacy policy changes via email. We honor Do Not Track signals."

Expected result:
{
    "LLM_output_long": "We collect browsing data for advertising and share it with partners. Users have no control over the data, which is retained for one year and protected by standard security measures. We honor Do Not Track.",
    "general_cat_5": 3,
    "specific_cat_10": [
        {
            "code" : 1,
            "LMM_output" : "Collection for advertising personalization.",
            "LMM_rank": 2
        },
        {
            "code" : 2,
            "LMM_output" : "Sharing with advertising partners.",
            "LMM_rank": 2
        },
        {
            "code" : 3,
            "LMM_output" : "No control over data.",
            "LMM_rank": 3
        },
        {
            "code" : 4,
            "LMM_output" : "Retention for one year.",
            "LMM_rank": 2
        },
        {
            "code" : 5,
            "LMM_output" : "Protection with standard measures.",
            "LMM_rank": 2
        },
        {
            "code" : 6,
            "LMM_output" : "Email notifications for changes.",
            "LMM_rank": 1
        },
        {
            "code" : 7,
            "LMM_output" : "We honor Do Not Track.",
            "LMM_rank": 1
        },
        {
            "code" : 8,
            "LMM_output" : "Not relevant.",
            "LMM_rank": 0
        },
        {
            "code" : 9,
            "LMM_output" : "Not relevant.",
            "LMM_rank": 0
        },
        {
            "code" : 10,
            "LMM_output" : "Not relevant.",
            "LMM_rank": 0
        }
    ]
}

### Text of privacy policy:
"${textToAnnotate}"

Expected result:



