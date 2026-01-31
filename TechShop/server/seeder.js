const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Import Models
const Product = require('./models/productModel');
const User = require('./models/userModel');
// If you do NOT have an Order model file, delete the next line
const Order = require('./models/orderModel'); 

dotenv.config();

// 1. Sample Users
const users = [
  {
    name: 'Ranjith',
    email: 'ranjith@gmail.com',
    password: bcrypt.hashSync('123456', 10), 
    isAdmin: true,
  },
  {
    name: 'abc',
    email: 'abc@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

// 2. Sample Products (Note: No 'user' field here yet)
const products = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: '/images/airpods.jpg',
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
    image: '/images/phone.jpg',
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
    image: '/images/playstation.jpg',
    description: 'The ultimate home entertainment center starts with PlayStation.',
    brand: 'Sony',
    category: 'Electronics',
    price: 399.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  },
  {
    name: 'Sony Playstation 4',
    image: '/images/playstation.jpg',
    description: 'The ultimate home entertainment center starts with PlayStation.',
    brand: 'Sony',
    category: 'Electronics',
    price: 299.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  }

];

// 3. Connect and Import
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected...');

        try {
            // A. Clear Database
            // If you get an error "Order is not defined", comment out the next line
            await Order.deleteMany(); 
            await Product.deleteMany();
            await User.deleteMany();

            // B. Create Users
            const createdUsers = await User.insertMany(users);
            
            // C. Get Admin ID (The first user we created)
            const adminUser = createdUsers[0]._id;

            // D. CRITICAL FIX: Add Admin ID to every product
            const sampleProducts = products.map((product) => {
                return { ...product, user: adminUser };
            });

            // E. Insert the NEW list (sampleProducts), NOT the old one
            await Product.insertMany(sampleProducts);

            console.log('✅ Data Imported Successfully!');
            process.exit();
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error(`❌ Connection Error: ${err.message}`);
        process.exit(1);
    });