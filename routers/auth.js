const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', authController.login);

router.post('/requestResetPassword', authController.requestResetPassword);

router.post('/resetPassword/:token', authController.resetPassword);


module.exports = router;