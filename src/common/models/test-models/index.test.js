const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const {merge: _merge} = require('lodash');

function mockDatabase() {
    // Sobrescribo los modelos que quiero mockear
    dbMock.$overrideImport('./users', './test-models/users.test');

    return require('@models/index')(dbMock);
}

/**
 * Extiendo el fakeModel de la librería de Mocks con nueva funcionalidad y alguna corrección de bugs
 * @param model fakeModel
 * @param defaultJson Json por defecto para el modelo
 * @returns {*} modelo extendido
 */
function expandModel(model, defaultJson) {
    // No existe el findByPk así que lo "clono" para que el test funcione bien
    model.findByPk = model.findById;

    // Otros métodos
    model.setQueue = (queue, mergeDefault, newRecord) => {
        // Si tengo que hacer merge o no
        if (mergeDefault === true) {
            queue.forEach((row) => {
                _merge(row, defaultJson, row);
            });
        }

        // Si es nuevo record
        let newRecordOpt = true;
        if (newRecord === true || newRecord === false) {
            newRecordOpt = newRecord;
        }

        model.$clearQueue();
        model.$queryInterface.$clearHandlers();

        // Genero los rows
        let data = [];

        queue.forEach((row) => {
            data.push(model.build(row));
        });
        model.$queueResult(data, {wasCreated: newRecordOpt});

        // El findOrCreate que no devuelve una instancia sino un array, lo transformo para devolver
        // una instancia realmente
        model.$queryInterface.$useHandler((query, queryOptions, done) => {
            if (query === 'findOrCreate') {
                return Promise.resolve([data[0], newRecord]);
            }
        });
    };

    model.clearQueue = () => {
        model.$clearQueue();
        model.$queryInterface.$clearHandlers();
    };


    return model;
}

module.exports = {mockDatabase, expandModel};
