const User = require('../models/user')
const Product = require('../models/product')
const Order = require('../models/order')
const bcrypt = require('bcrypt');


exports.add = (req, res, next) => {
    const name = req.body.name
    const username = req.body.username
    const email = req.body.email
    const imageUrl = req.body.imageUrl || ""
    let user 
    User.findOne({'email': email})
    .then(result =>{
        if(result != null){
            let err = new Error()
            err.statusCode=422
            err.message="Email already exist!"
            throw err
        }
        else{
            return User.findOne({'username': username})
        }
    }).then(result => {
        if(result != null){
            let err = new Error()
            err.statusCode=422
            err.message="Username already exist!"
            throw err
        }
        else{
            return bcrypt.hash(req.body.password , 12)
        }
    }).then(result =>{
        user = new User({name: name, username: username, email: email, password: result, imageUrl: imageUrl, isAdmin: false, cart: { productList: [], total: 0}})
        return user.save()
    }).then(result => {
        res.status(201).json({ message: "User created!", user: user});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.edit = (req, res, next) => {
    if(req.userId != req.body._id){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const _id = req.body._id
    const name = req.body.name
    const username = req.body.username
    const email = req.body.email
    const imageUrl = req.body.imageUrl || ""
    let user 
    User.findById(_id)
    .then(result =>{
        if(result != null){
            user = result
            return User.find({'email': email})
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="User not found"
            throw err
        }
    }).then(result =>{
        if (result == null){
            return User.find({'username': username})
        }
        else if(result.length == 1){
            return User.find({'username': username})
        }
        else {
            let err = new Error()
            err.statusCode=422
            err.message="Email already exist!"
            throw err
        }
    }).then(result => {
        if (result == null){
            return bcrypt.hash(req.body.password , 12)
        }
        else if(result.length == 1){
            return bcrypt.hash(req.body.password , 12)
        }
        else {
            let err = new Error()
            err.statusCode=422
            err.message="Username already exist!"
            throw err
        }
    }).then(result =>{
        user.name = name
        user.email = email
        user.password = result
        user.imageUrl = imageUrl
        user.username = username
        return user.save()
    }).then(result => {
        res.status(201).json({ message: "User edited!", user: user});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.delete = (req, res, next) => {
    if(req.userId != req.body._id){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const _id = req.body._id
    User.findByIdAndRemove(_id)
    .then(result =>{
        if(result != null){
            res.status(200).json({ message: "User deleted!"});
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
};

exports.get = (req, res, next) => {
    if(req.userId != req.body._id){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const _id = req.body._id
    User.findById(_id)
    .then(result =>{
        if(result != null){
            res.status(200).json({ message: "User found!", user: result});
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
};

exports.adminGetUser = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
        User.findById(_id)
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "User found!", user: result});
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
    }
    else{
        let err = new Error()
        err.statusCode=422
        err.message="Not authenticated!"
        next(err)
    }
};

exports.addToCart = (req, res, next) => {
    if(req.userId != req.body.userId){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const userId = req.body.userId
    const productId = req.body.productId
    const quantity = +req.body.quantity || 1
    let user
    User.findById(userId)
    .then(result =>{
        if(result != null){
            user = result
            return Product.findById(productId)
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="User not found!"
            throw err
        }
    }).then(result =>{
        const totalDiffrence = quantity * result.price
        if(result != null){
            let productFound = false
            for(let i= 0; i< user.cart.productList.length; i++){
                if(user.cart.productList[i].product == productId){
                    if(+user.cart.productList[i].quantity + +quantity > result.quantity){
                        let err = new Error()
                        err.statusCode=422
                        err.message="Requierd quantity is not avilable!"
                        err.data = {limit:result.quantity}
                        throw err
                    }
                    user.cart.productList[i].quantity = +user.cart.productList[i].quantity + +quantity
                    user.cart.total = user.cart.total + totalDiffrence
                    productFound = true 
                }
            }
            if (!productFound){
                if(+quantity > result.quantity){
                    let err = new Error()
                    err.statusCode=422
                    err.message="Requierd quantity is not avilable!"
                    err.data = {limit:result.quantity}
                    throw err
                }
                user.cart.productList.push({product: productId, quantity: +quantity})
                user.cart.total = user.cart.total + totalDiffrence
            }
            return user.save()
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="Product not found!"
            throw err
        }
    }).then(result =>{
        res.status(200).json({message: "Product added to cart!", user: user})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.removeFromCart = (req, res, next) => {
    if(req.userId != req.body.userId){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const userId = req.body.userId
    const productId = req.body.productId
    const quantity = +req.body.quantity || 1
    let user
    User.findById(userId)
    .then(result =>{
        if(result != null){
            user = result
            return Product.findById(productId)
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="User not found!"
            throw err
        }
    }).then(result =>{
        if(result != null){
            let totalDiffrence = result.price
            let productFound = false
            for(let i= 0; i< user.cart.productList.length; i++){
                if(user.cart.productList[i].product == productId){
                    if(quantity == 0){
                        totalDiffrence = totalDiffrence * user.cart.productList[i].quantity
                        user.cart.productList[i].quantity = 0
                    }
                    else{
                        totalDiffrence = totalDiffrence * quantity
                        user.cart.productList[i].quantity = +user.cart.productList[i].quantity - +quantity
                    }
                    if(user.cart.productList[i].quantity < 1){
                        if(user.cart.productList[i].quantity < 0){
                            totalDiffrence = totalDiffrence + (user.cart.productList[i].quantity * result.price)
                        }
                        const newCart = user.cart.productList.filter(cartItem => {
                            if(cartItem.product != productId){
                                return cartItem
                            }
                        })
                        user.cart.productList = newCart
                    }
                    productFound = true 
                }
            }
            if (!productFound){let err = new Error()
                err.statusCode=404
                err.message="Product is not in the cart!"
                throw err
            }
            user.cart.total = user.cart.total - totalDiffrence
            return user.save()
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="Product not found!"
            throw err
        }
    }).then(result =>{
        res.status(200).json({message: "Product removed from cart!", user: user})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.getCart = (req, res, next) => {
    if(req.userId != req.body._id){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const _id = req.body._id
    User.findById(_id).populate('cart.product')
    .then(result =>{
        if(result != null){
            res.status(200).json({ message: "Cart found!", cart: result.cart});
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
};

exports.adminGetCart = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
        User.findById(_id).populate('cart.product')
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "Cart found!", cart: result.cart});
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
    }
    else{
        let err = new Error()
        err.statusCode=422
        err.message="Not authenticated!"
        next(err)
    }
};

exports.addAdmin = (req, res, next) => {
    if(isAdmin){
        const name = req.body.name
        const username = req.body.username
        const email = req.body.email
        const imageUrl = req.body.imageUrl || ""
        let user 
        User.findOne({'email': email})
        .then(result =>{
            if(result != null){
                let err = new Error()
                err.statusCode=422
                err.message="Email already exist!"
                throw err
            }
            else{
                return User.findOne({'username': username})
            }
        }).then(result => {
            if(result != null){
                let err = new Error()
                err.statusCode=422
                err.message="Username already exist!"
                throw err
            }
            else{
                return bcrypt.hash(req.body.password , 12)
            }
        }).then(result =>{
            user = new User({name: name, username: username, email: email, password: result, imageUrl: imageUrl, isAdmin: true})
            return user.save()
        }).then(result => {
            res.status(201).json({ message: "User created!", user: user});
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
        })
    }
    else{
        let err = new Error()
        err.statusCode=422
        err.message="Not authenticated!"
        next(err)
    }
};