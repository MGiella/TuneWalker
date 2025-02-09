const { app } = require('@azure/functions');
const { BlobServiceClient } = require("@azure/storage-blob");

const connectionString = process.env.AzureWebJobsStorage;
const containerName = "songs"; 

app.http('LoadSongs', {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            
            let blobs = [];
            // Itera su tutti i blob del container includendo le metadata
            for await (const blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
                blobs.push({
                    name: blob.name,
                    lastModified: blob.properties.lastModified
                });
            }

            // Ordina i blob per data di modifica (dal più recente al meno recente)
            blobs.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

            // Seleziona solo i primi 12 blob
            const latestBlobs = blobs.slice(0, 12);

            // Per ogni blob genera un URL SAS valido per 60 minuti
            const filesWithUrls = await Promise.all(latestBlobs.map(async (blob) => {
                const blobClient = containerClient.getBlobClient(blob.name);
                const sasUrl = await generateSasUrl(blobClient);
                return {
                    name: blob.name,
                    lastModified: blob.lastModified,
                    videoUrl: sasUrl
                };
            }));

            // Restituisci l'oggetto di risposta in formato JSON
            return {
                status: 200,
                body: JSON.stringify(filesWithUrls),
                headers: {
                    'Content-Type': 'application/json'
                }
            };

        } catch (error) {
            return {
                status: 500,
                body: { error: error.message },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
    }
});

// Funzione asincrona per generare l'URL SAS con validità di 60 minuti
async function generateSasUrl(blobClient) {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 60); // SAS valido per 60 minuti

    // Genera e restituisce l'URL SAS per il blob
    const sasUrl = await blobClient.generateSasUrl({
        permissions: "r",      // Permessi di sola lettura
        expiresOn: expiryDate  // Data di scadenza
    });
    return sasUrl;
}
