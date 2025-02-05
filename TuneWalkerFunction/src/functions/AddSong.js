const { app } = require('@azure/functions');

app.http('AddSong', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",  // O il tuo dominio specifico
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
                body: ''
            };
        }
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name');

        // Creare un oggetto JSON con il risultato
        const response = {
            success: true,
            message: `Hello, ${name}!`,
        };

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Abilita CORS per tutti
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(response)
        };
    }
});
