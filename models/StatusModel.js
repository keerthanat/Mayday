'use strict';
var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    var STATUS =  sequelize.define('STATUS', {
        status_id: {type:Sequelize.INTEGER,
            defaultValue:0,
//            autoIncrement: true,
        primaryKey: true},
    status: {
      type: Sequelize.TEXT,
      allowNull: false},
     statusClass: {
      type: Sequelize.TEXT,
      allowNull: false},
    statusMapClass: {
      type: Sequelize.TEXT,
      allowNull: false},
    iconClass: {
      type: Sequelize.TEXT,
      allowNull: false}
  

    }, {
        freezeTableName: false,
        tableName: 'STATUS',
        classMethods: {
            associate: function(models) {
                STATUS.hasMany(models.USERS, {
                    foreignKey: 'status_id',
                    targetKey: 'status'
                });
            }
        }
    });
    return STATUS;

}