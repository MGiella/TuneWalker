// Funzione per verificare se l'utente è autenticato
async function checkAuthentication() {
    try {
        // Chiedi le informazioni dell'utente tramite il punto finale .auth/me
        const authResponse = await fetch('/.auth/me', { credentials: 'include' });        if (response.ok) {
        const authData = await authResponse.json();
        const userId = authData[0].user_id;
        LoadAllSongs(userId)
        } else {
            const returnUrl = encodeURIComponent(window.location.pathname); // Salva la pagina attuale
            window.location.href = `https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/login/google?post_login_redirect_uri=${returnUrl}`;
        }
    } catch (error) {
        const returnUrl = encodeURIComponent(window.location.pathname); // Salva la pagina attuale
        window.location.href = `https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/login/google?post_login_redirect_uri=${returnUrl}`;

    }
}

async function LoadAllSongs(userId) {
    try {
        const formData = new FormData();
        formData.append("userId", userId);
        songResponse = await fetch(`https://tunewalkerfunctions.azurewebsites.net/api/LoadPersonalSongs`, {
            method: "POST",
            body: formData
        });
        // Verifica se la risposta è ok
        if (songResponse.ok) {
            const data = await songResponse.json();
            if (data.songs && data.songs.length > 0) {
                document.getElementById("noSongs").style.display = "none"; 
                displayVideos(data.songs);  // Chiamata alla funzione che visualizzerà
            } else {
                console.log("Nessuna canzone disponibile.");
                document.getElementById("noSongs").style.display = "block"; // Mostra il messaggio "Nessuna canzone"
            }
        } else {
            console.error('Errore nel caricamento dei video:', response.status);
            alert('Errore nel caricamento dei video');
        }
    } catch (error) {
            console.error('Errore nel caricamento dei video:', response.status);
            alert('Errore nel caricamento dei video');
            }

}

window.onload = checkAuthentication;
