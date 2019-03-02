// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();

// /api/user/:id/:op endpoint con variables
router.post('/:op', function (req, res, next) {
    // Recojo los parámetros
    let op = req.params.op;

    try {
        // Lo que sea que pueda soltar una excepción
        throw new Error('BROKEN 2');
    } catch (err) {
        // Lo mando a next
        next(err);
    }
});

module.exports = router;

