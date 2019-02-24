const fs = require('fs');
const path = require('path');
const winston =  require('winston');

// Añado a Winston este transport
require('winston-daily-rotate-file');

module.exports = function (config) {
	// Me aseguro de que existen los directorios de trabajo
	if (!fs.existsSync(config.logger.logsDir)) {
		fs.mkdirSync(config.logger.logsDir);
	}

	let file = new (winston.transports.DailyRotateFile)({
		dirname: config.logger.logsDir,
		filename: config.logger.errorLogFile,
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxFiles: config.logger.rotateLogMaxFiles,
		level: config.logger.logLevelProduction,
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.splat(),
			winston.format.json()
		),
	});

	// Para Producción voy a loguear el nivel indicado a fichero de error
	let transportsArray = [file];
	// También las excepciones
	let exceptionsArray = [file];

	// Si estoy en debug logueo todo al fichero y a la consola
	if (config.debugMode) {		
		transportsArray.push(new winston.transports.File({ 
			filename: path.join(config.logger.logsDir, config.logger.develpmentLogFile), 
			level: 'debug',
			format: winston.format.combine(
				winston.format.splat(),
				winston.format.simple()
			)
		}));
		transportsArray.push(new winston.transports.Console({
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.splat(),
				winston.format.colorize(),
				winston.format.simple()
			)
		}));

		// En modo debug saco las excepciones por consola sólo, 
		// por lo que no defino ningún transporter de excepciones		
		exceptionsArray = null;
	}

	return winston.createLogger({		
		transports: transportsArray,
		exceptionHandlers: exceptionsArray,
		exitOnError: false
	});
};
