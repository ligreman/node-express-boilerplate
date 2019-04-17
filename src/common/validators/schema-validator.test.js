require('module-alias/register');

const sinon = require('sinon');
const {expect} = require('chai');

const validatorModule = require('./schema-validator');

// Para saber por qué mocha (o node) se queda "colgado" al terminar los tests, o lo que sea
const wtf = require('wtfnode');


after(() => {
    // Para saber qué cosas quedan pendientes tras la ejecución de los tests (si se queda colgado mocha)
    // wtf.dump();
});

describe('Common - Validators schema validator', () => {
    describe('extractErrorMessages', () => {
        it('VSV001 - Extract messages successfully', () => {

            let error = {
                details: [
                    {message: 'mensaje 1'},
                    {message: 'mensaje 2'},
                    {message: 'mensaje 3'}
                ]
            };

            // Llamo a la función
            let result = validatorModule.extractErrorMessages(error);

            // Compruebo si se ha llamado a la función next
            expect(result).to.have.length(3);
            expect(result).to.include('mensaje 2');
        });

        it('VSV002 - Error extracting messages. No details', () => {

            let error = {};

            // Llamo a la función
            let result = validatorModule.extractErrorMessages(error);

            // Compruebo si se ha llamado a la función next
            expect(result).to.be.null;
        });
    });
});
