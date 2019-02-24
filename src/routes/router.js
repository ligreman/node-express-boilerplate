// Creamos un Router para definir las rutas en su propio m�dulo
const Router = require('express').Router
const router = new Router()

// Importamos los ficheros de rutas
//const usuario = require('./usuario/router')
//const coche = require('./coche/router')

// Endpoint base
router.get('/', function (req, res, next) => {
	// Supongamos que hay un error
	if ('hay error almacenado en variable err')	{
		// Paso el error a Express para que lo gestione (va al siguiente middleware)
		next('err variable');
	} else {
		// Respondemos normalmente
		res.status(200).json({ message: 'Welcome to servidor API!' });
	}
});

// Otro endpoint con variables
app.post('/user/:id/:op?', function(req, res, next) {
	try	{
		// Lo que sea que pueda soltar una excepci�n
		throw new Error("BROKEN");
	}
	catch (err)	{
		// Lo mando a next
		next(err);
	}
});


// Endpoints
router.use('/usuario', usuario)
router.use('/coche', coche)

// Si la petici�n no ha sido atendida por ning�n endpoint anterior, es un 404
router.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = router;

