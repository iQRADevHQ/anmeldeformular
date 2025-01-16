// main.js
import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    // Telefon-Input initialisieren
    const phoneInputElement = document.querySelector("#phone");
    phoneInput = window.intlTelInput(phoneInputElement, {
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true,
        formatOnDisplay: true,
        nationalMode: false
    });

    // Zeige Validierungsfehler direkt beim Tippen
    phoneInputElement.addEventListener('input', () => {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'phone-error';
        errorMsg.style.color = 'red';
        errorMsg.style.fontSize = '14px';
        errorMsg.style.marginTop = '5px';

        // Entferne vorherige Fehlermeldungen
        const existingError = phoneInputElement.parentNode.querySelector('.phone-error');
        if (existingError) {
            existingError.remove();
        }

        if (!phoneInput.isValidNumber()) {
            errorMsg.textContent = 'Bitte geben Sie eine gültige Telefonnummer ein';
            phoneInputElement.parentNode.appendChild(errorMsg);
        }
    });

    // Formular-Event-Listener
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Deaktivieren Sie den Submit-Button während der Übermittlung
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Wird gesendet...';
        
        try {
            // Validiere Telefonnummer
            if (!phoneInput.isValidNumber()) {
                throw new Error("Bitte geben Sie eine gültige Telefonnummer ein. Beispiel: +49 123 45678900");
            }

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            
            // Formatierte Telefonnummer mit Ländervorwahl
            data.phone = phoneInput.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL);

            // Füge zusätzliche Informationen hinzu
            data.country = phoneInput.getSelectedCountryData().iso2.toUpperCase();
            data.countryCode = phoneInput.getSelectedCountryData().dialCode;
            
            console.log('Formulardaten werden gesendet:', data); // Debug-Log
            
            await submitForm(data);
            showSuccess();
            event.target.reset();
            
        } catch (error) {
            console.error('Fehler bei der Übermittlung:', error);
            showError(error.message || "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
        } finally {
            // Button wieder aktivieren
            submitButton.disabled = false;
            submitButton.textContent = 'Anmeldung absenden';
        }
    });

    // Initialisiere das Telefon-Input-Feld mit einem Beispielformat
    phoneInputElement.placeholder = 'z.B. +49 123 45678900';
});
