// Funzione per verificare se l'utente è autenticato
async function checkAuthentication() {
    try {
        // Chiedi le informazioni dell'utente tramite il punto finale .auth/me
        const response = await fetch('https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/me');
        if (response.ok) {
            // Se lo stato della risposta è 200 (OK)
            const user = await response.json();
            console.log('Utente autenticato:', user);
        } else {
            // Se la risposta ha uno stato diverso da 200 (ad esempio 401 o 403)
            console.error('Errore di autenticazione, status:', response.status);
            if (response.status === 401) {
                // L'utente non è autenticato, reindirizza alla pagina di login
                window.location.href = '/.auth/login/google/callback';
            } else {
                // Gestisci altri errori
                console.error('Errore:', response.statusText);
            }
        }
    } catch (error) {
        const response = await fetch('https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/login/google/callback');

    }
}

// Chiamare la funzione per verificare l'autenticazione quando la pagina si carica
window.onload = checkAuthentication;


