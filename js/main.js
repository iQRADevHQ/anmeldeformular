import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    const phoneInputElement = document.querySelector("#phone");
    
    // Verbesserte Konfiguration des International Telephone Input
    phoneInput = window.intlTelInput(phoneInputElement, {
        initialCountry: "de",
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true,    // Zeigt Ländervorwahl getrennt an
        formatOnDisplay: true,
        nationalMode: false,       // Ermöglicht internationale Formatierung
        autoHideDialCode: false,   // Ländervorwahl immer sichtbar
        autoPlaceholder: "polite", // Zeigt Platzhalter im nationalen Format
        customPlaceholder: function(selectedCountryData) {
            // Länderspezifische Platzhalter
            const placeholders = {
                de: "1511 2345678",
                at: "664 1234567",
                ch: "79 123 45 67"
            };
            return placeholders[selectedCountryData.iso2] || "123 45678900";
        }
    });

    // Echtzeit-Formatierung während der Eingabe
    phoneInputElement.addEventListener('input', function() {
        const number = phoneInput.getNumber();
        
        // Automatische Formatierung mit Leerzeichen
        if (number) {
            let formattedNumber = number.replace(/[\s\-]/g, '')  // Entferne bestehende Formatierung
                                      .replace(/(\d{3})(\d{4})(\d+)/g, '$1 $2 $3');  // Neue Formatierung
            
            // Setze nur wenn sich die Nummer wirklich geändert hat
            if (this.value !== formattedNumber) {
                this.value = formattedNumber;
            }
        }
    });

    // Verbesserte Validierung mit detaillierten Fehlermeldungen
    phoneInputElement.addEventListener('blur', function() {
        validatePhoneNumber(this);
    });

    function validatePhoneNumber(element) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'phone-error';
        errorMsg.style.cssText = 'color: red; font-size: 14px; margin-top: 5px;';

        // Entferne vorherige Fehlermeldungen
        const existingError = element.parentNode.querySelector('.phone-error');
        if (existingError) {
            existingError.remove();
        }

        if (!phoneInput.isValidNumber()) {
            const errorCode = phoneInput.getValidationError();
            const selectedCountry = phoneInput.getSelectedCountryData();
            let errorMessage = 'Hinweis: ';
            
            switch(errorCode) {
                case intlTelInputUtils.validationError.TOO_SHORT:
                    errorMessage += `Mindestlänge für ${selectedCountry.name}: ${phoneInput.getCountryData().find(c => c.iso2 === selectedCountry.iso2)?.minLength} Ziffern`;
                    break;
                case intlTelInputUtils.validationError.TOO_LONG:
                    errorMessage += `Maximallänge für ${selectedCountry.name}: ${phoneInput.getCountryData().find(c => c.iso2 === selectedCountry.iso2)?.maxLength} Ziffern`;
                    break;
                case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
                    errorMessage += 'Bitte wählen Sie ein gültiges Land aus.';
                    break;
                case intlTelInputUtils.validationError.INVALID_LENGTH:
                    errorMessage += `Ungültige Länge für ${selectedCountry.name}`;
                    break;
                default:
                    errorMessage += `Beispielformat für ${selectedCountry.name}: ${phoneInput.customPlaceholder(selectedCountry)}`;
            }
            
            errorMsg.textContent = errorMessage;
            element.parentNode.appendChild(errorMsg);
            return false;
        }
        return true;
    }

    // Zusätzliche Validierung im Formular
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Prüfe Telefonnummer vor dem Submit
        if (!validatePhoneNumber(phoneInputElement)) {
            showError("Bitte geben Sie eine gültige Telefonnummer ein");
            return;
        }

        // Rest des Submit-Handlers...
    });
});

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
