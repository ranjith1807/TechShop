const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// @desc    Fetch all products (WITH SEARCH)
router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        } : {};

        const products = await Product.find({ ...keyword });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Fetch single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- SAFE REVIEW ROUTE (DEBUG VERSION) ---
router.post('/:id/reviews', async (req, res) => {
    console.log("Review Request Received:", req.body); // <--- LOG 1: Check data

    const { rating, comment, user } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Safety Check: Ensure reviews array exists
            if (!product.reviews) {
                product.reviews = [];
            }

            // Safety Check: Ensure User ID exists
            if (!user || !user._id) {
                console.log("Error: User ID missing");
                res.status(400).json({ message: 'User not authenticated properly' });
                return;
            }

            // 1. Check if already reviewed
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400).json({ message: 'Product already reviewed' });
                return;
            }

            // 2. Add Review
            const review = {
                name: user.name,
                rating: Number(rating),
                comment,
                user: user._id,
            };

            product.reviews.push(review);

            // 3. Update Stats
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            console.log("Review Saved Successfully!");
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("SERVER CRASH ERROR:", error); // <--- LOG 2: See exact error
        res.status(500).json({ message: error.message }); // Send error text to frontend
    }
});

// --- ADMIN ROUTES ---
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = new Product({
            name: 'Sample Name',
            price: 0,
            user: req.body.user,
            image: '/images/sample.jpg',
            brand: 'Sample Brand',
            category: 'Sample Category',
            countInStock: 0,
            numReviews: 0,
            description: 'Sample description',
            rating: 0,
            reviews: [] // Initialize empty reviews
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.brand = brand;
            product.category = category;
            product.countInStock = countInStock;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;