export function validateForm(event, phoneInput) {
    event.preventDefault();
    
    if (!phoneInput.isValidNumber()) {
        showError("Bitte geben Sie eine gültige Telefonnummer ein.");
        return false;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.phone = phoneInput.getNumber();

    return data;
}

export function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    document.getElementById('registrationForm').reset();
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

export function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}
