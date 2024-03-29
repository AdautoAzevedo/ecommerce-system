const Sequelize = require('sequelize');

const sequelize = new Sequelize('mydb', 'root', '********', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
