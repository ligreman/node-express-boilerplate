const logger = require('winston').loggers.get('logger');

/**
 * Este módulo gestiona los errores en el API Express, cuando se llaman a endpoints que no existen y demás
 */

/**
 Log general de todos los errores
 */
function logApiErrors(err, req, res, next) {
    logger.error('%O', err);
    next(err);
}


/**
 Manejador de errores de peticiones de cliente
 */
function apiErrorHandler(err, req, res) {
    // Si ya se ha respondido antes no hago nada
    if (res.headersSent) {
        return next(err);
    }

    // Compruebo si el error viene con status
    if (err.status === undefined || err.status === null) {
        err.status = 500;
    }

    // Compruebo si el error viene con message
    if (err.message === undefined || err.message === null) {
        err.message = 'Server error';
    }

    // Si es una petición AJAX devuelvo un error al cliente
    if (req.xhr) {
        res.status(err.status).json({error: err.message});
    } else {
        res.status(err.status).send(err.message);
    }
}

module.exports.logApiErrors = logApiErrors;
module.exports.apiErrorHandler = apiErrorHandler;
