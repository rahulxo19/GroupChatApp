const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const multer = require('multer');

const sequelize = require('./util/database');
const user = require('./routes/user');
const chat = require('./routes/chat');
const group = require('./routes/group');
const path = require('path');

const User = require('./models/users');
const Chat = require('./models/chats');
const Group = require('./models/groups');
const UserGroup = require('./models/userGroup');
const auth = require('./middleware/auth')

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(express.static('uploads'));

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup, unique: false });
Group.belongsToMany(User, { through: UserGroup, unique: false });

Group.hasMany(Chat);
Chat.belongsTo(Group);

Group.hasOne(UserGroup);
User.hasOne(UserGroup);

var fileName;
const storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename : function(req, file, cb) {
    const uniqueSuffix = Date.now();
    const fileExtension = path.extname(file.originalname);
    fileName = uniqueSuffix + file.originalname;
    cb(null, fileName);
  }
})

const upload = multer({ storage : storage });

app.use('/chat/file', upload.single('file'), auth.authenticate, async (req, res) => {
  console.log(req.file);
  try {
    const user = req.user;
    const email = req.headers['user-email'];
    const groupId = req.headers['group-id'];
    console.log(req.headers);
    console.log(user);
    console.log(groupId);
    await user.createChat({
      chat : `<a href="/GroupChatApp/uploads/${fileName}">${fileName}</a>`,
      groupId : groupId
    })
  } catch (err) {
    console.log(err);
  }
})

app.use('/user', user)
app.use('/chat', chat)
app.use('/groups', group)


sequelize
  .sync()
  // .sync({ force : true })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));