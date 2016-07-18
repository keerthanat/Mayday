'use strict';
var Sequelize = require('sequelize');


module.exports = function(sequelize){
	var FIRST_AID = sequelize.define('FIRST_AID', {

		topic: {
			type: Sequelize.TEXT,
                        primaryKey: true,
			allowNull: false
		},
		symptoms: Sequelize.TEXT,
                steps: Sequelize.TEXT
	}, {
    timestamps: true,
    freezeTableName: false,
    tableName: 'FIRST_AID'
  });
	return FIRST_AID;
};

    //db.run("CREATE TABLE ANNOUNCEMENTS (msg_id INTEGER PRIMARY KEY AUTOINCREMENT, annon TEXT, user_id TEXT, time_id DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES USERS(user_id))");
