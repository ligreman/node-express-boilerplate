/*
{
    model: models.Operation,
    as: 'operations',
    where: value
}
 */

// TODO esto es una idea para un fichero de utils de JOINS futuro
function generateJoin(model, jsonData) {
    let join = {
        model: model,
        as: 'operations',
        where: {}
    };

    // Extaigo del jsonData el id del modelo en cuestion
}

module.exports = {
    generateJoin: generateJoin
};
