/***** Importaciones *****/
// Antes de nada, el gestor de alias de requires
require('module-alias/register');

// Módulos de terceros
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//const events = require("events");
//const emitter = new events.EventEmitter();

// Configuración
const config = require('@config/config');
// Configuración de log de HTTP Morgan
const configMorgan = require('@config/morgan')(config);
// Módulo de errores
const errors = require('@common/handlers/errors');
// Módulo de Router principal
const router = require('@routes/router');
// Creo un logger winston
const logger = require('@config/winston')(config);

/***** Genero la applicación con Express *****/
let app = express();

/***** Middlewares *****/
// Helmet para temas de seguridad
app.use(helmet());
app.use(helmet.noCache());

// Parseador del body de las respuestas
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Morgan para loguear las peticiones al API (requests)
if (config.debugMode) {
    // Log completo a consola
    app.use(morgan(config.logger.morganFormatDevelopment));
}
// Logueo a fichero
app.use(morgan(config.logger.morganFormatProduction, {stream: configMorgan.accessLogStream}));

// Montamos las rutas en el raíz
app.use('/api', router);

// Si la petición no ha sido atendida por ningún endpoint anterior, es un 404
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Por último, manejamos los errores genéricos
app.use(errors.logErrors);
app.use(errors.clientErrorHandler);
app.use(errors.errorHandler);

/***** Levanto el servidor *****/
let server = app.listen(config.server.port, () => {
    logger.info('Servidor arrancado y escuchando en %s. Debug=%s', config.server.port, config.debugMode);
});

// Si estoy en tests guardo la variable del servidor
if (global.testModeExecution) {
    app.set('listeningServer', server);
}

// Si llega la señal SIGTERM, cierro el servidor antes de finalizar
// podemos enviar la señal desde el programa: process.kill(process.pid, 'SIGTERM')
process.on('SIGTERM', function () {
    server.close(function () {
        // Aquí podría cerrar otros servidores como bases de datos etc
        process.exit(0);
    });
});

module.exports = app;
