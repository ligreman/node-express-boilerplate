const Sequelize = require('sequelize');
const logger = require('winston').loggers.get('logger');
const {CriticalError} = require('@errors/custom-errors');
const {DateTime} = require('luxon');
const cryptManager = require('@utils/crypt-manager');

/**
 * Función para logar queries en el logger general
 * @param msg
 */
function logQuery(msg) {
    logger.debug(msg);
}

/**
 * Clase para un manager de base de datos
 */
class DatabaseManager {
    /**
     * Constructor del manager de base de datos
     * @param instance Instancia de la base de datos (objeto Sequelize)
     * @param models Modelos
     * @param config Objeto de configuración
     */
    constructor(instance, models, config) {
        this._models = models;
        this._config = config;
        this._instance = instance;
    }

    /**
     * Getter de la instancia
     */
    get instance() {
        return this._instance;
    }

    /**
     * Getter de los modelos
     */
    get models() {
        return this._models;
    }

    /**
     * Getter de la configuración
     */
    get config() {
        return this._config;
    }

    /**
     * Sincroniza la base de datos creando los modelos y actualizándolos si es necesario
     * USAR SOLO PARA EL ENTORNO DE development
     * @returns {*} Promise
     */
    synchronize() {
        let forceDropTables = false;
        if (this._config.isDevelopment() && this._config.debug.dropTablesOnSync) {
            forceDropTables = true;
        }

        return this._instance.sync({force: forceDropTables});
    }

    /**
     * Comprueba la conexión con la base de datos
     * @returns {*} Promise
     */
    authenticate() {
        return this._instance.authenticate();
    }

    /**
     * Arranca la base de datos y realiza o bien una sincronización (entorno development) o bien una authenticación
     * para comprobar la conexión correcta
     * @returns {*} Promise
     */
    startUp() {
        let dbStartup;
        if (this._config.isDevelopment()) {
            logger.info('Synchronizing database (development mode)...');
            dbStartup = this.synchronize();
        } else {
            logger.info('Checking database connection (production mode)...');
            dbStartup = this.authenticate();
        }
        return dbStartup;
    }

    /**
     * Cierra la conexión a la base de datos
     * @returns {*} Promise
     */
    close() {
        return this._instance.close();
    }
}

/**
 * Este módulo configura la conexión a la base de datos e importa los modelos ORM
 * @param config variable con los parámetros de configuración del sistema
 */
module.exports = function (config) {
    // Sacamos la contraseña, y si viene cifrada la desciframos
    let pass = config.database.password;
    if (config.database.isPasswordCyphed) {
        pass = cryptManager.decryptPasswordWithEnv(pass, config.database.environmentVarCypherKey);
    }

    // Creamos la conexión con la base de datos
    const instanceServer = new Sequelize(config.database.name, config.database.username, pass, {
        dialect: 'mariadb',
        host: config.database.host,
        timezone: DateTime.local().zoneName,
        logging: logQuery
    });

    // Cargo los modelos de base de datos
    let models = require('@models/index')(instanceServer);

    // Devuelvo el objeto Manager
    return new DatabaseManager(instanceServer, models, config);
};
