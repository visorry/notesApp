const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken'); 
require('dotenv').config()
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: " fill all fields." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "user already exists." });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashPass
        });

        await user.save();
        res.status(201).json({ message: "registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "failed to register"});
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "enter email and password." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "invalid email or password." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json( error);
    }
});


module.exports = router;
