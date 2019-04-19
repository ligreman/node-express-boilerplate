const autocannon = require('autocannon');
const reporter = require('autocannon-reporter');
const path = require('path');
const fs = require('fs');
const reportOutputPath = path.join('target', 'autocannon-report.html');
const faker = require('faker');

/**
 * Inicia el benchmark
 */
function startBench(apiUrl) {
    faker.seed(12345);

    // Verifico que el directorio existe
    fs.mkdirSync('target', {recursive: true});

    // NOTA: Debe estar el API Test levantado (podría levantarlo aquí, pero así no mezclamos la salida)

    // Peticiones a realizar
    let exampleRequest = {
        method: 'POST',
        path: '/api/example',
        body: JSON.stringify({
            'dato1': 'Hola',
            'dato2': 'abc'
        })
    };
    // Variables
    let listDato1 = ['123'];

    // Prueba de carga contra el api
    const instance = autocannon({
            url: apiUrl,
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            requests: [exampleRequest],

            // Título para la prueba
            title: 'Test de elejmplo a un endpoint variando el dato1 aleatoriamente en cada petición, con posibilidad de repetir el mismo dato1',
            // Conexiones concurrentes (dispositivos simultáneos)
            connections: 5,
            // Reemplaza los ids por algo aleatorio
            idReplacement: true,
            // Segundos de ejecución de la prueba
            duration: 10,
            // Cantidad de peticiones (tiene prioridad sobre duration)
            // amount: 100,
            setupClient: setupClient
        },
        finishedBench);


    // Modifico las peticiones con cada una de ellas
    instance.on('response', function (client, statusCode, returnBytes, responseTime) {
        let newBody = {
            dato1: 'Hola',
            dato2: 'abc'
        };

        // Aleatoriamente creo un nuevo id o cojo uno de los ya existentes
        let decision = randomInt(0, listDato1.length);

        // Si es 0 es que es nuevo ID, si no pues es uno de los id ya creados
        if (decision !== 0) {
            newBody.dato1 = listDato1[decision - 1];
        } else {
            let newData = '' + faker.random.number({min: 1, max: 9999});
            listDato1.push(newData);
            newBody.dato2 = newData;
        }

        client.setBody(JSON.stringify(newBody));
    });


    // this is used to kill the instance on CTRL-C
    process.once('SIGINT', () => {
        instance.stop();
    });

    // Progreso
    autocannon.track(instance, {renderProgressBar: true});
}


/**
 * Al finalizar el benchmark
 */
function finishedBench(err, result) {
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
            process.exit();
        }
    });
}

function setupClient(client) {
    client.on('body', (buffer) => {
        // console.log(buffer.toString('utf8'));
    });
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = startBench;
