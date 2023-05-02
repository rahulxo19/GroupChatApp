const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.signup = async (req, res) => {
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
    pswd: hashedPassword,
  });
  res.send("user created");
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const passwordMatches = await bcrypt.compare(password, user.pswd);
  if (passwordMatches) {
    await user.update({ lastSeen: Date.now() });
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
    return res.status(200).json({ data: token });
  }
  res.status(401).json({ message: "User not authorized" });
};
