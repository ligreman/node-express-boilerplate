const joi = require('joi');
const CONSTANTS = require('@common/constants');

// Genero la lista de posibles tipos válidos
const validRolesList = Object.values(CONSTANTS.SESSIONS);


// Definición del schema de validación del objeto
module.exports = joi.object()
    .keys({
        password: joi.string().alphanum().max(20),
        role: joi.any().valid(validRolesList),
        status: joi.boolean()
    });
