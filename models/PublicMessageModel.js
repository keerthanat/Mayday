'use strict';
var Sequelize = require('sequelize');


module.exports = function(sequelize) {
	var MESSAGES = sequelize.define('MESSAGES', {
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
		msg: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		time_id: Sequelize.TEXT
	}, {
		timestamps: true,
		freezeTableName: false,
		tableName: 'MESSAGES',
		classMethods: {
			associate: function(models) {
				MESSAGES.belongsTo(models.USERS,{
					foreignKey: 'user_id'
				});
			},
                        findMessagesByLimit: function(models, data, callback) {
                        models.MESSAGES.findAll({ limit: data.limit , order:'msg_id DESC', where: { msg_id: { lte: data.msg_id  } }})
                        .then(function(messages){
                    //      result = messages;  
                          callback(messages);

                        }).catch(function(e){
//                            callback([]);
                        });
       
                        }
		}
	});
	return MESSAGES;
}
