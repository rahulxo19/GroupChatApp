const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.loggedIn = async(req, res) => {
    try {
        const users = await User.findAll({ where: {
            lastSeen: { [Op.gte]: Date.now() - 10*60*1000 }
        }})
        const logs = [];
        console.log('here')
        for(const user in users){
            console.log(user);
            const verify = jwt.verify(req.header('Auth'), process.env.SECRET_KEY);
            console.log(verify);
            if(users[user].name === verify.name){
                logs.push("You")
                console.log("You")
            } else {
                logs.push(users[user].name);
            }
        }
        console.log(logs);
        res.status(200).json({ currentUsers : logs })
    } catch (err) {
        res.status(202).json({ message : "error happened"})
    }
}