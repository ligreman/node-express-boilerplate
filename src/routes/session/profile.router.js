// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
// Logger básico
const logger = require('winston').loggers.get('logger');

/**
 * GET /profile
 * Obtiene los datos del perfil del usuario logado
 */
router.get('/', function (req, res) {
    // Compruebo si no está autenticado el usuario
    if (!req.isAuthenticated()) {
        logger.info('Session - Usuario no autenticado. IPs: ', req.ips.join(','));
        return res.status(401).send();
    }

    // Ya tengo la info del usuario en req.user gracias a Passport
    // devuelvo sólo la información que le interesa al cliente
    res.json({
        username: req.user.username,
        role: req.user.role
    });
});

/**
 * Módulo de rutas
 * @type {Router}
 */
module.exports = router;
