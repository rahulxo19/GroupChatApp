const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const signup = require('./routes/signup');

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.use('/signup', signup)

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));