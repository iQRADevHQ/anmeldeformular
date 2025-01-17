// api.js
export async function submitForm(data) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzX5B0hhDEM0ccQRd4uWSlBL_lp1L1z7xcFSQfxx0wJs-1UhBU-tj6B4F1A6t6mI282/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Bei no-cors können wir die Antwort nicht lesen,
        // aber wenn wir hier ankommen, war der Request erfolgreich
        return true;
    } catch (error) {
        console.error('Fehler bei der Übermittlung:', error);
        throw error;
    }
}
