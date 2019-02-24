const autocannon = require('autocannon');
const reporter = require('autocannon-reporter');
const path = require('path');
const fs = require('fs');
const reportOutputPath = path.join('target', 'autocannon-report.html');

if (!fs.existsSync('target')) {
    fs.mkdirSync('target');
}

// Debe estar el API levantado (podría levantarlo aquí, pero así no mezclamos la salida)

// Prueba de carga contra el api
const instance = autocannon({
        url: 'http://localhost:8080/api',
        method: 'GET',
        body: undefined,
        headers: {},

        // Título para la prueba
        title: 'Prueba de fuego',
        // Conexiones concurrentes
        connections: 10,
        //

        // Segundos de ejecución
        duration: 10
        // Cantidad de peticiones (tiene prioridad sobre duration)
        // amount: 5000
    },
    (err, result) => {
        if (err) {
            throw err;
        }

        // Genero el informe
        let report = reporter.buildReport(result);
        // Lo escribo a fichero
        reporter.writeReport(report, reportOutputPath, (err, res) => {
            if (err) {
                console.err('Error al escribir el fichero de informe: ', err);
            } else {
                console.log('Informe generado: ', reportOutputPath);
            }
        });
    });

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
    instance.stop();
});

// Progreso
autocannon.track(instance, {renderProgressBar: true});
