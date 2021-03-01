const express = require('express');

const productController = require('../controllers/product');

const router = express.Router();

const isAuth = require('../middleware/isAuth')


router.post('/add', isAuth.isAdmin, productController.add);

router.post('/edit', isAuth.isAdmin, productController.edit);

router.post('/delete', isAuth.isAdmin, productController.delete);

router.get('/get', productController.get);

router.post('/addLoad', isAuth.isAdmin, productController.addLoad);

module.exports = router;