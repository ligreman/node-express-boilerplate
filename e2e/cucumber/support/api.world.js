const {setWorldConstructor} = require('cucumber');
const fs = require('fs');

console.log('Setup World');
// Me aseguro de que existe el directorio para los resultados de cucumber
fs.mkdirSync('./target/cucumber', {recursive: true});

let config = require('@config/config');
let wsUrl = 'http://localhost:' + config.server.port + '/api';
let configDB = require('@config/database')(config);

// Se ejecuta el constructor en cada test
class CustomWorld {
    constructor() {
        // Contenedor para pasar variables de un step a otrod
        this.container = {};
        this.requests = [];

        // Url de conexión a api
        this.wsUrl = wsUrl;

        // Cojo la configuración para la base de datos.
        // Creo el databaseManager en api.world.js
        this.databaseManager = configDB;
        this.models = this.databaseManager.models;

        // Funciones
        this.saveRequest = (err, res, req) => {
            this.requests.push({
                'err': err,
                'res': res,
                'status': res.statusCode,
                'body': res.body,
                'req': req
            });
        };
    }

    // Limpiamos el contenedor
    clean(key) {
        if (key !== undefined) {
            this.container[key] = undefined;
        } else {
            this.container = {};
        }
    }

    set(key, value) {
        this.container[key] = value;
    }

    get(key) {
        return this.container[key];
    }

    cleanRequests() {
        this.requests = [];
    }

    cleanLastRequest() {
        this.requests.pop();
    }

    getRequests() {
        return this.requests;
    }

    getLastRequest() {
        return this.requests[this.requests.length - 1];
    }
}

setWorldConstructor(CustomWorld);
