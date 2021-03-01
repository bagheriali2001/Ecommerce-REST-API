const User = require('../models/user')
const Product = require('../models/product')
const Order = require('../models/order')


exports.add = (req, res, next) => {
    if(req.userId != req.body._id){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const _id = req.body._id
    let user
    let order
    User.findById(_id).populate('cart.product')
    .then(result =>{
        if(result != null){
            user = result
            const cartItem = result.cart.productList
            let errorArr = []
            for(let i= 0; i< cartItem.length; i++){
                if(cartItem[i].quantity > cartItem[i].product.quantity){
                    errorArr.push({productId: cartItem[i].product._id, productName: cartItem[i].product.name,
                         productQuantity: cartItem[i].product.quantity, requested: cartItem[i].quantity})
                }
            }
            if(errorArr.length != 0){
                let err = new Error()
                err.statusCode=422
                err.message="Requierd quantity is not avilable!"
                err.data = errorArr
                throw err
            }
            else{
                order = new Order ({user: _id, products: cartItem, status: 'unpaid', total:result.cart.total})
                return order.save()
            }
        }
        else {
            let err = new Error()
            err.statusCode=404
            err.message="User not found!"
            throw err
        }
    }).then(result =>{
        let product
        for(let i= 0; i< user.cart.length; i++){
            Product.findByIdAndUpdate(user.cart[i].product._id ,{ $set: { quantity: user.cart[i].product.quantity - user.cart[i].quantity }}).then(result => {})
        }
        user.cart = { productList: [], total: 0}
        user.orders.push(order._id)
        return user.save()
    }).then(result =>{
        res.status(200).json({message: "Order created!", user: user, order:order})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.get = (req, res, next) => {
    const _id = req.body._id
    Order.findById(_id).populate('cart.product')
    .then(result =>{
        if(result != null){
            if(req.userId != result.user){
                let err = new Error()
                err.statusCode=422
                err.message="Invalid Token!"
                throw err
            }
            res.status(200).json({ message: "Order found!", order: result});
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="Order not found!"
            throw err
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.adminGet = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
        Order.findById(_id).populate('cart.product')
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "Order found!", order: result});
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="Order not found!"
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

exports.pay = (req, res, next) => {
    if(req.userId != req.body._id){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const _id = req.body._id
    let order
    Order.findById(_id)
    .then(result =>{
        if(result != null){
            order = result
            order.status= "paied"
            return order.save()
        }
        else {
            let err = new Error()
            err.statusCode=404
            err.message="Order not found!"
            throw err
        }
    }).then(result =>{
        res.status(200).json({message: "Order paied!", order:order})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.send = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
        let order
        Order.findById(_id)
        .then(result =>{
            if(result != null){
                order = result
                order.status= "sent"
                return order.save()
            }
            else {
                let err = new Error()
                err.statusCode=404
                err.message="Order not found!"
                throw err
            }
        }).then(result =>{
            res.status(200).json({message: "Order sent!", order:order})
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

exports.deliver = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
        let order
        Order.findById(_id)
        .then(result =>{
            if(result != null){
                order = result
                order.status= "delivered"
                return order.save()
            }
            else {
                let err = new Error()
                err.statusCode=404
                err.message="Order not found!"
                throw err
            }
        }).then(result =>{
            res.status(200).json({message: "Order delivered!", order:order})
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

exports.adminStatusGet = (req, res, next) => {
    if(isAdmin){
        const status = req.body.status
        Order.find({status: stauts})
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "Orders found!", orders: result});
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="Order not found!"
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