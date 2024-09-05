const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
exports.authenticate = async(req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!token) return res.status(401).json({ message: 'No token provided' });
        const tokenExists = await Token.findOne({ token });
        if (!tokenExists) {
        return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.isAdmin = (req, res, next) => {
    this.authenticate(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    });
};
