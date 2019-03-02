const joi = require('joi');

// Definición del schema de validación del objeto
module.exports = joi.object()
    .keys({
        username: joi.string().alphanum().min(3).max(30).required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        access_token: [joi.string(), joi.number()],
        birthyear: joi.number().integer().min(1900).max(2013),
        email: joi.string().email({minDomainAtoms: 2})
    })
    .with('username', 'birthyear')
    .without('password', 'access_token');
