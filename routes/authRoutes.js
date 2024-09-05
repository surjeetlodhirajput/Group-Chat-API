const express = require('express');
const { login, logout } = require('../controllers/authController');
const {authenticate} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/logout',authenticate, logout);

module.exports = router;
