const assert = require('assert');

// Para saber por qué mocha (o node) se queda "colgado" al terminar los tests, o lo que sea
const wtf = require('wtfnode');


after(function () {
    // Para saber qué cosas quedan pendientes tras la ejecución de los tests (si se queda colgado mocha)
    wtf.dump();
});

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});
