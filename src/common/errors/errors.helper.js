/**
 * Recibe un Error e intenta ponerle un código de status adecuado según el tipo de error u otra información
 * @param error instancia de Error. La modifica.
 */
function errorRecognizer(error) {
    // Si es un error de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
        error.status = 400;
    }
}

/**
 * Módulo de helpers para los errores
 * @type {{errorRecognizer: errorRecognizer}}
 */
module.exports = {
    errorRecognizer: errorRecognizer
};
