const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/add', userController.add);

router.post('/edit', userController.edit);

router.post('/delete', userController.delete);

router.get('/get', userController.get);

router.post('/addToCart', userController.addToCart);

router.post('/removeFromCart', userController.removeFromCart);

router.get('/getCart', userController.getCart);

router.post('/addOrder', userController.addOrder);

router.get('/getOrder', userController.getOrder);

router.post('/addComment', userController.addComment);

router.post('/editComment', userController.editComment);

router.post('/deleteComment', userController.deleteComment);

router.get('/getComment', userController.getComment);

router.post('/addAdmin', userController.addAdmin);


module.exports = router;