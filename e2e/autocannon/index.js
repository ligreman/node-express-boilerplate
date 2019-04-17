const readline = require('readline');

const availableBenchs = {
    '[Tag] Ejemplo de test de carga': require('./api/ping')
};

// URL del host del api en modo test. Poner sólo el host:puerto, si se pone /api aquí, peta.
let apiUrl = 'http://localhost:8081';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let text = '', maxIdx = 0, temp = [];
Object.keys(availableBenchs).forEach((key, idx) => {
    text += '\n    [' + idx + '] ' + key;
    maxIdx = idx;
    temp[idx] = key;
});

ask();

function ask() {
    rl.question('Benchmarks disponibles:' + text + '\nLanzar el número: ', (answer) => {
        // Valido la elección
        if (isNaN(answer) || answer < 0 || answer > maxIdx) {
            console.error('Selección no válida.');
            ask();
        } else {
            rl.close();
            // Lanzo el bench elegido
            availableBenchs[temp[answer]](apiUrl);
        }
    });
}
