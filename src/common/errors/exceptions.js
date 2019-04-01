const logger = require('winston').loggers.get('logger');
const {CriticalError} = require('@errors/custom-errors');

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
 * Salgo de forma controlada
 * @param services Objeto con los servicios que cerrar
 */
function shutdownGracefully(services) {
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
}

/**
 * Cierro la aplicación
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

        // Si el error es un CriticalError cierro
        if (error instanceof CriticalError) {
            logger.error('Critical error. Shutting down...');
            shutdownGracefully(services);
        }
    });


    // Gestiono la señal SIGINT
    process.on('SIGINT', function () {
        shutdownGracefully(services);
    });

    // Si llega la señal SIGTERM, cierro el servidor antes de finalizar
    // podemos enviar la señal desde el programa: process.kill(process.pid, 'SIGTERM')
    process.on('SIGTERM', function () {
        shutdownGracefully(services);
    });
};
