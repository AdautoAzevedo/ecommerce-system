const Sequelize = require('sequelize');

const sequelize = new Sequelize('mydb', 'root', 'Isa01Ada!', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;