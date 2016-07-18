'use strict';
var Sequelize = require('sequelize');


module.exports = function(sequelize, DataTypes) {
  var USERS = sequelize.define('USERS', {
    user_id: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    time_id: Sequelize.TEXT,
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    privilege: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    acc_active: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    lat: Sequelize.REAL,
    long: Sequelize.REAL
  }, {
    timestamps: true,
    freezeTableName: false,
    tableName: 'USERS',
    classMethods: {
      associate: function(models) {
        USERS.hasMany(models.MESSAGES, {
          foreignKey: 'user_id'
        });
        USERS.hasMany(models.PRIVATE_MESSAGES, {
          foreignKey: 'user_id',
          targetKey: 'sender'
        });
        USERS.hasMany(models.PRIVATE_MESSAGES, {
          foreignKey: 'user_id',
          targetKey: 'receiver'
        });
        USERS.hasMany(models.ANNOUNCEMENTS);
      }
    }
  });
  return USERS;

};
