const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./util/database');
const user = require('./routes/user');
const chat = require('./routes/chat');
const group = require('./routes/group');

const User = require('./models/users');
const Chat = require('./models/chats');
const Group = require('./models/groups');
const UserGroup = require('./models/userGroup');

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.use('/user', user)
app.use('/chat', chat)
app.use('/groups', group)

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup, unique: false });
Group.belongsToMany(User, { through: UserGroup, unique: false });

Group.hasMany(Chat);
Chat.belongsTo(Group);

Group.hasOne(UserGroup);
User.hasOne(UserGroup);

sequelize
  .sync()
  // .sync({ force : true })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));