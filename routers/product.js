const express = require('express');

const productController = require('../controllers/product');

const router = express.Router();

router.post('/add', productController.add);

router.post('/edit', productController.edit);

router.post('/delete', productController.delete);

router.get('/get', productController.get);

router.post('/addLoad', productController.addLoad);

module.exports = router;