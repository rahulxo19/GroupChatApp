const jwt = require('jsonwebtoken');
const User = require('../models/users');


const JWT_SECRET_KEY = process.env.SECRET_KEY

const authenticate = async (req, res, next) => {
    try{
        const token = req.headers["authorization"]
        const user = jwt.verify(token, JWT_SECRET_KEY)
        const email = user.email 
        User.findOne({ where : { email : email }})
        .then((user) => {
            req.user = user;
            next()    
        })
        .catch(err => console.log(err))
        
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    authenticate
}