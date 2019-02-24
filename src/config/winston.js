const winston =  require('winston');
const DailyRotate =  require('winston-daily-rotate-file');

module.exports = function (configLogger) {
	// Me aseguro de que existen los directorios de trabajo
	if (!fs.existsSync(configLogger.logsDir)) {
		fs.mkdirSync(configLogger.logsDir);
	}

	let file = new (winston.transports.DailyRotateFile)({
		dirname: configLogger.logsDir,
		filename: configLogger.errorLogFile,
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxFiles: configLogger.rotateLogMaxFiles,
		level: configLogger.logLevelProduction
	  });

	// Para Producción voy a loguear el nivel indicado a fichero de error
	let transportsArray = [file];
	// También las excepciones
	let exceptionsArray = [file];

	// Si estoy en debug logueo todo al fichero y a la consola
	if (configLogger.debugMode) {
		transportsArray.push(new winston.transports.File({ filename: configLogger.develpmentLogFile, level: 'debug' }));
		transportsArray.push(new winston.transports.Console({
			format: winston.format.simple()
		  }));
	}

	return winston.createLogger({
		format: format.combine(
			format.splat(),
			format.colorize(),
			format.json()
		),
	  transports: transportsArray,
	  exceptionHandlers: exceptionsArray,
	  exitOnError: false
	});
};
