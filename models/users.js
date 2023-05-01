const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('users',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    phone: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    pswd: {
        type: Sequelize.STRING
    },
    lastSeen: {
        type: Sequelize.DATE
    }
})

module.exports = User;