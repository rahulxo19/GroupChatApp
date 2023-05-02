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
        const chats = await Chat.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10
          });
          console.log(verify);
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
        const lastChat = chats[0].createdAt;
        res.status(200).json({ logs, lastChat })
    } catch(err) {
        res.status(202).json({ message : "error in getChats"})
    }
}

exports.postChats = async(req, res) => {
    try {
        const verify = jwt.verify(req.body.headers.Auth, process.env.SECRET_KEY);
        const { chat } = req.body;
        const user = await User.findOne({ where : { email : verify.email }});
        await user.createChat({ chat: chat });
        res.status(200).json({ message: `${chat} has been posted` });
    } catch(err) {
        res.status(202).json({ message : "error in chat.chats"});
    }
}

exports.latestChats = async(req, res) => {
    console.log('herer')
    
    try {
        const verify = jwt.verify(req.header('Auth'), process.env.SECRET_KEY);
        const user = await User.findOne({ where : { email : verify.email }});
        const createdAt = req.query.createdAt || new Date(0);
        console.log(createdAt);
        const chats = await Chat.findAll({ 
            where: { 
                createdAt: { [Op.gt]: createdAt } // get chats created after the specified time
            }
        });
        console.log(chats);
        console.log(chats.length);
        const logs = [];
        for(const i in chats ){
            console.log(chats[i].chat);
            if(chats[i].userId === user.id ){
                logs.push(`You : ${chats[i].chat}`)
            }
            else {
                const name = await User.findOne({ where : { id : chats[i].userId }})
                logs.push(`${name.name} : ${chats[i].chat}`)
            }
        }
        console.log('1')
        console.log('1')
        console.log('1')
        console.log('1')
        console.log('1')
        console.log(logs);
        let lastChat = createdAt;
        if(chats.length!=0){
        lastChat = chats[0].createdAt;
        }
        console.log(lastChat);
        res.status(200).json({ logs: logs, lastChat: lastChat });
    } catch(err) {
        console.log('efhoaweifhehf')
        res.status(202).json({ message : "error in getChats" });
    }
}
