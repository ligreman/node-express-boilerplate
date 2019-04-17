// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
const passport = require('passport');
const config = require('@config-front/config');
// Logger básico
const logger = require('winston').loggers.get('logger');

/**
 * POST /login
 * Endpoint de login
 * Parámetros de formulario: username y password
 */
router.post('/',
    passport.authenticate('' + config.session.strategy, {}),
    async function (req, res) {
        // Verifico que se ha autenticado al usuario correctamente con user + pass (estrategia local)
        // No se debería llegar aquí nunca si ha fallado la autenticación ya que passport no deja pasar
        // si no estás autenticado pero por si acaso compruebo
        if (!req.isAuthenticated()) {
            // Envío un no autorizado
            return res.status(401).send();
        }

        // Guardo en base de datos el tiempo de login.
        // Cojo la instancia de Sequelize del usuario que viene en req
        req.user.last_login_time = Date.now();
        await req.user.save();

        logger.info('Usuario %s autenticado.', req.user.username);

        // Respondo con los datos de profile.
        // En la cabecera de la respuesta irá la cookie de sesión generada.
        res.json({
            username: req.user.username,
            role: req.user.role
        });
    }
);

// TODO endpoint con formulario para probar el login (eliminar)
router.get('/html', function (req, res) {
    let html = `<form action="http://localhost:3002/api/login" method="POST">
    <input type="text" name="username">
    <input type="password" name="password">
    <input type="submit">
    </form>`;

    res.send(html);
});


/**
 * Módulo de rutas
 * @type {Router}
 */
module.exports = router;
