const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating login tokens
const User = require('../models/User');

// Handling the POST request when a user tries to log in
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // First, check if the username even exists in the database
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        // Next, compare the typed password with the hashed one in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        // If they match, generate a JWT token that lasts for 1 hour
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'secretkey', 
            { expiresIn: '1h' }
        );

        res.json({ token, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong on the server" });
    }
});

module.exports = router;

