const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        // konfigurasi CORS (cross origin resource sharing)
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // route configuration
    server.route(routes);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();