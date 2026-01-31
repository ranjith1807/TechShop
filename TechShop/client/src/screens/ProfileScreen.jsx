import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const fetchOrders = async () => {
                try {
                    const { data } = await axios.get(`/api/orders/myorders/${userInfo._id}`);
                    setOrders(data);
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [navigate, userInfo]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">My Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left Side: User Details */}
                <div className="md:col-span-1 bg-white p-6 shadow rounded h-fit">
                    <h2 className="text-xl font-bold mb-4">User Info</h2>
                    <p className="mb-2"><strong>Name:</strong> {userInfo?.name}</p>
                    <p className="mb-2"><strong>Email:</strong> {userInfo?.email}</p>
                </div>

                {/* Right Side: Order History */}
                <div className="md:col-span-3">
                    <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <div className="bg-yellow-50 p-4 rounded text-yellow-700">
                            No orders found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-left">ORDER ID</th>
                                        <th className="py-3 px-4 text-left">DATE</th>
                                        <th className="py-3 px-4 text-left">TOTAL</th>
                                        <th className="py-3 px-4 text-left">ITEMS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-mono text-gray-500">{order._id}</td>
                                            <td className="py-3 px-4">{order.createdAt.substring(0, 10)}</td>
                                            <td className="py-3 px-4 font-bold">${order.totalPrice}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {order.orderItems.map(item => item.name).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;