// Funzione per verificare se l'utente è autenticato
async function checkAuthentication() {
    try {
        // Chiedi le informazioni dell'utente tramite il punto finale .auth/me
        const authResponse = await fetch('/.auth/me', { credentials: 'include' });    
          
        if (authResponse.ok) {  
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


// Funzione per visualizzare i video
function displayVideos(videos) {
    const gallery = document.getElementById('videoGallery');
    gallery.innerHTML = '';  // Pulisce la galleria prima di aggiungere nuovi video
    
    videos.forEach(video => {
        // Crea un nuovo elemento video
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');

        videoItem.innerHTML = `
            <video controls class="video">
                <source src="${video.url}" type="video/mp4">
                Il tuo browser non supporta il formato video.
            </video>
            <div>
                <h3>${video.title} by ${video.artist}</h3>
                <button onclick="deleteItem("${video.id}")">Cancella canzone</button>
            </div>
        `;

        gallery.appendChild(videoItem);
    });
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
            console.error('Errore nel caricamento dei video:', songResponse.status);
            alert('Errore nel caricamento dei video');
        }
    } catch (error) {
            console.error('Errore nel caricamento dei video:', songResponse.status);
            alert('Errore nel caricamento dei video');
            }

}

async function deleteItem(songId){
    
    // Chiamata API per cancellare la canzone dal server
    const formData = new FormData();
    formData.append("songId", songId);
    try{
        const response = await fetch('https://tunewalkerfunctions.azurewebsites.net/api/DeleteSong', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            checkAuthentication()
        } else {
            alert("Errore nel cancellare la canzone.");
        }
    } catch (error) {
            console.error("Errore durante la cancellazione:", error);
            alert("Errore durante la cancellazione della canzone.");
        }
}   

window.onload = checkAuthentication;
