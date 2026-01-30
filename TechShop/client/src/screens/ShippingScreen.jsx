import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Added useDispatch
import axios from 'axios';
import { clearCartItems } from '../slices/cartSlice'; // Added Import

const ShippingScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Activate Dispatch
    
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * 1, 0).toFixed(2);

    const placeOrderHandler = async (e) => {
        e.preventDefault();

        try {
            const orderData = {
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                totalPrice: totalPrice,
                user: userInfo._id,
            };

            const { data } = await axios.post('https://techshop-gj1f.onrender.com/api/orders', orderData);

            // --- THE FIX: CLEAR THE CART ---
            dispatch(clearCartItems()); 
            // -------------------------------

            alert('Order Placed Successfully!');
            navigate(`/order/${data._id}`);

        } catch (error) {
            console.error("ORDER ERROR:", error);
            const message = error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            alert(`Error: ${message}`);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-3xl font-bold mb-6">Shipping & Payment</h1>
            
            <form onSubmit={placeOrderHandler} className="bg-white p-6 rounded shadow-md border">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Address</label>
                    <input type="text" required className="w-full border p-2 rounded" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">City</label>
                    <input type="text" required className="w-full border p-2 rounded" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
                    <input type="text" required className="w-full border p-2 rounded" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Country</label>
                    <input type="text" required className="w-full border p-2 rounded" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>

                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold mb-4">
                        <span>Total Amount:</span>
                        <span>${totalPrice}</span>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition">
                        PLACE ORDER
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShippingScreen;