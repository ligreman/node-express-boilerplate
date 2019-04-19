const {AfterAll, Before, Given, Then, When} = require('cucumber');
const {expect} = require('chai');
const validator = require('validator');

require('module-alias/register');
global.testModeExecution = true;

let dbM = null;

// Limpio la base de datos antes de cada ejecución de escenario (scenario y cada example)
Before(function () {
    this.clean();
    this.cleanRequests();

    if (dbM === null) {
        dbM = this.databaseManager;
    }

    return this.databaseManager.synchronize();
});

// Después de terminar todos los tests cierro la conexión a base de datos
AfterAll(function () {
    console.log('\nAfter scenario');
    // Cierro la base de datos. Accedo a variable local porque el world aquí ya no existe
    return dbM.close();
});

Given(/^el api está levantada y la base de datos responde$/,
    async function () {
        const {err, res} = await request(this.wsUrl).get('/');
        expect(err).to.not.exist;
        expect(res.statusCode).to.be.equal(200);

        const device = await this.models.Device.findAll();
        expect(device).to.not.be.null;
    });


Then(/^la respuesta es correcta, y devuelve un JSON bien formado$/,
    function () {
        // Recupero la última request hecha
        let request = this.getLastRequest();

        // Chequeo la respuesta
        expect(request.status).to.be.equal(200);
        // compruebo que sea un JSON válido
        expect(validator.isJSON(JSON.stringify(request.body))).to.be.true;
    });

Then(/^la respuesta es un error (.*)$/,
    function (statusCode) {
        let request = this.getLastRequest();

        expect(request.status).to.be.equal(parseInt(statusCode));
    });


Then(/^el contenido de la respuesta contiene (.*)$/, function (response) {
    // Recupero la última request hecha
    let request = this.getLastRequest();

    expect(request.body).to.include(JSON.parse(response));
});
