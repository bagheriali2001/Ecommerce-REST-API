const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Crypto = require('crypto')
const privateInfo = require('../util/private-info')
const sendEmail = require('../util/sendEmail')


exports.login = (req, res, next) => {
    const username = req.body.username || null;
    const email = req.body.email || null
    const password = req.body.password
    let user
    Promise.resolve('Success')
    .then(result=>{
        if(username != null){
            return User.findOne(username)
        }
        else if(email != null){
            return User.findOne(email)
        }
        else{
            let err = new Error()
            err.statusCode=401
            err.message="Please enter Username or Email first!"
            throw err
        }
    }).then(result =>{
        user = result
        if(user != null){
            return bcrypt.compare(password,user.password)
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="User not found!"
            throw err
        } 
    }).then(result =>{
        if(result == true){
            user.token = jwt.sign({username: user.username, email: user.email, id: user._id.toString()},privateInfo.jwtSecret,{expiresIn: '30d'})
            return user.save()
        }
        else{
            let err = new Error()
            err.statusCode=401
            err.message="Wrong password!"
            throw err
        }
    }).then(result =>{
        res.status(200).json({message: "Logged in!", token: user.token})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.requestResetPassword = (req, res, next) => {
    const username = req.body.username || null;
    const email = req.body.email || null
    let user
    Promise.resolve('Success')
    .then(result=>{
        if(username != null){
            return User.findOne(username)
        }
        else if(email != null){
            return User.findOne(email)
        }
        else{
            let err = new Error()
            err.statusCode=401
            err.message="Please enter Username or Email first!"
            throw err
        }
    }).then(result =>{
        if(result != null){
            user = result
            Crypto.randomBytes(32,(err, buffer)=>{
                if(err){
                    let err = new Error()
                    err.statusCode=422
                    err.message="Error creating randomBytes!"
                    throw err
                }
                user.resetToken = buffer.toString('hex')
            })
            user.resetTokenExp = Date.now() + 3600000
            return user.save()
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="User not found!"
            throw err
        }
    }).then(result=>{
        sendEmail.sendEmail(user.email,user.resetToken)
        res.status(200).json({message : "Reset password email have been sent!"})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.resetPassword = (req, res, next) => {
    const resetToken = req.params.token
    const newPassword = req.body.newPassword
    let user
    let hashedPassword
    bcrypt.hash(newPassword , 12)
    .then(result =>{
        hashedPassword = result
        return User.findOne({resetToken: resetToken, resetTokenExp: {$gt: Date.now()}})
    }).then(result=>{
        if(result != null){
            user = result
            user.password = hashedPassword
            user.resetToken = null
            user.resetTokenExp = null
            return user.save()
        }
        else{
            let err = new Error()
            err.statusCode=422
            err.message="Token Expired!"
            throw err 
        }
    }).then(result =>{
        res.status(200).json({message: "Password changed!"})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};