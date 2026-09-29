TechShop 🛒
TechShop is a complete e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides a seamless shopping experience for customers and a robust management system for administrators.

🚀 Features
Customer Features:

Browse latest products with search and pagination functionalities.

View detailed product information, including stock status and user reviews.

Add items to the shopping cart with persistent local storage.

Secure user authentication (Login, Registration) with JWT.

Password reset functionality utilizing crypto token hashing.

Checkout process with shipping address and PayPal integration.

User profile and personal order history tracking.

Contact form to send support messages to administrators.

Admin Features:

Dashboard Access: Secure routes protected by admin middleware.

Product Management: Create, read, update, and delete products.

User Management: View all registered users.

Order Management: View all orders and mark them as delivered.

Support Management: Read and manage user contact messages.

🛠️ Tech Stack
Frontend:

React.js (Vite)

Redux Toolkit (State management for Cart and Auth)

React Router DOM

Tailwind CSS (Styling)

React PayPal JS (Payment gateway)

React Toastify (Notifications)

React Icons

Backend:

Node.js & Express.js

MongoDB & Mongoose (ODM)

JSON Web Token (JWT) for authentication

bcryptjs for password hashing

Crypto (Built-in Node module for password reset tokens)

⚙️ Environment Variables
Create a .env file in the root of your backend directory and add the following:

Code snippet
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
📦 Installation & Setup
Clone the repository

Bash
git clone https://github.com/yourusername/techshop.git
cd techshop
Install Backend Dependencies

Bash
npm install
Install Frontend Dependencies

Bash
cd frontend
npm install
Run the Application (Development Mode)
You can run the frontend and backend concurrently.

To start the backend server (from the root directory):

Bash
npm run server
# Server will start on http://localhost:5000
To start the frontend client (from the frontend directory):

Bash
npm run dev
# Client will start on http://localhost:5173
📂 Project Structure
Plaintext
├── frontend/                # React client application
│   ├── src/
│   │   ├── components/      # Reusable UI components (Header, Footer, etc.)
│   │   ├── screens/         # Page views (HomeScreen, CartScreen, Admin screens)
│   │   ├── slices/          # Redux Toolkit slices (authSlice, cartSlice)
│   │   ├── App.jsx          # Main application routing
│   │   └── store.js         # Redux store configuration
├── backend/                 # Node/Express server application
│   ├── middleware/          # Custom middleware (authMiddleware)
│   ├── models/              # Mongoose database schemas (User, Product, Order, Contact)
│   ├── routes/              # Express API routes
│   └── server.js            # Server entry point
└── package.json             
🔗 API Endpoints
Products

GET /api/products - Fetch all products (supports ?keyword= and ?pageNumber=)

GET /api/products/:id - Fetch single product

POST /api/products/:id/reviews - Create a product review

POST /api/products - Create a product (Admin)

PUT /api/products/:id - Update a product (Admin)

DELETE /api/products/:id - Delete a product (Admin)

Users

POST /api/users - Register a new user

POST /api/users/login - Authenticate user & get token

POST /api/users/forgotpassword - Generate password reset token

PUT /api/users/resetpassword/:token - Reset user password

GET /api/users - Get all users (Admin)

Orders

POST /api/orders - Create a new order

GET /api/orders/:id - Get order by ID

PUT /api/orders/:id/pay - Update order to paid

GET /api/orders/myorders/:userId - Get logged-in user's orders

GET /api/orders - Get all orders (Admin)

PUT /api/orders/:id/deliver - Update order to delivered (Admin)

Contact

POST /api/contact - Submit a contact message

GET /api/contact - Get all contact messages (Admin)

PUT /api/contact/:id/read - Mark message as read (Admin)

DELETE /api/contact/:id - Delete a message (Admin)

📄 License

This project is open-source and available under the MIT License.
