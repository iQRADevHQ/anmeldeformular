import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    // Telefon-Input Initialisierung
    const phoneInputElement = document.querySelector("#phone");
    phoneInput = window.intlTelInput(phoneInputElement, {
        initialCountry: "de",
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true,
        formatOnDisplay: true,
        nationalMode: false,
        autoHideDialCode: false,
        allowDropdown: true,
        customPlaceholder: function(selectedCountryData) {
            return "Telefonnummer";
        }
    });

    // Telefonnummer-Validierung
    phoneInputElement.addEventListener('blur', function() {
        validatePhoneNumber(this);
    });

    function validatePhoneNumber(element) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'phone-error';
        errorMsg.style.cssText = 'color: red; font-size: 14px; margin-top: 5px;';

        const existingError = element.parentNode.querySelector('.phone-error');
        if (existingError) {
            existingError.remove();
        }

        if (!phoneInput.isValidNumber()) {
            const errorCode = phoneInput.getValidationError();
            let errorMessage = '';
            
            switch(errorCode) {
                case intlTelInputUtils.validationError.TOO_SHORT:
                    errorMessage = 'Nummer zu kurz';
                    break;
                case intlTelInputUtils.validationError.TOO_LONG:
                    errorMessage = 'Nummer zu lang';
                    break;
                case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
                    errorMessage = 'Ungültige Ländervorwahl';
                    break;
                default:
                    errorMessage = 'Ungültige Nummer';
            }
            
            errorMsg.textContent = errorMessage;
            element.parentNode.appendChild(errorMsg);
            return false;
        }
        return true;
    }

    // PLZ Validierung
    const plzInput = document.getElementById('plz');
    if (plzInput) {
        plzInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d]/g, '');
            if (this.value.length > 5) {
                this.value = this.value.slice(0, 5);
            }
        });
    }

    // Namen Validierung (nur Buchstaben und Bindestriche)
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
            // E-Mail-Format Validierung
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                throw new Error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
            }

            // PLZ Validierung
            const plzInput = document.getElementById('plz');
            if (plzInput.value.length !== 5 || !/^\d+$/.test(plzInput.value)) {
                throw new Error("Bitte geben Sie eine gültige PLZ ein (5 Ziffern)");
            }

            // Telefonnummer Validierung
            if (!phoneInput.isValidNumber()) {
                throw new Error("Bitte geben Sie eine gültige Telefonnummer ein");
            }

            // Checkbox-Felder Validierung
            if (!document.getElementById('agb').checked) {
                throw new Error("Bitte akzeptieren Sie die AGBs");
            }
            if (!document.getElementById('faq').checked) {
                throw new Error("Bitte bestätigen Sie, dass Sie die FAQ gelesen haben");
            }

            // Formulardaten sammeln
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            
            // Telefonnummer mit vollständiger internationaler Nummer übernehmen
            data.phone = phoneInput.getNumber();
            
            console.log('Formulardaten werden gesendet:', data);
            
            // Formular absenden
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
});
