import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const OrderListScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false); // <--- Control reloading
    
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Defined INSIDE useEffect to prevent crashes
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.isAdmin) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [navigate, userInfo, refresh]); // <--- Re-runs when 'refresh' changes

    const deliverHandler = async (id) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                await axios.put(`http://localhost:5000/api/orders/${id}/deliver`);
                setRefresh(!refresh); // <--- Trigger reload to show green checkmark
                alert('Order Delivered!');
            } catch (error) {
                console.error(error);
                alert('Error updating order');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            {loading ? <p>Loading...</p> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">USER</th>
                                <th className="py-3 px-4 text-left">DATE</th>
                                <th className="py-3 px-4 text-left">TOTAL</th>
                                <th className="py-3 px-4 text-center">DELIVERED</th>
                                <th className="py-3 px-4 text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-mono text-gray-500">{order._id}</td>
                                    <td className="py-3 px-4 font-bold">
                                        {/* Crash Proof User Check */}
                                        {order.user ? order.user.name : 'Deleted User'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {/* Crash Proof Date */}
                                        {order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4">${order.totalPrice}</td>
                                    <td className="py-3 px-4 text-center">
                                        {order.isDelivered ? (
                                            <p className="text-green-600 font-bold">
                                                {order.deliveredAt ? String(order.deliveredAt).substring(0, 10) : 'Delivered'}
                                            </p>
                                        ) : (
                                            <FaTimes className="text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {!order.isDelivered && (
                                            <button 
                                                onClick={() => deliverHandler(order._id)}
                                                className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderListScreen;