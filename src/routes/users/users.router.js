// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
// Logger básico
const logger = require('winston').loggers.get('logger');
const CONSTANTS = require('@common/constants');
// Helper
const usersHelper = require('./users.helper');
// Validador de esquemas
const joi = require('joi');
const schemas = require('./schemas/index');
const bcrypt = require('bcryptjs');


/**
 * POST /users/:id
 * Modificación de un usuario (sólo para el admin)
 */
router.post('/:id', function (req, res) {
    // Compruebo si no está autenticado el usuario
    if (!req.isAuthenticated()) {
        logger.info('Session - Usuario no autenticado. IPs: ', req.ips.join(','));
        return res.status(401).send();
    }

    // Si no eres admin
    if (req.user.role !== CONSTANTS.SESSIONS.ROLE_ADMIN) {
        logger.info('Session - Usuario no es administrador. IPs: ', req.ips.join(','));
        return res.status(403).send();
    }

    // Cojo el parámetro ID del usuario y lo valido
    const validation = joi.validate(req.params.id, joi.number().min(0).required());

    // si no viene el parámetro, fallo directamente
    // No permito tampoco a un admin cambiarse a sí mismo
    if (validation.error || (validation.value === req.user.id)) {
        logger.info(validation.error);
        // Respondo con un error 400 vacío
        return res.status(400).send();
    }

    // Recojo el id en
    let paramId = validation.value;
    // Modelos
    let models = req.app.get('dbModels');

    // Valido el cuerpo que me llega
    const {error, value} = joi.validate(req.body, schemas.postUserBody, {
        stripUnknown: true
    });

    // Si ha dado error, devuelvo error 400 de bad request
    if (error !== null) {
        logger.warn('%O', error);
        // Respondo con un error 400 vacío
        return res.status(400).send();
    }

    // Si viene la contraseña, la cifro primero con bcrypt
    if (value.password) {
        value.password = bcrypt.hashSync(value.password, 10);
    }

    // Llamo al helper que buscará y actualizará los datos del usuario
    usersHelper.updateUser(models, paramId, value)
        .then((user) => {
            logger.info('Datos del usuario actualizados por parte del administrador');
            return res.json({});
        })
        .catch((error) => {
            logger.error('%O', error);
            return res.status(error.status || 500).send();
        });
});

/**
 * Módulo con las rutas del api
 * @type {Router}
 */
module.exports = router;
