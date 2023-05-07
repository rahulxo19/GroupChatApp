const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = require('./users');
const Group = require('./groups');

const UserGroup = sequelize.define('usergroups', {
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true,
    },
      asAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
})

module.exports = UserGroup;