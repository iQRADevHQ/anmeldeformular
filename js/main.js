// main.js
import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    // Telefon-Input initialisieren
    const phoneInputElement = document.querySelector("#phone");
    
    // Container für Telefon-Input erstellen
    const phoneContainer = document.createElement('div');
    phoneContainer.className = 'phone-input-container';
    phoneInputElement.parentNode.insertBefore(phoneContainer, phoneInputElement);
    phoneContainer.appendChild(phoneInputElement);

    // Zusätzliche CSS-Regeln
    const style = document.createElement('style');
    style.textContent = `
        .phone-input-container {
            position: relative;
            width: 100%;
        }
        .iti {
            width: 100%;
            display: block;
        }
        .iti__flag-container {
            right: auto;
            left: 0;
        }
        .iti--separate-dial-code .iti__selected-flag {
            background-color: transparent;
            padding-right: 8px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .iti--separate-dial-code .iti__selected-dial-code {
            display: block;
            color: #2C3E50;
            margin-left: 4px;
        }
        .iti__arrow {
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 5px solid #555;
            margin-left: 4px;
        }
        .iti--separate-dial-code input {
            padding-left: 90px !important;
        }
        .iti__country-list {
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
            border: 1px solid #e1e8ed;
        }
    `;
    document.head.appendChild(style);

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

    // PLZ-Validierung
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
            
            // Telefonnummer mit vollständiger internationaler Nummer übernehmen
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
        phoneInputElement.placeholder = 'z.B. 123 45678900';
    }
});
