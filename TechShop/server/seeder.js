const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const bcrypt = require('bcryptjs'); // <--- REMOVE THIS. Not needed anymore.

const Product = require('./models/productModel');
const User = require('./models/userModel');
const Order = require('./models/orderModel'); 

dotenv.config();

const users = [
  {
    name: 'Ranjith',
    email: 'ranjith@gmail.com',
    password: '123456', // <--- Plain text (Model will hash it)
    isAdmin: true,
  },
  {
    name: 'abc',
    email: 'abc@gmail.com',
    password: '123456', // <--- Plain text
    isAdmin: false,
  },
];

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

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected...');

        try {
            await Order.deleteMany(); 
            await Product.deleteMany();
            await User.deleteMany();

            // CHANGED: Use User.create() instead of insertMany()
            // This triggers the pre('save') middleware to hash passwords automatically
            const createdUsers = await User.create(users);
            
            const adminUser = createdUsers[0]._id;

            const sampleProducts = products.map((product) => {
                return { ...product, user: adminUser };
            });

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