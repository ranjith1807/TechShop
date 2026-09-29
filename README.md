Tech Shop

A complete, full-stack MERN e-commerce platform featuring product management, a robust shopping cart, and secure checkout processing.

📝 Description

Tech Shop is a modern, production-oriented e-commerce web application. It delivers a frictionless shopping experience from product discovery to payment finalization. The application pairs a highly responsive React frontend with a scalable Node/Express backend, utilizing Redux Toolkit for seamless state synchronization and the PayPal SDK for secure financial transactions.

✨ Features

Comprehensive Shopping Cart: Add, remove, and adjust product quantities with real-time pricing updates.

Secure Payment Integration: End-to-end checkout process powered by the PayPal SDK.

Product Catalog & Search: Browse extensive product listings with integrated search and pagination.

User Authentication: Secure registration and login workflows.

Order Management: Users can view their order history and track payment/delivery status.

Admin Dashboard: Dedicated administrative controls for managing users, products, and incoming orders.

Product Reviews: Authenticated users can leave ratings and reviews on purchased items.

🏗️ Tech Stack

Frontend Framework: React.js

State Management: Redux Toolkit

Backend Environment: Node.js

API Framework: Express.js

Database: MongoDB & Mongoose ORM

Payment Processing: PayPal SDK

🚀 Getting Started

Prerequisites

Node.js (v16 or higher)

npm or yarn

A local or cloud MongoDB URI (e.g., MongoDB Atlas)

A PayPal Developer account (for Client ID)

Installation

Clone the repository:

git clone https://github.com/ranjith1807/TechShop.git
cd TechShop


Install Backend Dependencies:

npm install


Install Frontend Dependencies:

cd frontend
npm install
cd ..


Environment Variables:
Create a .env file in the root directory and configure the following:

NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id


Run the Application (Concurrently):

# From the root directory, starts both backend and frontend servers
npm run dev


The frontend will run on http://localhost:3000

The backend API will run on http://localhost:5000

📂 Project Structure

TechShop/
├── backend/            # Express server, controllers, models, and routes
│   ├── config/         # Database and environment configurations
│   ├── controllers/    # Route logic (Products, Users, Orders)
│   ├── middleware/     # Custom auth and error handling
│   ├── models/         # Mongoose database schemas
│   └── routes/         # Express API routing definitions
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── screens/    # Page-level views (Home, Cart, Checkout)
│   │   └── slices/     # Redux Toolkit state slices and API endpoints
├── .env                # Secret keys and configuration
└── package.json        # Root scripts and backend dependencies


🤝 Contributing

Contributions, issues, and feature requests are welcome!

Fork the project.

Create your feature branch: git checkout -b feature/NewFeature

Commit your changes: git commit -m 'Add NewFeature'

Push to the branch: git push origin feature/NewFeature

Open a pull request.

📄 License

This project is open-source and available under the MIT License.
