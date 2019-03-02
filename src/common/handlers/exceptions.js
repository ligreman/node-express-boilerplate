const logger = require('winston');

// Cierra los servicios
function closeServices(services) {
    let promises = [];

    // Si viene API
    if (services.apiServer !== null && services.apiServer !== undefined) {
        promises.push(services.apiServer.close());
    }

    Promise.all(promises).then(() => {
        process.kill;
    });
    services.apiServer.close(function () {
        // Aquí podría cerrar otros servidores como bases de datos etc
        process.exit();
    });
}

// Proceso todas las excepciones que no se han gestionado antes
module.exports = function (services) {
    // Gestionamos las peticiones rechazadas que no se han gestionado antes
    process.on('unhandledRejection', (reason, p) => {
        // Capturo una unhandled promise rejection, le paso la excepción al gestor uncaughtExceptions
        throw reason;
    });
    // Lo mismo con las excepciones
    process.on('uncaughtException', (error) => {
        console.log('B');
        logger.error(error);
        // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
        process.exitCode = 1;
        process.kill(process.pid, 'SIGTERM');
    });

    // Si llega la señal SIGTERM, cierro el servidor antes de finalizar
    // podemos enviar la señal desde el programa: process.kill(process.pid, 'SIGTERM')
    process.on('SIGTERM', function () {
        logger.info('Cerrando servicios antes de salir');
        services.apiServer.close(function () {
            // Aquí podría cerrar otros servidores como bases de datos etc
            process.exit();
        });
    });
};
