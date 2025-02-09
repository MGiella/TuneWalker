const { app } = require('@azure/functions');
const { BlobServiceClient } = require("@azure/storage-blob");
const connectionString = process.env.AzureWebJobsStorage;
const containerName = "songs"; 

app.http('AddSong', {
    mmethods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const formData = await request.formData();
            const file = formData.get("song"); // Prendi il file dal form
            const songName = formData.get("songName")
            const author = formData.get("author")
            if (!file) {
                return { status: 400, body: "Nessun file ricevuto!" };
            }
            console.log("file ricevuto")

            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobName = `${songName} by ${author}.mp4`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Carica il file nel Blob Storage
            await blockBlobClient.uploadData(await file.arrayBuffer(), {
                blobHTTPHeaders: { blobContentType: "video/mp4" },
                metadata: {
                    songName: songName,
                    author: author
                }
            });
            console.log("caricato")
            // Restituisce l'URL pubblico del file
            const videoUrl = blockBlobClient.url;
            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: videoUrl })
            };

        } catch (error) {
            context.log.error("Errore:", error);
            return { status: 500, body: "Errore durante il caricamento." };
        }
    }
});
