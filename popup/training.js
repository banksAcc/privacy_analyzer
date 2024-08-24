// Vettore globale contenente i testi da inviare a ApiCall
const Few_Shot = [
    "Promp1",
    "Promp2",
    "Promp3",
    "Promp4",
    "Promp5"
];

const Chaining = [
    "Promp1",
    "Promp2",
    "Promp3",
    "Promp4",
    "Promp5"
];

const RAG = [
    "Promp1",
    "Promp2",
    "Promp3",
    "Promp4",
    "Promp5"
];

// Funzione che chiama ApiCall 5 volte con input da Few_Shot
export async function train_FewShot() {
    for (let i = 0; i < 5; i++) {
        const data = { sending_page_text: Few_Shot[i] };
        console.log(`FewShot ${i + 1}:`, data);
        try {
            const result = await ApiCall(data);  // Aspetta il completamento della chiamata API
            console.log(`FewShot output ${i + 1}:`, result);
        } catch (error) {
            console.error(`Error FewShot ${i + 1}:`, error);
        }
    }
}

// Funzione che chiama ApiCall 5 volte con input da Chaining
export async function train_Chaining() {
    for (let i = 0; i < 5; i++) {
        const data = { sending_page_text: Chaining[i] };
        console.log(`Chaining ${i + 1}:`, data);
        try {
            const result = await ApiCall(data);  // Aspetta il completamento della chiamata API
            console.log(`Chaining output ${i + 1}:`, result);
        } catch (error) {
            console.error(`Error Chaining ${i + 1}:`, error);
        }
    }
}

// Funzione che chiama ApiCall 5 volte con input da RAG
export async function train_RAG() {
    for (let i = 0; i < 5; i++) {
        const data = { sending_page_text: RAG[i] };
        console.log(`RAG ${i + 1}:`, data);
        try {
            const result = await ApiCall(data);  // Aspetta il completamento della chiamata API
            console.log(`RAG output ${i + 1}:`, result);
        } catch (error) {
            console.error(`Error RAG ${i + 1}:`, error);
        }
    }
}

function ApiCall(data) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gemma2:2b",
                prompt: data.sending_page_text,
                stream: false,
                options: {
                    temperature: 2
                },
                format: "json",
                keep_alive: 100000
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
}