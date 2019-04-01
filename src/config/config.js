// Variable para guardar la configuración
let config = require('./config.json');

// Si quiero modificar o hacer algo con fichero de configuración de forma programática, aquí

// Si estoy en modo test, mexclo la configuración de test también
if (global.testModeExecution) {
    let configTest = require('./config.test.json');
    config = _.merge(config, configTest);
}

// Recojo el environment mode
config.environment = process.env.NODE_ENV || 'development';

/**
 * Devuelve si el entorno es de desarrollo o producción
 * @returns {boolean}
 */
config.isDevelopment = () => {
    return config.environment === 'development';
};

module.exports = config;
