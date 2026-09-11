import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ContactScreen from './screens/ContactScreen';
import ContactListScreen from './screens/ContactListScreen';
import ShippingScreen from './screens/ShippingScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserListScreen from './screens/UserListScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderScreen from './screens/OrderScreen';

const App = () => {
  return (
    <Provider store={store}>
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-200">
                <Header />
                <main className="flex-grow py-8">
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/search/:keyword" element={<HomeScreen />} />
                        
                        <Route path="/product/:id" element={<ProductScreen />} />
                        <Route path="/cart" element={<CartScreen />} />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/register" element={<RegisterScreen />} />
                        <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
                        <Route path="/resetpassword/:token" element={<ResetPasswordScreen />} />
                        <Route path="/contact" element={<ContactScreen />} />
                        <Route path="/shipping" element={<ShippingScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/userlist" element={<UserListScreen />} />
                        <Route path="/admin/productlist" element={<ProductListScreen />} />
                        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
                        <Route path="/admin/orderlist" element={<OrderListScreen />} />
                        <Route path="/admin/contactlist" element={<ContactListScreen />} />
                        <Route path="/order/:id" element={<OrderScreen />} />
                    </Routes>
                </main>
                <footer className="bg-gray-900 text-gray-400 py-10 mt-12 border-t border-gray-800">
                    <div className="container mx-auto text-center">
                        <h3 className="text-xl font-bold text-white mb-4">TechShop</h3>
                        <p className="mb-4">Premium electronics for the modern era.</p>
                        <p className="text-sm">&copy; {new Date().getFullYear()} TechShop. All rights reserved.</p>
                    </div>
                </footer>
                
                {/* Global Toast Notifications */}
                <ToastContainer 
                    position="bottom-right" 
                    autoClose={3000} 
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
        </Router>
    </Provider>
  );
};

export default App;