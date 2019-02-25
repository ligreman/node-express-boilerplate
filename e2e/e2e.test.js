require('module-alias/register');
const assert = require('assert');
const request = require('supertest');

// Indico que estoy en modo test
global.testModeExecution = true;
const app = require('@root/app');

// Para saber por qué mocha (o node) se queda "colgado" al terminar los tests, o lo que sea
const wtf = require('wtfnode');


after(function () {
    // Para saber qué cosas quedan pendientes tras la ejecución de los tests (si se queda colgado mocha)
    wtf.dump();

    // Cierro el servidor
    app.get('listeningServer').close();
});

describe('GET /api', function () {
    it('responds with json method 1', function (done) {
        request(app)
            .get('/api')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    // Falla el test. También podría hacer un throw
                    return done(err);
                }
                done();
            });
    });

    it('responds with json method 2', function (done) {
        request(app)
            .get('/api')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
