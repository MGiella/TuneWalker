const { app } = require('@azure/functions');
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require("@azure/storage-blob");
const { CosmosClient } = require('@azure/cosmos');

// Variabili per Blob Storage
const connectionString = process.env.AzureWebJobsStorage;
const containerName = "songs";
const accountName = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_KEY;

// Variabili per Cosmos DB
const cosmosDbConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const cosmosClient = new CosmosClient(cosmosDbConnectionString);
const databaseId = "TuneWalkerDB";       
const containerId = "Songs";    

app.http('LoadSongs', {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            // Recupera i 12 documenti più recenti da Cosmos DB
            const querySpec = {
                query: "SELECT TOP 12 * FROM c ORDER BY c.lastModified DESC"
            };

            const { resources: songs } = await cosmosClient
                .database(databaseId)
                .container(containerId)
                .items.query(querySpec)
                .fetchAll();

            // Crea un BlobServiceClient per accedere al Blob Storage
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient(containerName);

            // Per ciascuna canzone, genera l'URL SAS e crea la proprietà 'display'
            const songsWithUrls = await Promise.all(songs.map(async (song) => {
                // Recupera il blob corrispondente usando il blobName salvato in Cosmos
                const blobName = song.blobName; // Assicurati che questo campo esista
                const blobClient = containerClient.getBlobClient(blobName);
                const sasUrl = await generateSasUrl(blobClient, blobName);

                return {
                    songName: song.songName,
                    author: song.author,
                    lastModified: song.lastModified,
                    videoUrl: sasUrl,
                    display: `${song.songName} by ${song.author}` // Formattazione per il frontend
                };
            }));

            return {
                status: 200,
                body: JSON.stringify(songsWithUrls),
                headers: { "Content-Type": "application/json" }
            };

        } catch (error) {
            context.log.error("Errore in LoadSongs:", error);
            return {
                status: 500,
                body: JSON.stringify({ error: error.message }),
                headers: { "Content-Type": "application/json" }
            };
        }
    }
});

// Funzione per generare l'URL SAS valido per 60 minuti
async function generateSasUrl(blobClient, blobName) {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 60); // SAS valido per 60 minuti

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const sasToken = generateBlobSASQueryParameters({
        containerName: containerName,
        blobName: blobName,
        permissions: BlobSASPermissions.parse("r"), // Permessi di sola lettura
        expiresOn: expiryDate
    }, sharedKeyCredential).toString();

    return `${blobClient.url}?${sasToken}`;
}
