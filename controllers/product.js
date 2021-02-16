const Product = require('../models/product')



exports.add = (req, res, next) => {
    const name = req.body.name
    const description = req.body.description
    const price = req.body.price
    const imageUrl = req.body.imageUrl || [] 
    const product = new Product({name: name, description: description, quantity: 0, price: price, imageUrl: imageUrl})
    product.save()
    .then(result => {
      res.status(201).json({ massage: "Product created!", product: product});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.edit = (req, res, next) => {
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
            res.status(404).json({ massage: "Product not found!"});
        }
    })
    .then(result =>{
      res.status(201).json({ massage: "Product edited!", product: product});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.delete = (req, res, next) => {
    const _id = req.body._id

    Product.findByIdAndRemove(_id)
    .then(result =>{
        if(result != null){
            res.status(200).json({ massage: "Product deleted!"});
        }
        else{
            res.status(404).json({ massage: "Product not found!"});
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
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
                res.status(200).json({ massage: "Products found!", products: result, totalProducts: total});
            }
            else{
                res.status(404).json({ massage: "Not enough products!"});
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
                res.status(200).json({ massage: "Product found!" , product: result});
            }
            else{
                res.status(404).json({ massage: "Product not found!"});
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
                res.status(200).json({ massage: "Products found!", products: result, totalProducts: total});
            }
            else{
                res.status(404).json({ massage: "Not enough products!"});
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
    const _id = req.body._id || 0
    const loadQuantity = +req.body.loadQuantity
    let product

    Product.findById(_id)
    .then(result =>{
        if(result == null){
            res.status(404).json({ massage: "Product not found!"});
        }
        else{
            product = result
            product.quantity = product.quantity + loadQuantity
            return product.save()
        }
    }).then(result =>{
        res.status(200).json({ massage: "Load added!", products: product});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
};