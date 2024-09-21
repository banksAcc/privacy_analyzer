# Privacy Analyzer
Firefox extension that generates a description for the privacy policies that we accept by accessing a page.

# Model Analysis and Prompt Engineering Techniques
Here are several approaches that can be explored and used for conditioning the LLM model.

The model we use is based on the ollama gemma2 model. Here are some features from Ollama sources:

Gemma 2 | 2B | 1.6GB | `ollama run gemma2:2b`
Gemma 2 | 9B | 5.5GB | `ollama run gemma2`
Gemma 2 | 27B | 16GB | `ollama run gemma2:27b`

Specifically, we work with the lightest possible model, the 2B, with the model file in LMM/gemma3.modelfile.

## Important Modelfile Settings
Here is a brief analysis of the model settings that have proven useful for conditioning and Prompt Engineering

### SYSTEM
SYSTEM """<system message>""" We have specified to the model in which context it is during the response and we have decided on a standard JSON pattern to respect. This approach gives us the possibility to condition the model in a robust, permanent way, using a standard setting of the LLM models on ollama. The standard json format is contained in the LMM/LLM_output.json file, then converted into the extension in LMM/Mod_output.json,

### PARAMETER
PARAMETER <parameter> <parametervalue> we specify some parameters in order to optimize the responses according to our needs.

1. mirostat_eta : defines how the model modifies the weights and parameters based on the conversation. We will try to have a maximum learning rate during the prompt engineering phase and a minimum during the operation phase.
2. num_ctx : defines how many tokens remain in the learning window for generating an appropriate response.
3. temperature : we want a response that is as standard and non-creative in structure as possible and moderately creative in summary texts.

## N.1 Prompt Few-Shot
This method consists of providing the model with various examples of how it should behave when asked to perform a task. This helps the model not only to better understand the context but also to direct it towards the type of desired response. It is good to use this model if you need greater precision and consistency in responses thanks to examples or even in the case in which the types of information in the privacy policies are structured in different ways or are expressed in different languages. To set this type of prompt, you must provide the model with one or two examples of information extraction from other privacy policies and then ask the model to do the same for a new text.

## N.2 Prompt Chaining
Prompting chaining consists of using multiple prompts in sequence so that the output of one prompt becomes the input for the next. This allows you to divide a complex problem into manageable sub-problems. It is good to use this model to break down the process into manageable phases, improving the precision and consistency of the final result. Furthermore, using this technique it is possible to effectively automate the classification of privacy policies. In our case we have 5 prompts that respectively consist of extracting the key information on privacy policies, checking if the data contains a reference to the user's control over their data, analyzing how the data is protected, examining the policy's response to Do Not Track and generating the final output based on the information extracted in the previous steps.

## N.3 Retrieval Augmented Generation (RAG)
This technique combines retrieval techniques together with generation techniques (text generation) to improve the LLM. The usefulness of this technique is especially evident when working with large LLMs that require very accurate responses. This technique has the advantage of providing precise responses with information updated in real time.