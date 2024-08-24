# Privacy Analyzer
Firefox extension that generates a description for the privacy policies that we accept by accessing a page.

# Analisi del Modello e delle Tecniche di Prompt Engineering
Di seguito diversi approcci di che è possibile approfondire e utilizzare per il condizionamento del modello LLM.

Il modello che utilizziamo è basato sul modello gemma2 di ollama. Di seguito alcune caratteristiche da sorgete Ollama:

 Gemma 2            | 2B         | 1.6GB | `ollama run gemma2:2b`         
 Gemma 2            | 9B         | 5.5GB | `ollama run gemma2`            
 Gemma 2            | 27B        | 16GB  | `ollama run gemma2:27b`        

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
1. Questo metodo consiste nel fornire al modello vari esempi di come deve comportarsi quando gli viene chiesto di svolgere un compito. Questo aiuta il modello non solo a comprendere meglio il contesto ma anche a indirizzarlo verso il tipo di risposta desiderata.
2. È bene usare questo modello se si ha bisogno di maggiore precisione e coerenza nelle risposte grazie agli esempi o anche nel caso in cui i tipi di informazioni nelle privacy policy sono strutturati in modi diversi o sono espressi in linguaggi differenti.
3. Per impostare questa tipologia di prompt si deve formire al modello uno o due esempi di estrazione di informazion da altre privacy policy e poi si chiede al modello di fare lo stesso per un nuovo testo.

## N.2 Prompt Chaining
1. Il prompting chaining consiste nell'utilizzare più prompt in sequenza facendo in modo che l'output di un prompt diventi l'input per il successivo. Questo permette di suddividere un problema complesso in sotto-problemi gestibili.
2. È bene usare questo modello per scomporre il processo in fasi gestibili migliorando la precisione e la coerenza del risultato finale. Inoltre usando questa tecnica è possibile automatizzare in modo efficace la classificazione delle privacy policy.
3. Nel nostro caso abbiamo 3 prompt che rispettivamente consistono nell'estrarre le informazioni chiave sulle privacy policy, classificare le informazioni relative a queste e generare l'output finale.

## N.3 Retrieval Augmented Generation (RAG)
1. Descrizione del metodo
2. Obiettivi
3. How to...

