// main.js
import { validateForm, showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    // Telefon-Input initialisieren
    const phoneInputElement = document.querySelector("#phone");
    phoneInput = window.intlTelInput(phoneInputElement, {
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    // Formular-Event-Listener
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (!phoneInput.isValidNumber()) {
            showError("Bitte geben Sie eine gültige Telefonnummer ein.");
            return;
        }

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.phone = phoneInput.getNumber();

        try {
            const success = await submitForm(data);
            if (success) {
                showSuccess();
                event.target.reset();
            } else {
                showError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            }
        } catch (error) {
            console.error('Submission error:', error);
            showError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
        }
    });
});
