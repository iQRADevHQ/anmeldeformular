// validation.js
export function showSuccess() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    
    // Close-Button Event Listener
    const closeButton = modal.querySelector('.close-button');
    const modalBtn = modal.querySelector('.modal-btn');
    
    const closeModal = () => {
        modal.style.display = 'none';
    };
    
    closeButton.addEventListener('click', closeModal);
    modalBtn.addEventListener('click', closeModal);
    
    // Schließen bei Klick außerhalb des Modals
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Modal mit Escape-Taste schließen
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
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
