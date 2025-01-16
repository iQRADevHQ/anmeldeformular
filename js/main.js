import { validateForm, showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

// Telefonnummer-Input initialisieren
let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    phoneInput = window.intlTelInput(document.querySelector("#phone"), {
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    // Formular-Event-Listener
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        const formData = validateForm(event, phoneInput);
        if (formData) {
            const success = await submitForm(formData);
            if (success) {
                showSuccess();
            } else {
                showError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            }
        }
    });
});
