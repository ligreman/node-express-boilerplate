const logger = require('winston');

/**
 Log general de todos los errores
 */
function logErrors(err, req, res, next) {
    logger.error(err.stack);
    next(err);
}


/**
 Manejador de errores de peticiones de cliente
 */
function clientErrorHandler(err, req, res, next) {
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
        next(err);
    }
}

/**
 Manejador global de errores
 */
function errorHandler(err, req, res, next) {
    res.status(err.status).send(err.message);
}

module.exports.logErrors = logErrors;
module.exports.clientErrorHandler = clientErrorHandler;
module.exports.errorHandler = errorHandler;
