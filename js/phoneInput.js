// phoneInput.js
export class PhoneInputHandler {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.defaultOptions = {
            preferredCountries: ['de', 'at', 'ch'],
            initialCountry: 'de',
            separateDialCode: true,
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
            customContainer: 'form-group',
            ...options
        };
        this.iti = null;
        this.init();
    }

    init() {
        // Initialisiere das internationale Telefon-Input
        this.iti = window.intlTelInput(this.element, this.defaultOptions);

        // Event-Listener für Validierung
        this.element.addEventListener('blur', () => {
            this.validate();
        });

        // Event-Listener für Länderänderungen
        this.element.addEventListener('countrychange', () => {
            this.updatePlaceholder();
        });
    }

    validate() {
        if (this.element.value.trim()) {
            if (this.iti.isValidNumber()) {
                this.setValid();
                return true;
            } else {
                this.setError(this.getErrorMessage(this.iti.getValidationError()));
                return false;
            }
        }
        return true; // Leer ist auch okay (wenn nicht required)
    }

    getErrorMessage(errorCode) {
        const errorMap = {
            1: 'Ungültige Ländervorwahl',
            2: 'Telefonnummer zu kurz',
            3: 'Telefonnummer zu lang',
            4: 'Keine gültige Telefonnummer',
            5: 'Ungültiges Länderformat'
        };
        return errorMap[errorCode] || 'Ungültige Nummer';
    }

    setValid() {
        this.element.classList.remove('error');
        this.element.classList.add('valid');
        const errorElement = this.getErrorElement();
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    setError(message) {
        this.element.classList.remove('valid');
        this.element.classList.add('error');
        let errorElement = this.getErrorElement();
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'phone-error-message';
            this.element.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    getErrorElement() {
        return this.element.parentNode.querySelector('.phone-error-message');
    }

    updatePlaceholder() {
        const countryData = this.iti.getSelectedCountryData();
        const placeholder = this.getPlaceholderForCountry(countryData.iso2);
        this.element.setAttribute('placeholder', placeholder);
    }

    getPlaceholderForCountry(countryCode) {
        const placeholders = {
            'de': '0170 1234567',
            'at': '0664 1234567',
            'ch': '079 123 45 67'
        };
        return placeholders[countryCode] || 'Telefonnummer';
    }

    getNumber() {
        return this.iti.getNumber();
    }

    isValid() {
        return this.iti.isValidNumber();
    }

    destroy() {
        if (this.iti) {
            this.iti.destroy();
        }
    }
}

// Styles für das Telefon-Input
const style = document.createElement('style');
style.textContent = `
.iti {
    width: 100%;
}

.iti__flag {
    background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags.png");
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .iti__flag {
        background-image: url("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/img/flags@2x.png");
    }
}

.phone-error-message {
    display: none;
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

input.error {
    border-color: #dc2626 !important;
}

input.valid {
    border-color: #059669 !important;
}
`;

document.head.appendChild(style);

// Beispiel für die Verwendung:
/*
import { PhoneInputHandler } from './phoneInput.js';

document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = new PhoneInputHandler('phone');
});
*/
