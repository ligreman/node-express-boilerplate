/**
 * Busca un usuario en BBDD y lo actualiza con los datos que se le pasen
 * @param models Objeto de modelos
 * @param userId ID del usuario
 * @param updateValues Objeto con los campos y valores a actualizar en el usuario
 * @returns {Promise<boolean>}
 */
const updateUser = async function (models, userId, updateValues) {
    // Busco al usuario
    let user = await models.User.findByPk(userId);

    // Si no lo encuentro, malo
    if (user === undefined || user === null) {
        let e = new Error('Usuario ' + userId + ' no encontrado en base de datos');
        e.status = 400;
        throw e;
    }

    // Actualizo los campos del usuario, según lo que venga en el cuerpo de la petición
    // ya he verificado antes que si vienen datos, éstos son correctos, aquí solo miro que venga o no
    if (updateValues.password !== undefined) {
        user.password = updateValues.password;
    }
    // el rol
    if (updateValues.role !== undefined) {
        user.role = updateValues.role;
    }
    // El estado
    if (updateValues.status !== undefined) {
        user.status = updateValues.status;
    }

    // Guardo el usuario
    await user.save();

    // Si todo ha ido bien, devuelvo el usuario actualizado
    return user;
};

/**
 * Helper para las rutas de users
 */
module.exports = {
    updateUser: updateUser
};
