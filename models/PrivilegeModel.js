'use strict';
var Sequelize = require('sequelize');


module.exports = function(sequelize) {
    var PRIVILEGE = sequelize.define('PRIVILEGE', {
        level_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        privilege: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        rule: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
        freezeTableName: false,
        tableName: 'PRIVILEGE',
        classMethods: {
            associate: function(models) {
                PRIVILEGE.hasMany(models.USERS, {
                    foreignKey: 'level_id',
                    targetKey: 'privilege'
                });
            }
        }
    });
    return PRIVILEGE;

};
