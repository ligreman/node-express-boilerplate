/**
Log general de todos los errores
*/
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}


/**
Manejador de errores de peticiones de cliente
*/
function clientErrorHandler(err, req, res, next) {
	// Si es una petición AJAX devuelvo un error al cliente
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

/**
Manejador global de errores
*/
function errorHandler(err, req, res, next) {
  res.status(500).send();
// Hacer lo que sea con el error
}

module.exports.logErrors = logErrors;
module.exports.clientErrorHandler = clientErrorHandler;
module.exports.errorHandler = errorHandler;
