const joi = require('joi');

// Definición del schema de validación del objeto
module.exports = joi.object()
    .keys({
        username: joi.string().alphanum().min(3).max(30).required()
    });
