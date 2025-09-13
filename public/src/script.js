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
    try {
        const formData = new FormData();
        const authResponse = await fetch('/.auth/me', { credentials: 'include' });
            // Se l'utente è autenticato, invia una richiesta con userId
        const authData = await authResponse.json();
        const userId = authData[0].user_id;
        formData.append("userId", userId);
        songResponse = await fetch(`https://tunewalkerfunctions.azurewebsites.net/api/LoadSongs`, {
            method: "POST",
            body: formData
        });
        // Verifica se la risposta è ok
        if (songResponse.ok) {
            const data = await songResponse.json();
            displayVideos(data.songs);  // Chiamata alla funzione che visualizzerà i video
        } else {
            console.error('Errore nel caricamento dei video:', response.status);
            alert('Errore nel caricamento dei video');
        }

      
    } catch (error) {
        try{
            const formData = new FormData();
            songResponse = await fetch('https://tunewalkerfunctions.azurewebsites.net/api/LoadSongs', {
                method: 'POST',
                  body: formData
            });
            if (songResponse.ok) {
                const data = await songResponse.json();
                displayVideos(data.songs);
            } else {
                console.error('Errore nel caricamento dei video:', response.status);
                alert('Errore nel caricamento dei video');
            }
        } catch (error) {
            console.log(error)
    }}
    
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
                const videoUrl = result.url;
                document.getElementById("anteprima").style.display="block";
                document.getElementById("videoSource").src = videoUrl;
                document.getElementById("videoPlayer").load();
                } else {
                    alert("Errore durante l'upload: " + result.error);
                }
            } catch (error) {
                console.error("Errore:", error);
                    alert("Errore durante la richiesta.");
                }
                    LoadSongs()

            }
    
