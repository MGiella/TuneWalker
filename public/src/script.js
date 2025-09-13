document.addEventListener('DOMContentLoaded', async () => {
    // Ottieni i dati dalla funzione Azure
    LoadSongs()
    });
    

// Funzione per visualizzare i video
function displayVideos(videos) {
    const gallery = document.getElementById('videoGallery');
    gallery.innerHTML = '';  // Pulisce la galleria prima di aggiungere nuovi video
    
    videos.forEach(video => {
        // Crea un nuovo elemento video
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
    
    });
}


async function LoadSongs() {
    let formData = new FormData();

    try {
        // Controlla se l'utente è autenticato
        const authResponse = await fetch('/.auth/me', { credentials: 'include' });
        if (authResponse.ok) {
            const authData = await authResponse.json();
            if (authData.length > 0) {
                const userId = authData[0].user_id;
                formData.append("userId", userId);
            }
        }
    } catch (error) {
        console.log("Utente non autenticato, procederò senza userId");
    }

    try {
        // Chiamata alla Function Azure
        const songResponse = await fetch(
            'https://tunewalkerfunctions.azurewebsites.net/api/LoadSongs',
            { method: "POST", body: formData }
        );

        if (songResponse.ok) {
            const data = await songResponse.json();
            // displayVideos si occupa di visualizzare le canzoni
            displayVideos(data.songs);
        } else {
            console.error('Errore nel caricamento dei video:', songResponse.status);
            alert('Errore nel caricamento dei video');
        }
    } catch (error) {
        console.error("Errore durante la fetch:", error);
        alert('Errore nel caricamento dei video');
    }
}

