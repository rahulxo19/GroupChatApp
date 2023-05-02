const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chat = sequelize.define('chats', {
    id: {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    chat : Sequelize.STRING,
})

module.exports = Chat;