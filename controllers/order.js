const User = require('../models/user')
const Product = require('../models/product')
const Order = require('../models/order')



exports.add = (req, res, next) => {
    const _id = req.body._id
    let user
    let order
    User.findById(_id).populate('cart.product')
    .then(result =>{
        if(result != null){
            user = result
            const cart = result.cart
            let errorArr = []
            for(let i= 0; i< cart.length; i++){
                if(cart[i].quantity > cart[i].product.quantity){
                    errorArr.push({productId: cart[i].product._id, productName: cart[i].product.name,
                         productQuantity: cart[i].product.quantity, requested: cart[i].quantity})
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
                order = new Order ({user: _id, products: cart, isPaid: false, isCanceled: false})
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
        user.cart = []
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