/***** Importaciones *****/
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//const events = require("events");
//const emitter = new events.EventEmitter();

// Configuraci�n
const config = require('./config/config');
// Configuraci�n de log de HTTP Morgan
const configMorgan = require('./config/morgan')(config.logger);
// M�dulo de errores
const errors = require('./common/handlers/errors');
// M�dulo de Router principal
const router = require('./routes/router');
// Creo un logger winston
const logger = require('./config/winston')(config.logger);
// Suprimo los errores de logueo para evitar excepciones
logger.emitErrs = false;

/***** Genero la applicaci�n con Express *****/
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

// Montamos las rutas en el ra�z
app.use('/api', router);

// Por �ltimo, manejamos los errores gen�ricos
app.use(errors.logErrors);
app.use(errors.clientErrorHandler);
app.use(errors.errorHandler);

/***** Levanto el servidor *****/
app.listen(config.server.port, () => {
	  	logger.info('Servidor arrancado y escuchando en %s', config.server.port, '.');
})

module.exports = app;