const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");
const cosmosDbConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = "TuneWalkerDB";
const containerId = "Songs";

app.http('LoadSongs', {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const cosmosClient = new CosmosClient(cosmosDbConnectionString);
            const database = cosmosClient.database(databaseName);
            const container = database.container(containerId);
            console.log("Connesso a Cosmos DB");

            const formData = await request.formData();
            const userId = formData.get("userId"); // Prendi il file dal form
            let querySpec;

            // Se l'ID utente non è fornito, prendi le canzoni generali
            if (!userId) {
                querySpec = {
                    query: "SELECT TOP 100 * FROM c ORDER BY c.lastModified DESC"
                };
            } else {
                // Altrimenti, filtra per userId
                querySpec = {
                    query: "SELECT TOP 12 * FROM c WHERE c.userId = @userId ORDER BY c.lastModified DESC", 
                    parameters: [
                        {
                            name: "@userId",
                            value: userId
                        }
                    ]
                };
            }

            // Esegui la query per ottenere i brani
            let { resources: songs } = await container.items.query(querySpec).fetchAll();
            

            //taglia le canzoni con stesso artista + titolo 
            if (!userId) {
                const uniqueSongs = [];
                const seen = new Set();
                for (const song of songs) {
                    const key = (song.title.trim().toLowerCase() + "|" + song.artist.trim().toLowerCase());
                    if (!seen.has(key)) {
                        uniqueSongs.push(song);
                        seen.add(key);
                    }
                    if (uniqueSongs.length >= 12) break; // prendi solo le prime 12
                }
                songs=uniqueSongs
            }


            console.log("Can songs retrieved:", songs);

            // Restituisce la lista delle canzoni in formato JSON
            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songs })
            };

        } catch (error) {
            console.log("Errore:", error);
            return { status: 500, body: "Errore durante il recupero delle canzoni." };
        }
    }
});
