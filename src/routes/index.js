// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
const logger = require('winston');

// Importamos los ficheros de rutas
const userEndpoints = require('./user/router');

// Monto los otros endpoints
router.use('/user', userEndpoints);

// Endpoint base
router.get('/', function (req, res, next) {
    let error = false;
    // Supongamos que hay un error
    if (error) {
        // Paso el error a Express para que lo gestione (va al siguiente middleware)
        next('err variable');
    } else {
        // Respondemos normalmente
        res.status(200).json({message: 'Welcome to servidor API!'});
    }
});

// Otro endpoint con variables  /api/:idf/:op?order=1
router.post('/:idf/:op?', function (req, res, next) {
    // Recojo los parámetros path
    let id = req.params.idf;
    let op = req.params.op;

    // Los query params
    let order = req.query.order;

    // Recojo el body de la petición. Tengo que haber cargado el bodyParser adecuado al tipo de body
    let body = req.body;

    try {
        // Lo que sea que pueda soltar una excepción
        throw new Error('BROKEN');
    } catch (err) {
        // Lo mando a next
        next(err);
    }
});

module.exports = router;

