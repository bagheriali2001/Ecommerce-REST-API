const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();

router.post('/add', orderController.add);

router.get('/get', orderController.get);


module.exports = router;