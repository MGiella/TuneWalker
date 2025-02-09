const { app } = require('@azure/functions');
const { BlobServiceClient } = require("@azure/storage-blob");
const { CosmosClient } = require("@azure/cosmos");
const connectionString = process.env.AzureWebJobsStorage;
const cosmosDbConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = "TuneWalkerDB";
const containerId = "Songs";
const containerName = "songs"; 

app.http('AddSong', {

    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const formData = await request.formData();
            const file = formData.get("song"); // Prendi il file dal form
            const songName = formData.get("title")
            const author = formData.get("artist")
            const userId = formData.get("userId");
            if (!file) {
                return { status: 400, body: "Nessun file ricevuto!" };
            }
            console.log("file ricevuto")

            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobName = `${userId}-${songName}-by-${author}.mp4`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            console.log("Blob caricato")

            const cosmosClient = new CosmosClient(cosmosDbConnectionString);
            const database = cosmosClient.database(databaseName);
            const container = database.container(containerId);
            console.log("Cosmos caricato")

            // Carica il file nel Blob Storage con i metadati
            await blockBlobClient.uploadData(await file.arrayBuffer(), {
                blobHTTPHeaders: { blobContentType: "video/mp4"  },
                metadata: { songName, author, userId }
            });
            console.log("Caricamento su Blob")


            const newSong = {
                id: blobName, // ID univoco
                userId: userId, 
                title: title,
                artist: artist,
                url: blockBlobClient.url,
                createdAt: new Date().toISOString()
            };

            await container.items.create(newSong);

            console.log("Caricamento completato");

            // Restituisce l'URL pubblico del file
            const videoUrl = blockBlobClient.url;
            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: videoUrl })
            };

        } catch (error) {
            console.log("Errore:", error);
            return { status: 500, body: "Errore durante il caricamento." };
        }
    }
});
