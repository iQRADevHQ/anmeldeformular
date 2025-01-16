// main.js
import { validateForm, showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';
import { PhoneInputHandler } from './phoneInput.js';

let phoneInputHandler;

// Komponenten laden
async function loadComponents() {
    try {
        // Header laden
        const headerResponse = await fetch('components/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('headerContainer').innerHTML = headerHtml;

        // Land-Select laden
        const landResponse = await fetch('components/land-select.html');
        const landHtml = await landResponse.text();
        document.getElementById('landContainer').innerHTML = landHtml;

        // AGB laden
        const agbResponse = await fetch('components/agb.html');
        const agbHtml = await agbResponse.text();
        document.getElementById('agbContainer').innerHTML = agbHtml;

        // FAQ laden
        const faqResponse = await fetch('components/faq.html');
        const faqHtml = await faqResponse.text();
        document.getElementById('faqContainer').innerHTML = faqHtml;
    } catch (error) {
        console.error('Fehler beim Laden der Komponenten:', error);
        showError('Einige Komponenten konnten nicht geladen werden. Bitte laden Sie die Seite neu.');
    }
}

// Formular-Handler
function initializeForm() {
    // Phone Input initialisieren
    phoneInputHandler = new PhoneInputHandler('phone');

    // Formular-Event-Listener
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Telefonnummer validieren
        if (!phoneInputHandler.isValid()) {
            showError('Bitte geben Sie eine gültige Telefonnummer ein.');
            return;
        }

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.phone = phoneInputHandler.getNumber();

        try {
            const success = await submitForm(data);
            if (success) {
                showSuccess();
                event.target.reset();
            } else {
                showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
        }
    });
}

// Initialisierung nach DOM-Load
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initializeForm();
});
