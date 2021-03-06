'use strict';
var Sequelize = require('sequelize');


module.exports = function(sequelize) {
	var PERF_MESSAGES = sequelize.define('PERF_MESSAGES', {
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
		tableName: 'PERF_MESSAGES',
		classMethods: {
			associate: function(models) {
				PERF_MESSAGES.belongsTo(models.USERS,{
					foreignKey: 'user_id'
				});
			},
                        findMessagesByLimit: function(models, data, callback) {
                        models.PERF_MESSAGES.findAll({ limit: data.limit , order:'msg_id DESC', where: { msg_id: { lte: data.msg_id  } }})
                        .then(function(messages){
                    //      result = messages;  
                          callback(messages);

                        }).catch(function(e){
//                            callback([]);
                        });
       
                        }
		}
	});
	return PERF_MESSAGES;
}
