'use strict';
var Sequelize = require('sequelize');


module.exports = function(sequelize) {
    var ANNOUNCEMENTS = sequelize.define('ANNOUNCEMENTS', {
        msg_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        annon: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        time_id: Sequelize.TEXT
    }, {
        timestamps: true,
        freezeTableName: false,
        tableName: 'ANNOUNCEMENTS',
        classMethods: {
            associate: function(models) {
                ANNOUNCEMENTS.belongsTo(models.USERS);
            }
        }
    });
    return ANNOUNCEMENTS;
};


//db.run("CREATE TABLE ANNOUNCEMENTS (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, annon TEXT, user_id TEXT, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES USERS(user_id))");
