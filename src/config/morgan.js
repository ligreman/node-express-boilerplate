const fs = require('fs');
const rfs = require('rotating-file-stream');

// Exporto una función con parámetro de configuración
module.exports = function(config){
	// Me aseguro de que existen los directorios de trabajo
	if (!fs.existsSync(config.logger.logsDir)) {
		fs.mkdirSync(config.logger.logsDir);
	}

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