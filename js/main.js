import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    const phoneInputElement = document.querySelector("#phone");
    phoneInput = window.intlTelInput(phoneInputElement, {
        initialCountry: "de",
        preferredCountries: ["de", "at", "ch"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true,     // Zeigt Ländervorwahl separat an
        formatOnDisplay: true,
        nationalMode: false,         // Ermöglicht internationale Formatierung
        autoHideDialCode: false,     // Ländervorwahl immer sichtbar
        autoPlaceholder: "polite",   // Zeigt Platzhalter im lokalen Format
        customContainer: "w-full",   // Volle Breite für besseres Layout
        customPlaceholder: function(selectedCountryData) {
            const placeholders = {
                de: "151 12345678",
                at: "664 1234567",
                ch: "79 123 45 67",
                gb: "7400 123456",
                us: "201 555 0123",
                fr: "6 12 34 56 78",
                it: "312 345 6789",
                es: "612 345 678"
            };
            return placeholders[selectedCountryData.iso2] || "123 456 7890";
        }
    });

    // Formatierung während der Eingabe
    phoneInputElement.addEventListener('input', function() {
        if (this.value) {
            let number = this.value.replace(/[^\d+]/g, '');
            
            const countryData = phoneInput.getSelectedCountryData();
            if (countryData.iso2 === 'de') {
                number = number.replace(/(\d{3})(\d{3,4})(\d{4})$/, '$1 $2 $3');
            } else {
                number = number.replace(/(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');
            }
            
            if (this.value !== number) {
                this.value = number;
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
                    const minLength = phoneInput.getCountryData()
                        .find(c => c.iso2 === selectedCountry.iso2)?.minLength;
                    errorMessage = `Für ${selectedCountry.name} werden mindestens ${minLength} Ziffern benötigt`;
                    break;
                case intlTelInputUtils.validationError.TOO_LONG:
                    const maxLength = phoneInput.getCountryData()
                        .find(c => c.iso2 === selectedCountry.iso2)?.maxLength;
                    errorMessage = `Für ${selectedCountry.name} sind maximal ${maxLength} Ziffern erlaubt`;
                    break;
                case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
                    errorMessage = 'Bitte wählen Sie eine gültige Ländervorwahl';
                    break;
                case intlTelInputUtils.validationError.NOT_A_NUMBER:
                    errorMessage = 'Bitte geben Sie nur Zahlen ein';
                    break;
                default:
                    errorMessage = `Beispiel für ${selectedCountry.name}: ${phoneInput.customPlaceholder(selectedCountry)}`;
            }
            
            errorMsg.innerHTML = `${errorMessage}<br><small style="color: #666;">Die internationale Vorwahl wird automatisch ergänzt</small>`;
            element.parentNode.appendChild(errorMsg);
            return false;
        }
        return true;
    }

    // Style-Anpassungen für das Telefon-Input
    const phoneContainer = phoneInputElement.parentElement;
    phoneContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    `;

    // Setze initialen Platzhalter und Update bei Länderänderung
    phoneInputElement.placeholder = phoneInput.customPlaceholder(phoneInput.getSelectedCountryData());
    phoneInputElement.addEventListener('countrychange', function() {
        phoneInputElement.placeholder = phoneInput.customPlaceholder(phoneInput.getSelectedCountryData());
        validatePhoneNumber(this);
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
