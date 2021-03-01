const Product = require('../models/product')


exports.add = (req, res, next) => {
    if(isAdmin){
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const imageUrl = req.body.imageUrl || [] 
        const product = new Product({name: name, description: description, quantity: 0, price: price, imageUrl: imageUrl})
        product.save()
        .then(result => {
            res.status(201).json({ message: "Product created!", product: product});
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

exports.edit = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const imageUrl = req.body.imageUrl || [] 
        let product
        Product.findById(_id)
        .then(result =>{
            if(result != null){
                product = result
                product.name = name
                product.description = description
                product.price = price
                if(imageUrl != [])
                    product.imageUrl = imageUrl
                return product.save()
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="Product not found!"
                throw err
            }
        })
        .then(result =>{
            res.status(201).json({ message: "Product edited!", product: product});
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

exports.delete = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id
    
        Product.findByIdAndRemove(_id)
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "Product deleted!"});
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="Product not found!"
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

exports.get = (req, res, next) => {
    const _id = req.body._id || 0
    const page = +req.body.page || 0
    const productPerPage = +req.body.productPerPage || 0
    if(_id== 0&& page== 0&& productPerPage== 0){
        Product.find().estimatedDocumentCount()
        .then(result =>{
            total = result
            return Product.find()
        })
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "Products found!", products: result, totalProducts: total});
            }
            else{
                res.status(404).json({ message: "Not enough products!"});
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }
    else if(_id != 0 ){
        Product.findById(_id).populate('comments')
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "Product found!" , product: result});
            }
            else{
                let err = new Error()
                err.statusCode=404
                err.message="Product not found!"
                throw err
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }
    else if(page != 0 && productPerPage!= 0){
        let total
        Product.find().estimatedDocumentCount()
        .then(result =>{
            total = result
            return Product.find().skip((page-1)*productPerPage).limit(productPerPage)
        })
        .then(result =>{
            if(result != null){
                res.status(200).json({ message: "Products found!", products: result, totalProducts: total});
            }
            else{
                res.status(404).json({ message: "Not enough products!"});
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }
};

exports.addLoad = (req, res, next) => {
    if(isAdmin){
        const _id = req.body._id || 0
        const loadQuantity = +req.body.loadQuantity
        let product
    
        Product.findById(_id)
        .then(result =>{
            if(result == null){
                let err = new Error()
                err.statusCode=404
                err.message="Product not found!"
                throw err
            }
            else{
                product = result
                product.quantity = product.quantity + loadQuantity
                return product.save()
            }
        }).then(result =>{
            res.status(200).json({ message: "Load added!", products: product});
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