/**
 * Modelo de Sequelize
 * @param sequelize Objeto de sequelize
 * @param DataTypes Los DataTypes de Sequelize
 * @returns {void|never|Model|sequelize.Model<any, any>|nock.Scope[]}
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('sessions', {
            sid: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            expires: {
                type: DataTypes.DATE
            },
            data: {
                type: DataTypes.TEXT
            }
        },
        {
            indexes: [
                {
                    name: 'expires_index',
                    method: 'BTREE',
                    fields: ['expires']
                },
                {
                    name: 'createdAt_index',
                    method: 'BTREE',
                    fields: ['createdAt']
                },
                {
                    name: 'updatedAt_index',
                    method: 'BTREE',
                    fields: ['updatedAt']
                }
            ],
            tableName: 'sessions'
        });
};
