const express = require('express');
const { createGroup, deleteGroup, addMember, sendMessage, likeMessage } = require('../controllers/groupController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createGroup);
router.delete('/:id', authenticate, deleteGroup);
router.post('/add-member', authenticate, addMember);
router.post('/message', authenticate, sendMessage);
router.post('/like-message', authenticate, likeMessage);

module.exports = router;
