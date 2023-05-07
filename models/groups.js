const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING
})

module.exports = Group;