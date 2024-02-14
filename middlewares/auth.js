const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "Failed to verify the token" });
        }
        req.user = {
            userId: decoded._id,
            username: decoded.username,
        };

        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = authMiddleware;
