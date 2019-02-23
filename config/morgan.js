const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

// Exporto una función con parámetro de configuración
module.exports = function(configLogger){
	// Me aseguro de que existen los directorios de trabajo
	if (!fs.existsSync(configLogger.logsDir)) {
		fs.mkdirSync(configLogger.logsDir);
	}

	// Creo un stream para el fichero de log de acceso con rotado
	let accessLogStream = rfs(configLogger.accessLogFile, {
	  interval: '1d',
	  compress: 'gzip',
	  maxFiles: configLogger.rotateLogMaxFiles,
	  initialRotation: true
	  path: configLogger.logsDir
	});

	return {
		accessLogStream: accessLogStream
	};
};