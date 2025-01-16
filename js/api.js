// api.js
export async function submitForm(data) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzZevui0HKp3GHJws7gc_VSvepwKbdQ48fpVYfofYA5b2QUT6bXxn7_UyGrNQwcTRG6/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Überprüfen Sie den Status der Antwort
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Wenn wir hier ankommen, war die Übermittlung erfolgreich
        return true;
    } catch (error) {
        console.error('Fehler bei der Übermittlung:', error);
        // Werfen Sie den Fehler, damit er in main.js behandelt werden kann
        throw error;
    }
}
