// api.js
export async function submitForm(data) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzZevui0HKp3GHJws7gc_VSvepwKbdQ48fpVYfofYA5b2QUT6bXxn7_UyGrNQwcTRG6/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'no-cors'
        });
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}
