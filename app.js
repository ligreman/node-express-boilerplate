/***** Argumentos de ejecución *****/
// Miro a ver si por argumentos me indican que estoy en modo test
process.argv.forEach((val) => {
    if (val === '--test') {
        global.testModeExecution = true;
    }
});

/*************************/
/***** Importaciones *****/
/*************************/
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
// Módulo de errores de API
const errors = require('@errors/api-errors');
// Configuración de log de HTTP Morgan
const configMorgan = require('@config/morgan')(config);

/***** Genero la applicación con Express *****/
let app = express();

configureExpressApp();

/**
 * Configuramos la aplicación Express que levanta el API
 */
function configureExpressApp() {

    /***** Middlewares *****/
    // Helmet para temas de seguridad
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(helmet.referrerPolicy({policy: 'same-origin'}));

    // Parseador del body de las respuestas
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    // CSRF: para evitar ataques CSRF. Hay que gestionar el envío del token a la web -> https://github.com/expressjs/csurf
    // app.use(csurf({cookie: true}));

    // Prevención de HTTP Pullution. Colocarlo después de haber parseado el body
    app.use(hpp({}));

    // Morgan para loguear las peticiones al API (requests)
    if (config.isDevelopment()) {
        // Log completo a consola
        app.use(morgan(config.logger.morganFormatDevelopment));
    }
    // Logueo a fichero
    app.use(morgan(config.logger.morganFormatProduction, {stream: configMorgan.accessLogStream}));

    // Montamos las rutas en el raíz
    // Módulo de Router principal
    const router = require('@routes');
    app.use('/api', router);

    // Si la petición no ha sido atendida por ningún endpoint anterior, es un 404
    app.use(function (req, res, next) {
        // Muestro un html de error
        let file = require('@errors/404.html');
        res.set('Content-Type', 'text/html')
            .send(file);
    });

    // Por último, manejamos los errores genéricos del API
    app.use(errors.logApiErrors);
    app.use(errors.apiErrorHandler);

    // Ahora ya arranco el servidor
    startServer();
}

/**
 * Arranca el servidor
 */
function startServer() {
    /*************************/
    /** Levanto el servidor **/
    /*************************/
    let server = app.listen(config.server.port, () => {
        logger.info('Server started and listening in %s. Environment=%s', config.server.port, config.environment);

        // Handler de excepciones no gestionadas
        require('@errors/exceptions')({apiServer: server});

        // Si estoy en tests guardo la variable del servidor
        if (global.testModeExecution) {
            app.set('listeningServer', server);
        }
    });
}

module.exports = app;
