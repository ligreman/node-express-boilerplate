/**
 * Clase propia de error crítico que provoca cerrar el servidor
 */
class CustomErrors extends Error {
    constructor(error) {
        super(error.message);
    }
}

module.exports = {
    CriticalError: CustomErrors
};
