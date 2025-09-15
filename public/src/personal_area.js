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
    try{
        const gallery = document.getElementById('videoGallery');
        gallery.innerHTML = '';  // Pulisce la galleria prima di aggiungere nuovi video
        console.log(videos)
        videos
        .forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');

            videoItem.innerHTML = `
                <div class="player">
                    <button class="delete_button" onclick="deleteItem('${video.id}')"></button>
                    <video controls class="video">
                        <source src="${video.url}" type="video/mp4">
                        Il tuo browser non supporta il formato video.
                    </video>
                </div>
                <h3 class="song-title">${video.title} by ${video.artist}</h3>
            `;
            gallery.appendChild(videoItem);
        });}
        catch(error){
            console.log(error)
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
        console.log(songResponse)
        // Verifica se la risposta è ok
        if (songResponse.ok) {
            const data = await songResponse.json();
            if (data.songs && data.songs.length > 0) {
                displayVideos(data.songs);  // Chiamata alla funzione che visualizzerà
            } else {
                console.log("Nessuna canzone disponibile.");
            }
        } else {
            console.error('Errore nel caricamento dei video:', songResponse.status);
        }
    } catch (error) {
            console.error('Errore nel caricamento dei video:', error);
            }

}

async function deleteItem(songId) {
    let userConfirmed = confirm("Sei sicuro di voler eliminare questa canzone?");
    if (!userConfirmed) {
        console.log("Canzone non cancellata");
        return;
    }

    const formData = new FormData();
    formData.append("songId", songId);

    try {
        const response = await fetch('https://tunewalkerfunctions.azurewebsites.net/api/DeleteSong', {
            method: 'POST',
            body: formData
        });
        console.log(songResponse);
        if (response.ok) {
            console.log("Canzone eliminata con successo!");
            // Aggiorna la lista delle canzoni senza ricaricare la pagina
            const authResponse = await fetch('/.auth/me', { credentials: 'include' });
            if (authResponse.ok) {
                const authData = await authResponse.json();
                const userId = authData[0].user_id;
                LoadAllSongs(userId);
            }
        } else {
            console.error(`Errore nel cancellare la canzone. Status: ${response.status}`);
            }
    } catch (error) {
        console.error("Errore durante la cancellazione:", error);
    }
}
async function uploadVideo() {
    const title = document.getElementById("title").value
    const artist = document.getElementById("artist").value
    const fileInput = document.getElementById("videoInput");
    const file = fileInput.files[0];

    if (!file || !title || !artist) {
        alert('Compila tutti i campi!');
        return;
      }

    const authResponse = await fetch('/.auth/me', { credentials: 'include' });
    const authData = await authResponse.json();
    const userId = authData[0].user_id;


    const formData = new FormData();
        formData.append("song", file);
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("userId", userId);

        
        try {
            const response = await fetch("https://tunewalkerfunctions.azurewebsites.net/api/addSong", {
            method: "POST",
                body: formData
            });
        
            const result = await response.json();
            if (response.ok) {
                LoadAllSongs(userId);
            } else {
                    console.log("Errore durante l'upload: " + result.error);
                }
            } catch (error) {
                    console.error("Errore:", error);
                    console.log("Errore durante la richiesta.");
                }

            }
    


document.addEventListener('DOMContentLoaded', checkAuthentication);