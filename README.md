Key Features
Full-Featured Shopping Cart: Users can add, remove, and update quantities of items.

Secure Checkout: Integration with PayPal Sandbox for safe and real-time payment processing.

User Authentication: JWT-based login and registration system.

Admin Dashboard: Dedicated interface for managing products, users, and tracking order statuses.

Order History: Users can view their past orders and payment status (Paid/Not Paid).

Database Management: Robust data handling using MongoDB and Mongoose models.

🛠️ Tech Stack
Frontend: React.js, Redux Toolkit (State Management), Tailwind CSS, React Router.

Backend: Node.js, Express.js.

Database: MongoDB Atlas.

Authentication: JSON Web Tokens (JWT) & Bcrypt.js.

Payments: PayPal Developer SDK.

📋 Prerequisites
Before running the project locally, ensure you have the following installed:

Node.js (v16 or higher)

npm or yarn

MongoDB Atlas account or local MongoDB installation

⚙️ Installation & Setup
1. Clone the Repository
Bash
git clone https://github.com/ranjith1807/TechShop
cd techshop
2. Backend Setup
Navigate to the root directory and install dependencies:

Bash
npm install

Create a .env file in the root and add your credentials:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
3. Frontend Setup
Navigate to the client folder and install dependencies:

Bash
cd client
npm install

4. Run the Application
From the root directory, run both frontend and backend concurrently:

Bash
npm run dev