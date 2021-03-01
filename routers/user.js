const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

const isAuth = require('../middleware/isAuth')


router.post('/add', userController.add);

router.post('/edit', isAuth.isAuth, userController.edit);

router.post('/delete',isAuth.isAuth,  userController.delete);

router.get('/get', isAuth.isAuth, userController.get);

router.get('/adminGetUser', isAuth.isAdmin, userController.adminGetUser);

router.post('/addToCart', isAuth.isAuth, userController.addToCart);

router.post('/removeFromCart', isAuth.isAuth, userController.removeFromCart);

router.get('/getCart', isAuth.isAuth, userController.getCart);

router.get('/adminGetCart', isAuth.isAdmin, userController.adminGetCart);

router.post('/addAdmin', isAuth.isAdmin, userController.addAdmin);


module.exports = router;