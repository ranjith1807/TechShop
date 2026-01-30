const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice, user } = req.body;

        if (!orderItems || orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }

        // --- FIX: Format the items to match the Database Schema ---
        // The database expects 'product' (ID), but frontend sends '_id'
        const cleanOrderItems = orderItems.map((item) => ({
            name: item.name,
            qty: 1, // Default to 1 if missing
            image: item.image,
            price: item.price,
            product: item._id // <--- IMPORTANT: Map _id to product
        }));

        const order = new Order({
            orderItems: cleanOrderItems,
            user: user,
            shippingAddress,
            totalPrice,
            isDelivered: false,
            isPaid: false
        });

        const createdOrder = await order.save();
        console.log("Order Created Successfully:", createdOrder._id);
        res.status(201).json(createdOrder);

    } catch (error) {
        // --- LOG THE CRASH ERROR TO TERMINAL ---
        console.error("SERVER CRASH DURING ORDER CREATION:", error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update Order to Paid
router.put('/:id/pay', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            
            // Save payment result from PayPal
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment Error' });
    }
});

// @desc    Get logged in user orders
router.get('/myorders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// @desc    Get all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name'); 
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders' });
    }
});

// @desc    Update order to delivered
router.put('/:id/deliver', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = new Date(); 
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;