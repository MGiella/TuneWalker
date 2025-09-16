const { app } = require('@azure/functions');
const { BlobServiceClient } = require("@azure/storage-blob");
const { CosmosClient } = require("@azure/cosmos");
const connectionString = process.env.AzureWebJobsStorage;
const cosmosDbConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = "TuneWalkerDB";
const containerId = "Songs";
const containerName = "songs"; 

app.http('DeleteSong', {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const formData = await request.formData();
            const songId = formData.get("songId");

            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(songId);
            blockBlobClient.delete()

            console.log(`Eliminando il blob: ${songId}`);

            const cosmosClient = new CosmosClient(cosmosDbConnectionString);
            const database = cosmosClient.database(databaseName);
            const container = database.container(containerId);
            console.log("Cosmos caricato")

            // Rimuovi il documento da Cosmos DB che corrisponde all'ID del file
             const { resource: song } = await container.item(songId).read();

             if (!song) {
                 return { status: 404, body: "Canzone non trovata in Cosmos DB!" };
             }
 
             // Eliminazione del documento da Cosmos DB
             await container.item(songId).delete();
             console.log("Documento eliminato da Cosmos DB");

            // Restituisce l'URL pubblico del file
            //const videoUrl = blockBlobClient.url;
           return {
                status: 200,
                body: JSON.stringify({ message: "Canzone eliminata correttamente!" })
            };

        } catch (error) {
            console.error("Errore durante l'eliminazione:", error);
            return { status: 500, body: "Errore durante l'eliminazione della canzone." };
        }
    }
});
