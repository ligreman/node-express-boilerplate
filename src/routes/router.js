// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
const logger = require('winston');

// Importamos los ficheros de rutas
//const usuario = require('./usuario/router')
//const coche = require('./coche/router')

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

// Otro endpoint con variables
router.post('/user/:id/:op?', function (req, res, next) {
    try {
        // Lo que sea que pueda soltar una excepción
        throw new Error('BROKEN');
    } catch (err) {
        // Lo mando a next
        next(err);
    }
});


// Endpoints
//router.use('/usuario', usuario)
//router.use('/coche', coche)


module.exports = router;

