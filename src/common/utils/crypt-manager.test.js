require('module-alias/register');

const {expect} = require('chai');
// const rewire = require('rewire');
// const dbModule = rewire('./crypt-manager');
const {CriticalError} = require('@errors/custom-errors');

// Para saber por qué mocha (o node) se queda "colgado" al terminar los tests, o lo que sea
const wtf = require('wtfnode');


after(() => {
    // Para saber qué cosas quedan pendientes tras la ejecución de los tests (si se queda colgado mocha)
    // wtf.dump();
});

describe('Common Utils - Crypt manager', () => {

    describe('decryptPasswordWithEnv', () => {

        it('CM001 - Descifrar password correctamente', () => {
            const cryptManager = require('./crypt-manager');

            process.env.APP_KEY = 12345;

            let pass = cryptManager.decryptPasswordWithEnv('U2FsdGVkX1+agpep0MOsTTp4LcJFnetUMOsy6hcvwG0=', 'APP_KEY');

            expect(pass).to.be.equal('textoplano');
        });

        it('CM002 - CriticalError al obtener password cifrado, ya que la clave AES es incorrecta', () => {
            const cryptManager = require('./crypt-manager');

            process.env.APP_KEY = 'wrong key';

            expect(cryptManager.decryptPasswordWithEnv.bind(cryptManager.decryptPasswordWithEnv, 'U2FsdGVkX1+agpep0MOsTTp4LcJFnetUMOsy6hcvwG0=', 'APP_KEY'))
                .to.throw('Can`t decrypt data');
        });

        it('CM003 - CriticalError al obtener password cifrado, ya que la clave AES no existe', () => {
            const cryptManager = require('./crypt-manager');

            // comprobamos que la llamada a la función suelta una excepción
            // o error con ese texto
            expect(cryptManager.decryptPasswordWithEnv.bind(cryptManager.decryptPasswordWithEnv, 'U2FsdGVkX1+agpep0MOsTTp4LcJFnetUMOsy6hcvwG0=', 'APP2_KEY'))
                .to.throw('Can`t get decrypt key');
        });
    });
});
