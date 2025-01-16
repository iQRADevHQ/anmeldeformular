import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    // Telefon-Input initialisieren
    const phoneInputElement = document.querySelector("#phone");
    phoneInput = window.intlTelInput(phoneInputElement, {
        initialCountry: "de",
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true,
        formatOnDisplay: true,
        nationalMode: false,
        autoHideDialCode: false,
        autoPlaceholder: "aggressive"
    });

    // Zeige Validierungsfehler direkt beim Tippen als Hilfestellung
    phoneInputElement.addEventListener('blur', function() {
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
            let errorCode = phoneInput.getValidationError();
            let errorMessage = 'Hinweis zur Formatierung: ';
            
            switch(errorCode) {
                case intlTelInputUtils.validationError.TOO_SHORT:
                    errorMessage += 'Nummer scheint zu kurz zu sein.';
                    break;
                case intlTelInputUtils.validationError.TOO_LONG:
                    errorMessage += 'Nummer scheint zu lang zu sein.';
                    break;
                case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
                    errorMessage += 'Ländervorwahl scheint ungültig zu sein.';
                    break;
                default:
                    errorMessage += 'Standardformat wäre z.B. 123 45678900';
            }
            
            errorMsg.textContent = errorMessage;
            phoneInputElement.parentNode.appendChild(errorMsg);
        }
    });

    // Validierung für PLZ
    const plzInput = document.getElementById('plz');
    if (plzInput) {
        plzInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d]/g, '');
            if (this.value.length > 5) {
                this.value = this.value.slice(0, 5);
            }
        });
    }

    // Validierung für Namen (nur Buchstaben und Bindestriche)
    const nameInputs = document.querySelectorAll('#vorname, #nachname');
    nameInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^a-zA-ZäöüßÄÖÜ\- ]/g, '');
        });
    });

    // Formular-Event-Listener
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Wird gesendet...';
        
        try {
            // Validiere E-Mail-Format
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                throw new Error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
            }

            // Validiere PLZ (5 Ziffern für Deutschland)
            const plzInput = document.getElementById('plz');
            if (plzInput.value.length !== 5 || !/^\d+$/.test(plzInput.value)) {
                throw new Error("Bitte geben Sie eine gültige PLZ ein (5 Ziffern)");
            }

            // Validiere Checkbox-Felder
            if (!document.getElementById('agb').checked) {
                throw new Error("Bitte akzeptieren Sie die AGBs");
            }
            if (!document.getElementById('faq').checked) {
                throw new Error("Bitte bestätigen Sie, dass Sie die FAQ gelesen haben");
            }

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            
            // Telefonnummer ohne Validierung übernehmen
            data.phone = phoneInput.getNumber();
            
            console.log('Formulardaten werden gesendet:', data);
            
            await submitForm(data);
            showSuccess();
            event.target.reset();
            
            // Telefon-Input zurücksetzen
            phoneInput.setCountry('de');
            
        } catch (error) {
            console.error('Fehler bei der Übermittlung:', error);
            showError(error.message || "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Anmeldung absenden';
        }
    });

    // Setze initiale Beispiel-Platzhalter
    if (phoneInput) {
        phoneInputElement.placeholder = 'z.B. +49 123 45678900';
    }
});
