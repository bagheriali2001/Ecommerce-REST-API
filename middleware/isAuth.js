const jwt = require('jsonwebtoken')
const privateInfo = require('../util/private-info')
const User = require('../models/user')


exports.isAuth = (req, res, next) => {
    if(req.get('Authorization') != null){
        const token = req.get('Authorization').split(' ')[1]
        let decodedToken
        try{
            decodedToken = jwt.verify(token,privateInfo.jwtSecret)
        }
        catch(err){
            err.statusCode=500
            throw err
        }
        if(!decodedToken){
            let err = new Error("Not authenticated!")
            err.statusCode=401
            throw err
        }
        User.findById(decodedToken.id)
        .then(result=>{
            if(result!=null){
                req.userId = decodedToken.id
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="User not found!"
                throw err
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
        next();
    }
    else{
        let err = new Error()
        err.statusCode=401
        err.message="Please send token!"
        throw err;
    }   
};

exports.isAdmin = (req, res, next) => {
    if(req.get('Authorization') != null){
        const token = req.get('Authorization').split(' ')[1]
        let decodedToken
        try{
            decodedToken = jwt.verify(token,privateInfo.jwtSecret)
        }
        catch(err){
            err.statusCode=500
            throw err
        }
        if(!decodedToken){
            let err = new Error("Not authenticated!")
            err.statusCode=401
            throw err
        }
        User.findById(decodedToken.id)
        .then(result=>{
            if(result!=null){
                if(user.isAdmin== true){
                    req.userId = decodedToken.id
                    req.isAdmin = true
                }
                else{
                    let err = new Error()
                    err.statusCode=422
                    err.message="User not an admin!"
                    throw err
                }
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="User not found!"
                throw err
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
        next();
    }
    else{
        let err = new Error()
        err.statusCode=401
        err.message="Please send token!"
        throw err;
    }   
};