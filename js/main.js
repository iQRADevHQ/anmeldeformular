import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    const phoneInputElement = document.querySelector("#phone");
    phoneInput = window.intlTelInput(phoneInputElement, {
        initialCountry: "de",
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: false,     // Ländervorwahl im Input-Feld integriert
        formatOnDisplay: true,
        nationalMode: false,         // Ermöglicht internationale Formatierung
        autoHideDialCode: false,     // Ländervorwahl immer sichtbar
        allowDropdown: true,         // Erlaubt Länderauswahl
        dropdownContainer: document.body,
        // Styling für das Flag-Container
        customContainer: "iti-flag-container",
        // Angepasste Platzhalter
        customPlaceholder: function(selectedCountryData) {
            const placeholders = {
                de: "Phone",
                at: "Phone",
                ch: "Phone",
                gb: "Phone",
                us: "Phone"
            };
            return placeholders[selectedCountryData.iso2] || "Phone";
        }
    });

    // Styling für das Telefon-Input
    const phoneContainer = phoneInputElement.parentElement;
    phoneContainer.style.cssText = `
        position: relative;
        width: 100%;
        margin-bottom: 15px;
    `;

    // Styling für das Input-Feld
    phoneInputElement.style.cssText = `
        width: 100%;
        padding: 10px 10px 10px 90px; /* Extra Platz links für die Flagge und Vorwahl */
        border: 1px solid #e1e1e1;
        border-radius: 25px;
        font-size: 16px;
        outline: none;
    `;

    // Zusätzliches CSS für die Flaggen-Dropdown
    const style = document.createElement('style');
    style.textContent = `
        .iti__country-list {
            border-radius: 10px;
            margin-top: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .iti__flag-container {
            padding-left: 15px;
        }
        .iti__selected-flag {
            padding: 0 10px;
            background: transparent !important;
        }
        .iti__selected-flag:hover, .iti__selected-flag:focus {
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);

    // Rest Ihrer Validierungslogik...
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
            const selectedCountry = phoneInput.getSelectedCountryData();
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

    // Aktualisiere Platzhalter bei Länderänderung
    phoneInputElement.addEventListener('countrychange', function() {
        this.placeholder = phoneInput.customPlaceholder(phoneInput.getSelectedCountryData());
        validatePhoneNumber(this);
    });

    // Setze initialen Platzhalter
    phoneInputElement.placeholder = phoneInput.customPlaceholder(phoneInput.getSelectedCountryData());
});

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

            // Validiere Telefonnummer
            if (!phoneInput.isValidNumber()) {
                throw new Error("Bitte geben Sie eine gültige Telefonnummer ein");
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
});
