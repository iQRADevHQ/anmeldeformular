// api.js

// Ersetzen Sie diese URL mit der URL Ihrer Web App
const API_URL = 'https://script.google.com/macros/s/AKfycbzZevui0HKp3GHJws7gc_VSvepwKbdQ48fpVYfofYA5b2QUT6bXxn7_UyGrNQwcTRG6/exec';

export async function submitForm(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'no-cors'
        });
        
        return true; // Bei erfolgreicher Übermittlung
    } catch (error) {
        console.error('Error:', error);
        return false; // Bei einem Fehler
    }
}
