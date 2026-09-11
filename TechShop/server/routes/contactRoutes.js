const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Submit a contact message
// @route   POST /api/contact
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
router.get('/', protect, admin, async (req, res) => {
    try {
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
router.put('/:id/read', protect, admin, async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (message) {
            message.isRead = true;
            const updatedMessage = await message.save();
            res.json(updatedMessage);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete message
// @route   DELETE /api/contact/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (message) {
            await message.deleteOne();
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
