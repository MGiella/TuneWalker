# TuneWalker

TuneWalker è una web application che permette agli utenti di caricare e ascoltare i propri file video musicali ovunque. Il progetto è ospitato su Microsoft Azure e utilizza diversi servizi cloud per garantire scalabilità e accessibilità.

## Funzionalità Utilizzate

- **Azure App Service**: Hosting della web app.
- **Azure Functions**: Backend serverless per gestire le operazioni sugli utenti e sui file video.
- **Azure Blob Storage**: Archiviazione dei file MP4.
- **Azure Cosmos DB**: Database per la gestione dei riferimenti ai file video.
- **Google Provider**: Autenticazione degli utenti.

## Struttura del Progetto

- **Frontend**: HTML, CSS, JavaScript (con chiamate alle Azure Functions).
- **Backend**: Azure Functions per gestire il caricamento e il recupero dei video.
- **Database**: Azure Cosmos DB per salvare i metadati dei file video e le informazioni sugli utenti.
- **Storage**: Azure Blob Storage per conservare i file MP4.
- **Autenticazione**: Gli utenti possono autenticarsi tramite il sistema di autenticazione di Google. 

## URL del Progetto

- **Web App**: [https://tunewalker-bub3fterazgbcyht.westeurope-01.azurewebsites.net/]



