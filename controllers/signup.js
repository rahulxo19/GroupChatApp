const User = require("../models/users");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  console.log(req.body);
  const { name, phone, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const exist = await User.findOne({ where: { name: name } });
  if (exist) {
    return res.send("user already exists");
  }
  const user = await User.create({
    name: name,
    phone: phone,
    email: email,
    password: hashedPassword,
  });
  res.send("user created");
};
