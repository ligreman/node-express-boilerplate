const {setWorldConstructor} = require('cucumber');
const fs = require('fs');

console.log('Setup World');
// Me aseguro de que existe el directorio para los resultados de cucumber
fs.mkdirSync('./target/cucumber', {recursive: true});

class CustomWorld {
    constructor() {
        // Contenedor para pasar variables de un step a otrod
        this.container = {};
        this.lastRequest = {};

        // Funciones
        this.saveRequest = (err, res) => {
            this.lastRequest = {
                err: err,
                res: res,
                status: res.statusCode,
                body: res.body
            };
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

    cleanLastRequest() {
        this.lastRequest = {};
    }
}

setWorldConstructor(CustomWorld);
