const fs = require('fs');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const {DateTime} = require('luxon');

// Configuramos el timezone de morgan para que pille la hora correcta
morgan.token('date', () => {
    return DateTime.local().toFormat('yyyy-LL-dd HH:mm:ss');
});

// Exporto una función con parámetro de configuración
module.exports = function (config) {
    // Me aseguro de que existen los directorios de trabajo
    fs.mkdirSync(config.logger.logsDir, {recursive: true});

    // Creo un stream para el fichero de log de acceso con rotado
    let accessLogStream = rfs(config.logger.accessLogFile, {
        interval: '1d',
        compress: 'gzip',
        maxFiles: config.logger.rotateLogMaxFiles,
        initialRotation: true,
        path: config.logger.logsDir
    });

    return {
        accessLogStream: accessLogStream
    };
};
