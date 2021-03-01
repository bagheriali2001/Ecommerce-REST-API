const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();

const isAuth = require('../middleware/isAuth')


router.post('/add', isAuth.isAuth, orderController.add);

router.get('/get', isAuth.isAuth, orderController.get);

router.get('/adminGet', isAuth.isAdmin, orderController.adminGet);

router.post('/pay', isAuth.isAuth, orderController.pay);

router.post('/send', isAuth.isAdmin, orderController.send);

router.post('/deliver', isAuth.isAdmin, orderController.deliver);

router.get('/adminStatusGet', isAuth.isAdmin, orderController.adminStatusGet);


module.exports = router;