// Funzione per verificare se l'utente è autenticato in modo da visualizzare o meno contenuto personale
async function checkAuthentication() {
    try {
        // Chiedi le informazioni dell'utente tramite il punto finale .auth/me
        const response = await fetch('https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/me');
        if (response.ok) {
            // Se lo stato della risposta è 200 (OK)
            const user = await response.json();
            
            document.querySelectorAll('.anonymous-content').forEach(element => {
                element.style.display = 'none';
            });

            document.querySelectorAll('.private-content').forEach(element => {
                element.style.display = 'block'; 
            });
        } else {
            // Se la risposta ha uno stato diverso da 200 (ad esempio 401 o 403)
            console.error('Errore di autenticazione, status:', response.status);
            if (response.status === 401) {
                // L'utente non è autenticato, reindirizza alla pagina di login
                
                console.log('Utente non autenticato');

            } else {
                // Gestisci altri errori
                console.error('Errore:', response.statusText);
            }
        }
    } catch (error) {
        console.log(error)

    }
}


async function login() {
    const returnUrl = encodeURIComponent(window.location.pathname); // Salva la pagina attuale
    window.location.href = `https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/login/google?post_login_redirect_uri=${returnUrl}`;
    checkAuthentication()
}
// Chiamare la funzione per verificare l'autenticazione quando la pagina si carica
window.onload = checkAuthentication;

function showLoginMenu() {
    const returnUrl = encodeURIComponent(window.location.pathname); // Salva la pagina attuale
    document.getElementById("overlay").style.display = "flex";
    document.getElementById("GoogleButton").onclick = function() {
        window.location.href = `https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/.auth/login/google?post_login_redirect_uri=${returnUrl}`;
        };
    document.getElementById("MicrosoftButton").onclick = function() {
        window.location.href = `https://TuneWalkerusers.ciamlogin.com/11a32ef9-d633-4447-af78-1fdaa69d0945/v2.0?post_login_redirect_uri=${returnUrl}`;
        };
    }

    function closePopup() {
      document.getElementById("overlay").style.display = "none";
    }
