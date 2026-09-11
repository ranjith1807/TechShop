const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
// FIXED: Use environment variable instead of hardcoded string
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/users
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        res.status(400).json({ message: 'Please provide a valid email address' });
        return;
    }
    if (!password || password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters long' });
        return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // FIXED: Removed manual bcrypt hashing here.
    // We pass the plain 'password' so the User Model middleware can hash it.
    const user = await User.create({
        name,
        email,
        password, 
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // FIXED: This check is correct. It compares the plain text password
    // from the login form with the encrypted password in the DB.
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users (Admin)
// @route   GET /api/users
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const crypto = require('crypto');

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
router.post('/forgotpassword', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire to 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Mock Email Sending (Logging to console)
    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
    console.log(`\n\n--- MOCK EMAIL ---`);
    console.log(`To: ${user.email}`);
    console.log(`Subject: Password Reset Request`);
    console.log(`You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`);
    console.log(`--- END MOCK EMAIL ---\n\n`);

    res.status(200).json({ message: 'Email sent (check backend console)' });
});

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:token
router.put('/resetpassword/:token', async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });
});

module.exports = router;