const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware acts as a bouncer. It checks if the user has a valid token before letting them access the profile routes.
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access denied. Please log in." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.user = decoded; // Attach the decoded user ID to the request
        next(); // Let them pass through
    } catch (ex) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
};

// GET request to fetch the user's current details
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Find the user by ID, but explicitly leave out the password field
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// PUT request to update the user's details
router.put('/', authMiddleware, async (req, res) => {
    const { email, phone, dob } = req.body;
    
    try {
        // Update the fields. runValidators ensures the email/phone rules in the model still apply during an update.
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { email, phone, dob },
            { new: true, runValidators: true } 
        ).select('-password');
        
        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        res.status(400).json({ message: err.message }); // If validation fails, send the error back to the frontend
    }
});

module.exports = router;

