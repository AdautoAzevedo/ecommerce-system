const {DataTypes} = require('sequelize');
const sequelize = require('../dbConnector');


const User = sequelize.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type:DataTypes.STRING
    },
    user_password: {
        type: DataTypes.STRING
    }
},{
    timestamps: false,
    createdAt: false
});

module.exports = User;
