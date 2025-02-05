document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("addSongButton").addEventListener("click", async function() {
            console.log("cliccato");
            
            let songName = document.getElementById("songName").value.trim();
            if (!songName) {
                document.getElementById("output").innerText = "Inserisci un nome!";
                return;
            }

            try {
                let response = await fetch(`https://tunewalkerfunctions.azurewebsites.net/api/addsong?name=${encodeURIComponent(songName)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
    
                if (!response.ok) {
                    throw new Error("Errore: " + response.status);
                }
    
                let data = await response.json(); // Converte la risposta JSON
                document.getElementById("output").innerText = `${data.message}`;
            } catch (error) {
                document.getElementById("output").innerText = "Errore: " + error.message;
            }
        });        
    });