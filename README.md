# TuneWalker

## Obiettivo del progetto
Creare un sito web di musica che consenta agli utenti di:
1. Registrarsi e autenticarsi con il proprio account.
2. Creare e gestire playlist personali.
3. Ascoltare brani musicali.
4. Archiviare dati degli utenti e delle playlist in modo sicuro e scalabile.

## Servizi Azure utilizzati

### 1. Azure App Service (Hosting Web)
- Scopo: Ospitare il sito web front-end.
- Motivo della scelta:
  - Supporta un dominio personalizzato (`tunewalker.azurewebsites.net`).
  - Facile scalabilità e supporto per diversi stack (Node.js, Python, .NET, ecc.).
- Costo: Piano gratuito.
- Funzionalità:
  - Pubblicazione continua tramite GitHub.
  - Scalabilità automatica.
  - Supporto per API REST back-end.

### 2. Azure Functions (Back-end serverless)
- Scopo: Eseguire operazioni lato server (es. gestione playlist, richieste API).
- Motivo della scelta:
  - Paga solo per l'uso (piano gratuito fino a 1M di esecuzioni).
  - Ideale per operazioni asincrone e chiamate API leggere.
- Esempi di utilizzo:
  - Creazione e modifica delle playlist.
  - Recupero di file dal blob storage.

### 3. Azure Blob Storage (Archiviazione brani musicali e immagini)
- Scopo: Archiviare brani musicali, copertine di album e dati utenti.
- Motivo della scelta:
  - Economico e scalabile.
  - Supporta URL pubblici o privati con autorizzazioni granulari.
- Funzionalità:
  - Upload e download di file audio.
  - Generazione di link temporanei tramite SAS Token.
- Costo stimato: Basso.

### 4. Microsoft Entra ID (Autenticazione utente)
- Scopo: Gestire l'accesso sicuro degli utenti.
- Motivo della scelta:
  - Facile integrazione con App Service.
  - Sicurezza avanzata con autenticazione tramite Microsoft, Google, ecc.
- Funzionalità:
  - Accesso tramite provider OAuth.
  - Gestione sicura delle identità.
- Costo: Gratuito.

## Flusso dell'applicazione

1. L'utente accede al sito web ospitato su Azure App Service.
2. Effettua l'autenticazione tramite Entra ID.
3. Crea o aggiorna una playlist, interagendo con API su Azure Functions.
4. I file audio vengono caricati su Azure Blob Storage.
5. L'utente può ascoltare la musica direttamente dal blob storage.

## Tecnologie utilizzate

- **Frontend:** HTML, CSS, JavaScript (React).
- **Backend:** Node.js
- **Database:** Azure Blob Storage per memorizzare playlist e canzoni in formato JSON.
- **Version Control:** GitHub per il deployment continuo.

## Vantaggi del progetto

1. Costo contenuto.
2. Scalabilità automatica.
3. Sicurezza avanzata.
4. Facilità di gestione.

