const logger = require('winston').loggers.get('logger');

/**
 * Cierra los servicios uno a uno
 * @param services Array con los servicios a cerrar
 * @returns {Promise<void>} Devuelve un Promise, es una función asíncrona
 */
async function closeServices(services) {
    // Si viene API
    if (services.apiServer !== null && services.apiServer !== undefined) {
        // Espero a que termine de cerrarse el servidor API
        await closeApiServer(services.apiServer);
    }
}

/**
 * Cierro el servidor API
 * @param server
 * @returns {Promise<any>}
 */
function closeApiServer(server) {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
            } else {
                logger.info('Servidor API cerrado');
                resolve();
            }
        });
    });
}

/**
 * Salgo de la aplicación de forma controlada
 * @param code Código de salida: 0 OK, 1 error
 */
function exitProcess(code = 0) {
    logger.on('finish', function () {
        process.exit(code);
    });
}

/**
 *  Proceso todas las excepciones que no se han gestionado antes
 */
module.exports = function (services) {
    // Gestionamos las peticiones rechazadas que no se han gestionado antes
    process.on('unhandledRejection', (reason, p) => {
        // Capturo una unhandled promise rejection, le paso la excepción al gestor uncaughtExceptions
        throw reason;
    });
    // Lo mismo con las excepciones
    process.on('uncaughtException', (error) => {
        logger.error('%O', error);
    });

    // Si llega la señal SIGTERM, cierro el servidor antes de finalizar
    // podemos enviar la señal desde el programa: process.kill(process.pid, 'SIGTERM')
    process.on('SIGTERM', function () {
        logger.info('Cerrando servicios antes de salir');
        // Cierro todo
        closeServices(services)
            .then(() => {
                exitProcess();
            })
            .catch((error) => {
                logger.error('%O', error);
                exitProcess(1);
            });
    });
};
