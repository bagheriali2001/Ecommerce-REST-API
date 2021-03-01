const User = require('../models/user')
const Product = require('../models/product')
const Comment = require('../models/comment')


exports.add = (req, res, next) => {
    if(req.userId != req.body.userId){
        let err = new Error()
        err.statusCode=422
        err.message="Invalid Token!"
        throw err
    }
    const userId = req.body.userId
    const productId = req.body.productId
    const title = req.body.title
    const text = req.body.text
    const score = req.body.score
    let user
    let product
    let comment
    User.findById(userId)
    .then(result=>{
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
            product = result
            comment = new Comment({title: title, text: text, score: score, author: userId, product: productId})
            return comment.save()
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="Product not found!"
            throw err
        } 
    }).then(result =>{
        user.comments.push(comment._id)
        return user.save()
    }).then(result =>{
        product.comments.push(comment._id)
        return product.save()
    }).then(result =>{
        res.status(200).json({message: "Comment added!", user: user, product: product, comment: comment})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.edit = (req, res, next) => {
    const _id = req.body._id
    const title = req.body.title
    const text = req.body.text
    const score = req.body.score
    let comment
    Comment.findById(_id)
    .then(result=>{
        if(result != null){
            comment = result
            if(req.userId != comment.author){
                let err = new Error()
                err.statusCode=422
                err.message="Invalid Token!"
                throw err
            }
            comment.title = title
            comment.text = text
            comment.score = score
            return comment.save()
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="Comment not found!"
            throw err
        }
    }).then(result =>{
        res.status(200).json({message: "Comment edited!", comment: comment})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.delete = (req, res, next) => {
    const _id = req.body._id
    let comment
    let productId
    let userId
    Comment.findById(_id).then(result=> {
        if(result!=null){
            if(req.userId != result.author){
                let err = new Error()
                err.statusCode=422
                err.message="Invalid Token!"
                throw err
            }
        }
    })
    Comment.findByIdAndRemove(_id)
    .then(result=>{
        if(result != null){
            comment = result
            userId = comment.author
            productId = comment.product
            return User.findById(userId)
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="Comment not found!"
            throw err
        }
    }).then(result =>{
        if(result != null){
            result.comments.filter(commentId => {
                if(commentId != comment._id){
                    return commentId
                }
            })
            return result.save()
        }
    }).then(result =>{
        return Product.findById(productId)
    }).then(result =>{
        if(result != null){
            result.comments.filter(commentId => {
                if(commentId != comment._id){
                    return commentId
                }
            })
            return result.save()
        }
    }).then(result =>{
        res.status(200).json({message: "Comment deleted!"})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.adminDelete = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
        let comment
        let productId
        let userId
        Comment.findByIdAndRemove(_id)
        .then(result=>{
            if(result != null){
                comment = result
                userId = comment.author
                productId = comment.product
                return User.findById(userId)
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="Comment not found!"
                throw err
            }
        }).then(result =>{
            if(result != null){
                result.comments.filter(commentId => {
                    if(commentId != comment._id){
                        return commentId
                    }
                })
                return result.save()
            }
        }).then(result =>{
            return Product.findById(productId)
        }).then(result =>{
            if(result != null){
                result.comments.filter(commentId => {
                    if(commentId != comment._id){
                        return commentId
                    }
                })
                return result.save()
            }
        }).then(result =>{
            res.status(200).json({message: "Comment deleted!"})
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

exports.get = (req, res, next) => {
    Promise.resolve('Success')
    .then(result =>{
        if(req.body._id != null){
            return Comment.findById(req.body._id)
        }
        else if(req.body.userId != null){
            return Comment.find({author: req.body.userId})
        }
        else if(req.body.productId != null){
            return Comment.find({product: req.body.productId})
        }
        else{
            let err = new Error()
            err.statusCode=422
            err.message="Invalid input!"
            throw err
        }
    }).then(result =>{
        if(result != null){
            res.status(200).json({message: "Comment(s) found!", comments: result})
        }
        else{
            let err = new Error()
            err.statusCode=404
            err.message="Comment(s) not found!"
            throw err
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};