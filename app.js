/***** Importaciones *****/
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//const events = require("events");
//const emitter = new events.EventEmitter();

// Configuración
const config = require('./config/config');
// Configuración de log de HTTP Morgan
const configMorgan = require('./config/morgan')(config.logger);
// Módulo de errores
const errors = require('./common/handlers/errors');
// Módulo de Router principal
const router = require('./routes/router');
// Creo un logger winston
const logger = require('./config/winston')(config.logger);
// Suprimo los errores de logueo para evitar excepciones
logger.emitErrs = false;

/***** Genero la applicación con Express *****/
let app = express();

/***** Middlewares *****/
// Helmet para temas de seguridad
app.use(helmet());
app.use(helmet().noCache());

// Parseador del body de las respuestas
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Morgan para loguear las peticiones al API (requests)
if (config.debugMode) {
	// Log completo a consola
	app.use(morgan('dev'));
}
// Logueo a fichero
app.use(morgan('tiny', { stream: configMorgan }));

// Montamos las rutas en el raíz
app.use('/api', router);

// Por último, manejamos los errores genéricos
app.use(errors.logErrors);
app.use(errors.clientErrorHandler);
app.use(errors.errorHandler);

/***** Levanto el servidor *****/
app.listen(config.server.port, () => {
	  	logger.info('Servidor arrancado y escuchando en %s', config.server.port, '.');
})

module.exports = app;