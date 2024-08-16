# Analisi del Modello e delle Tecniche di Prompt Engineering
Di seguito diversi approcci di che è possibile approfondire e utilizzare per il condizionamento del modello LLM.

Il modello che utilizziamo è basato sul modello gemma2 di ollama. Di seguito alcune caratteristiche da sorgete Ollama:

| Gemma 2            | 2B         | 1.6GB | `ollama run gemma2:2b`         |
| Gemma 2            | 9B         | 5.5GB | `ollama run gemma2`            |
| Gemma 2            | 27B        | 16GB  | `ollama run gemma2:27b`        |

Nello specifico lavoriamo con il modello più leggero possibile, il 2B, con il model file in LMM/gemma3.modelfile.

## Setting importanti di Modelfile
Di seguito una breve analisi delle impostazioni del modello che si sono rilevate utili al fine del condizionamento e del Prompt Engineering

### SYSTEM
SYSTEM """<system message>""" Abbiamo specificato al modello in che contesto si trova durante la risposta e abbiamo deciso un patter JSON standard da rispettare. Questo approccio ci da la possibilità di condizionare il modello in manira robusta, permanente, sfruttando una impostazione standard dei modelli LLM su ollama. Il formato json standard è contenuto nel file LMM/LLM_output.json, poi convertito nell'estensione in LMM/Mod_output.json,

### PARAMETER
PARAMETER <parameter> <parametervalue> spicifichiamo alcuni parametri al fine di ottimizzare le risposte in funzione delle nostre necessita.

1. mirostat_eta : definisce come il modello modifica i pesi e parametri in base alla   conversazione. Cercheremo di avere un tasso di apprendimento massimo durate la fase di prompt engineering e minimo durate la fase di funzionamento.
2. num_ctx : definisce quanti token rimangono nella finestra di apprendimento per la generazione di una risposta adeguata.
3. temperature : vogliamo una risposta quanto più standard e non creativa nella struttura e mediamante creativa nei testi di riassunto.

## N.1 Prompt Few-Shot
1. Descrizione del metodo
2. Obiettivi
3. How to...

## N.2 Prompt Chaining
1. Descrizione del metodo
2. Obiettivi
3. How to...

## N.3 Retrieval Augmented Generation (RAG)
1. Descrizione del metodo
2. Obiettivi
3. How to...
