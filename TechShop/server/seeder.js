const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
//const connectDB = require('./config/db'); // We will define this in server.js for simplicity here

dotenv.config();

const products = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: 'https://images.unsplash.com/photo-1572569028738-411a39756116?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Bluetooth technology lets you connect it with compatible devices wirelessly',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'iPhone 13 Pro 256GB Memory',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity.',
    brand: 'Apple',
    category: 'Electronics',
    price: 599.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },
  {
    name: 'Sony Playstation 5',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'The ultimate home entertainment center starts with PlayStation.',
    brand: 'Sony',
    category: 'Electronics',
    price: 399.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });