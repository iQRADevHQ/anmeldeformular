// api.js
export async function submitForm(data) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxyC95YcTOtcswflBnIIszATq8-UFMSO4y23MvUQH3WdxaXOSosSNyXMfA6pfB-aY27/exec', {
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
