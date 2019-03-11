/***** Importaciones *****/
// Antes de nada, el gestor de alias de requires
require('module-alias/register');

// Módulos de terceros
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
// const csurf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

//const events = require("events");
//const emitter = new events.EventEmitter();

// Configuración
const config = require('@config/config');
// Creo un logger winston
const logger = require('@config/winston')(config);
// Módulo de Router principal
const router = require('@routes');
// Módulo de errores de API
const errors = require('@handlers/api-errors');
// Configuración de log de HTTP Morgan
const configMorgan = require('@config/morgan')(config);

/***** Genero la applicación con Express *****/
let app = express();

/***** Middlewares *****/
// Helmet para temas de seguridad
app.use(helmet());
app.use(helmet.noCache());
// Prevención de HTTP Pullution
app.use(hpp({}));

// Parseador del body de las respuestas
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// CSRF: para evitar ataques CSRF. Hay que gestionar el envío del token a la web -> https://github.com/expressjs/csurf
// app.use(csurf({cookie: true}));

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

// Por último, manejamos los errores genéricos del API
app.use(errors.logApiErrors);
app.use(errors.apiErrorHandler);

/***** Levanto el servidor *****/
let server = app.listen(config.server.port, () => {
    logger.info('Servidor arrancado y escuchando en %s. Debug=%s', config.server.port, config.debugMode);
});

// Si estoy en tests guardo la variable del servidor
if (global.testModeExecution) {
    app.set('listeningServer', server);
}

// Handler de excepciones no gestionadas
require('@handlers/exceptions')({apiServer: server});

module.exports = app;
