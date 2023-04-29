const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./util/database');
const signup = require('./routes/signup');

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.use('/', signup)

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));