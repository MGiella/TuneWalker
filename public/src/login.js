// Funzione per verificare se l'utente è autenticato
async function checkAuthentication() {
    try {
        // Chiedi le informazioni dell'utente tramite il punto finale .auth/me
        const response = await fetch('https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/me');
        const user = await response.json();

        if (user && user.length > 0) {
            // Utente autenticato, carica il contenuto protetto
            console.log('Utente autenticato:', user);
        } else {
            // Utente non autenticato, reindirizza alla pagina di login
            window.location.href = '/.auth/login/google';
        }
    } catch (error) {
        console.error('Errore nel recupero delle informazioni utente:', error);
    }
}

// Chiamare la funzione per verificare l'autenticazione quando la pagina si carica
window.onload = checkAuthentication;


