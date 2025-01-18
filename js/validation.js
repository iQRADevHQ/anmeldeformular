// validation.js
export function showLoading() {
    const modal = document.getElementById('successModal');
    const modalHeader = modal.querySelector('.modal-header h3');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    
    // Ladekreis HTML
    const loadingSpinner = `
        <div class="spinner" style="
            width: 50px;
            height: 50px;
            border: 5px solid rgba(0, 158, 227, 0.2);
            border-top: 5px solid #009ee3;
            border-radius: 50%;
            margin: 20px auto;
            animation: spin 1s linear infinite;
        ">
        </div>
    `;
    
    // Modal-Stil ändern
    modalHeader.textContent = 'Registrierung wird verarbeitet';
    modalBody.innerHTML = loadingSpinner + '<p>Bitte warten Sie einen Moment...</p>';
    modalFooter.style.display = 'none';
    
    // Modal anzeigen
    modal.style.display = 'block';
    
    // Ladeanimation CSS
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    return modal;
}

export function showSuccess() {
    const modal = document.getElementById('successModal');
    
    // Stelle sicher, dass das Modal sichtbar ist
    modal.style.display = 'block';
    
    const modalHeader = modal.querySelector('.modal-header h3');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    
    // Modal-Inhalt zurücksetzen
    modalHeader.textContent = 'Erfolgreich gesendet!';
    modalBody.innerHTML = '<p>Ihre Anmeldung wurde erfolgreich übermittelt! Sie erhalten in Kürze eine Bestätigungs-E-Mail.</p>';
    modalFooter.style.display = 'block';
    
    // Close-Button Event Listener
    const closeButton = modal.querySelector('.close-button');
    const modalBtn = modal.querySelector('.modal-btn');
    
    // Vorherige Event Listener entfernen
    const closeModal = () => {
        modal.style.display = 'none';
    };
    
    // Alte Event Listener entfernen
    closeButton.onclick = closeModal;
    modalBtn.onclick = closeModal;
    
    // Schließen bei Klick außerhalb des Modals
    const outsideClickHandler = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Alte Event Listener entfernen
    window.removeEventListener('click', outsideClickHandler);
    window.addEventListener('click', outsideClickHandler);
    
    // Escape-Taste Listener
    const escapeHandler = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };
    
    // Alte Event Listener entfernen
    window.removeEventListener('keydown', escapeHandler);
    window.addEventListener('keydown', escapeHandler);
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
