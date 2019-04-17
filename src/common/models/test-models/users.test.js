const {expandModel} = require('./index.test');

/**
 * Modelo de Sequelize para Mocks
 */
module.exports = function (sequelize) {
    // El modelo
    let model = sequelize.define('users');

    // Respuesta por defecto
    let defaultJson = {
        username: 'manolo',
        password: '$2a$10$qXJTAvMlrP2UdBksXYwLB.jDPilIvnRZvL7fL0jZpy9HUURa6I5wS',
        role: 'user',
        status: 1,
        last_login_time: new Date().getTime()
    };

    model = expandModel(model, defaultJson);

    return model;
};
