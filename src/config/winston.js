const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Añado a Winston este transport
require('winston-daily-rotate-file');

module.exports = function (config) {
    // Me aseguro de que existen los directorios de trabajo
    if (!fs.existsSync(config.logger.logsDir)) {
        fs.mkdirSync(config.logger.logsDir, {recursive: true});
    }

    let logLevel = config.logger.logLevelProduction;
    if (config.debugMode) {
        logLevel = config.logger.logLevelDevelopment;
    }

    let file = new (winston.transports.DailyRotateFile)({
        dirname: config.logger.logsDir,
        filename: config.logger.errorLogFile,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: config.logger.rotateLogMaxFiles,
        level: logLevel,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.json()
        )
    });

    // Para Producción voy a loguear el nivel indicado a fichero de error
    let transportsArray = [file];
    // También las excepciones
    let exceptionsArray = [file];

    // Logueo a la consola también
    transportsArray.push(new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.colorize(),
            winston.format.simple()
        )
    }));

    // Si estoy en debug logueo todo al fichero de development
    if (config.debugMode) {
        transportsArray.push(new winston.transports.File({
            filename: path.join(config.logger.logsDir, config.logger.developmentLogFile),
            level: logLevel,
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.simple()
            )
        }));

        // En modo debug saco las excepciones por consola sólo,
        // por lo que no defino ningún transporter de excepciones
        exceptionsArray = null;
    }

    // Configuro un logger llamado "logger"
    winston.loggers.add('logger', {
        transports: transportsArray,
        exceptionHandlers: exceptionsArray,
        exitOnError: false
    });

    // Capturamos los errores de winston de logueo
    winston.loggers.get('logger').on('error', function (err) {
        // Logamos al console
        console.error('Error logging with winston:');
        console.error(err);
    });

    return winston.loggers.get('logger');
    ;
};
