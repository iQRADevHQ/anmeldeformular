// main.js
import { showSuccess, showError } from './validation.js';
import { submitForm } from './api.js';

let phoneInput;

document.addEventListener('DOMContentLoaded', () => {
    // Telefon-Input initialisieren
    const phoneInputElement = document.querySelector("#phone");
    
    // Container für Telefon-Input und Fehlermeldung erstellen
    const phoneContainer = document.createElement('div');
    phoneContainer.className = 'phone-input-container';
    phoneInputElement.parentNode.insertBefore(phoneContainer, phoneInputElement);
    phoneContainer.appendChild(phoneInputElement);

    // Erstelle Container für Fehlermeldung
    const errorContainer = document.createElement('div');
    errorContainer.className = 'phone-error-container';
    phoneContainer.appendChild(errorContainer);

    // Zusätzliche CSS-Regeln
    const style = document.createElement('style');
    style.textContent = `
        .phone-input-container {
            position: relative;
            width: 100%;
        }
        .phone-error-container {
            margin-top: 5px;
            min-height: 20px;
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
        .phone-error {
            color: red;
            font-size: 14px;
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

    // Zeige Validierungsfehler direkt beim Tippen als Hilfestellung
    phoneInputElement.addEventListener('blur', function() {
        // Entferne vorherige Fehlermeldungen
        errorContainer.innerHTML = '';

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
            
            const errorElement = document.createElement('div');
            errorElement.className = 'phone-error';
            errorElement.textContent = errorMessage;
            errorContainer.appendChild(errorElement);
        }
    });

    // Rest des Codes bleibt gleich...
    // [Rest des Codes von vorher bleibt unverändert]
});
