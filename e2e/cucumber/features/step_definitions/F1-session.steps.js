require('module-alias/register');
const {Given, When, Then} = require('cucumber');
const {expect} = require('chai');
const bcrypt = require('bcryptjs');
const request = require('supertest');

// Config de base de datos
global.testModeExecution = true;

Given(/^existen los siguientes usuarios:$/, function (data) {
    let users = [];

    data.hashes().forEach((row) => {
        if (row.id) {
            row.id = parseInt(row.id);
        }

        row.password = bcrypt.hashSync(row.password, 10);
        row.status = (row.status === 'true');
        users.push(row);
    });

    return this.models.User.bulkCreate(users);
});

Given(/^el usuario "([^"]*)" con contraseña "([^"]*)" intenta autenticarse en el api$/, function (user, pass) {
    return new Promise((resolve, reject) => {
        // Lanzo una petición de login
        request(this.wsUrl)
            .post('/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({username: user, password: pass})
            .end((err, res) => {
                this.saveRequest(err, res, {username: user, password: pass});
                resolve();
            });
    });
});

Given(/^el usuario "([^"]*)" con contraseña "([^"]*)" está autenticado en el api$/, function (user, pass) {
    return new Promise((resolve, reject) => {
        // Lanzo una petición de login
        request(this.wsUrl)
            .post('/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({username: user, password: pass})
            .end((err, res) => {
                // Compruebo que es un 200
                if (res.statusCode !== 200) {
                    reject('Error en petición de login: ' + res.statusCode);
                } else {
                    // Recojo la cookie
                    this.set('cookie', res.headers['set-cookie']);
                    resolve();
                }
            });
    });
});

When(/^el frontend hace una petición (.*), (.*) cookie, a (.*) con los parámetros (.*)$/,
    function (method, sendCookie, endpoint, query) {
        // Convierto los params a JSON
        let params = {};

        if (query) {
            params = JSON.parse(query);
        }

        let cookie = null;
        if (sendCookie === 'con') {
            // recojo la cookie guardada de la petición anterior
            cookie = this.get('cookie');
        }

        return new Promise((resolve, reject) => {
            let req = null;

            if (method === 'GET') {
                req = request(this.wsUrl).get(endpoint).query(params);
            } else if (method === 'POST') {
                req = request(this.wsUrl).post(endpoint).send(params);
            } else {
                reject('Método HTTP no conocido');
            }

            // Añado la cookie si viene
            if (cookie) {
                req.set('Cookie', [cookie]);
            }

            req.set('Accept', 'application/json')
                .end((err, res) => {
                    this.saveRequest(err, res, {params: params});
                    resolve();
                });
        });
    });

Then(/^el rol del usuario es "([^"]*)"$/, function (rol) {
    // Recupero la última request hecha
    let request = this.getLastRequest();

    // Chequeo que la respuesta me devuelve 2 tareas
    expect(request.body.role).to.be.equal(rol);
});
