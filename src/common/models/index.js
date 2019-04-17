/**
 * El módulo exporta los modelos
 * @param dbServer La instancia del servidor Sequalize creado
 */
module.exports = function (dbServer) {
    let models = {};

    // Voy importando los modelos
    models.Session = dbServer.import('./sessions');
    models.User = dbServer.import('./users');

    /**
     * Relaciones entre tablas
     */


    return models;
};
