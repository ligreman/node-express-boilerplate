/**
 * Modelo de Sequelize
 * @param sequelize Objeto de sequelize
 * @param DataTypes Los DataTypes de Sequelize
 * @returns {void|never|Model|sequelize.Model<any, any>|nock.Scope[]}
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        last_login_time: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: false,
        underscored: true
    });
};
