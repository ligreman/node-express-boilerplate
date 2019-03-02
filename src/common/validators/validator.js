const joi = require('joi');

// Importo los esquemas comunes para validar los objetos
const schemas = require('./schemas');

/**
 * Expone los diferentes validadores para ser usados.
 * Cada validador devuelve un Promise pero que tiene dos campos también para acceder al error y al value.
 *      const result = Joi.validate(value, schema);
 *      result.error // null
 *      result.value // { "a" : 123 }
 * O bien
 *      const promise = Joi.validate(value, schema);
 *      promise.then((value) => {
 *          value // { "a" : 123 }
 *      });
 * Error es null si está todo bien y si no es un mensaje de error
 * El value es el elemento validado y filtrado
 */
module.exports = {
    /**
     *  Valida un objeto JSON con los parámetros de una request
     * @param obj Objeto a validar
     * @param schema El schema a usar. Si no se pasa ninguno, se uso el de por defecto
     */
    isRequestValid: (obj, schema = schemas.defaultRequestSchema) => {
        return joi.validate(obj, schema);
    }
};
