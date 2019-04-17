// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
// Logger básico
const logger = require('winston').loggers.get('logger');

/**
 * POST /logout
 * Cierra la sesión del usuario
 */
router.post('/', function (req, res) {
    // Compruebo si no está autenticado el usuario
    if (!req.isAuthenticated()) {
        logger.info('Session - Usuario no autenticado. IPs: ', req.ips.join(','));
        return res.status(401).send();
    }

    // Hago logout
    req.logout();
    res.json({});
});

/**
 * Módulo de rutas
 * @type {Router}
 */
module.exports = router;
