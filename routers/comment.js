const express = require('express');

const commentController = require('../controllers/comment');

const router = express.Router();

router.post('/add', commentController.add);

router.post('/edit', commentController.edit);

router.post('/delete', commentController.delete);

router.get('/get', commentController.get);


module.exports = router;