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
            <video controls class="video">
                <source src="${video.videoUrl}" type="video/mp4">
                Il tuo browser non supporta il formato video.
            </video>
            <h3>${video.name}</h3>
        `;

        gallery.appendChild(videoItem);
    });
}



async function LoadSongs() {
    try {
        const response = await fetch('https://tunewalkerfunctions.azurewebsites.net/api/LoadSongs', {
            method: 'POST'
        });
            if (response.ok) {
                const videos = await response.json();
                displayVideos(videos);
            } else {
                console.error('Errore nel caricamento dei video');
            }
    } catch (error) {
        console.error("Errore:", error);
            alert("Errore durante la richiesta.");
        }
}
    
async function uploadVideo() {
    const songName = document.getElementById("songName").value
    const author = document.getElementById("author").value
    const fileInput = document.getElementById("videoInput");
    if (fileInput.files.length === 0) {
        alert("Seleziona un file prima di caricare!");
                        return;
    }
    console.log(songName + "by" + author )
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("song", file);
        formData.append("songName", songName);
        formData.append("author", author);

        
        try {
            const response = await fetch("https://tunewalkerfunctions.azurewebsites.net/api/addSong", {
            method: "POST",
                body: formData
            });
        
            const result = await response.json();
            if (response.ok) {
                const videoUrl = result.url;
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
    