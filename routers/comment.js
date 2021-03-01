const express = require('express');

const commentController = require('../controllers/comment');

const router = express.Router();

const isAuth = require('../middleware/isAuth')

router.post('/add', isAuth.isAuth, commentController.add);

router.post('/edit', isAuth.isAuth, commentController.edit);

router.post('/delete', isAut.isAuth, commentController.delete);

router.post('/adminDelete', isAut.isAdmin, commentController.adminDelete);

router.get('/get', commentController.get);


module.exports = router;