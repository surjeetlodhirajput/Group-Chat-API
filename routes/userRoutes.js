const express = require('express');
const { createUser, editUser } = require('../controllers/userController');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', isAdmin, createUser);
router.put('/:id', isAdmin, editUser);

module.exports = router;
