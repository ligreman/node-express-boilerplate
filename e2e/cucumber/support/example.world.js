const {setWorldConstructor} = require('cucumber');
const fs = require('fs');

// Me aseguro de que existe el directorio para los resultados de cucumber
fs.mkdirSync('./target/cucumber', {recursive: true});

class CustomWorld {
    constructor() {
        this.variable = 0;
    }

    setTo(number) {
        this.variable = number;
    }

    incrementBy(number) {
        this.variable += number;
    }
}

setWorldConstructor(CustomWorld);
