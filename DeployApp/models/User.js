const mongoose = require('mongoose');

// This schema directly follows the design specs provided.
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // I will hash this before it ever gets saved
    email: { 
        type: String, 
        required: true, 
        unique: true,
        // Regex to make sure it's a real email format
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'] 
    },
    phone: { 
        type: String, 
        required: true,
        // Regex to ensure only numbers are entered here
        match: [/^[0-9]+$/, 'Phone number must only contain digits'] 
    },
    dob: { type: Date, required: true }
});

module.exports = mongoose.model('User', UserSchema);

