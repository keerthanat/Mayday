var Sequelize = require('sequelize');

module.exports = function(sequelize) {
	var PRIVATE_MESSAGES = sequelize.define('PRIVATE_MESSAGES', {
		msg_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
        msg: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        sender: {
            type: Sequelize.TEXT,
            allowNull: false
        },
		receiver: {
                type: Sequelize.TEXT,
                allowNull: false
        },
        time_id: Sequelize.TEXT
	}, {
		timestamps: true,
		freezeTableName: false,
		tableName: 'PRIVATE_MESSAGES',
		classMethods: {
			associate: function(models) {
				PRIVATE_MESSAGES.belongsTo(models.USERS, {
					foreignKey: 'sender'
				});
				PRIVATE_MESSAGES.belongsTo(models.USERS, {
					foreignKey: 'receiver'
					
				});
			}
		}
	});
	return PRIVATE_MESSAGES;
}