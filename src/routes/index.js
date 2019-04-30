// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();

// Leo la versión del package
const appVersion = require('@base/package.json').version;

// Importamos los ficheros de rutas
const userEndpoints = require('./users/users.router');
const loginEndpoint = require('./session/login.router');
const logoutEndpoint = require('./session/logout.router');
const profileEndpoint = require('./session/profile.router');

// Monto los endpoints
router.use('/login', loginEndpoint);
router.use('/logout', logoutEndpoint);
router.use('/profile', profileEndpoint);
router.use('/user', userEndpoints);

// Endpoint base de Status del API
router.get('/', function (req, res, next) {
    // TODO Enable if CSRF wanted
    // res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: false, sameSite: 'strict'});

    // Respondemos normalmente
    res.json({status: 'OK', version: appVersion});
});

/**
 * Módulo con las rutas del api
 * @type {Router}
 */
module.exports = router;

