const User = require('../models/users');
const Chat = require('../models/chats');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.loggedIn = async(req, res) => {
    try {
        const users = await User.findAll({ where: {
            lastSeen: { [Op.gte]: Date.now() - 50*60*1000 }
        }})
        const verify = jwt.verify(req.header('Auth'), process.env.SECRET_KEY);
        const user = await User.findOne({ where : { email : verify.email }});
        const logs = [];
        for(const i in users){
            if(users[i].name === user.name){
                logs.push("You")
            } else {
                logs.push(users[i].name);
            }
        }
        res.status(200).json({ currentUsers : logs })
    } catch (err) {
        res.status(202).json({ message : "error in loggedIn"})
    }
}

exports.getChats = async(req, res) => {
    try {
        const verify = jwt.verify(req.header('Auth'), process.env.SECRET_KEY);
        const user = await User.findOne({ where : { email : verify.email }});
        const chats = await Chat.findAll();
        const logs = [];
        for(const i in chats){
            if(chats[i].userId === user.id ){
                logs.push(`You : ${chats[i].chat}`)
            }
            else {
                const name = await User.findOne({ where : { id : chats[i].userId }})
                logs.push(`${name.name} : ${chats[i].chat}`)
            }
        }
        console.log(logs);
        res.status(200).json({ logs : logs })
    } catch(err) {
        res.status(202).json({ message : "error in getChats"})
    }
}

exports.postChats = async(req, res) => {
    try {
        const verify = jwt.verify(req.body.headers.Auth, process.env.SECRET_KEY);
        const { chat } = req.body;
        const user = await User.findOne({ where : { email : verify.email }});
        const c = await user.createChat({ chat: chat });
        res.status(200).json({ message: `${chat} has been posted` });
    } catch(err) {
        res.status(202).json({ message : "error in chat.chats"});
    }
}