import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBox, FaCreditCard, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clientId, setClientId] = useState('');

    useEffect(() => {
        const getPayPalClientId = async () => {
            try {
                const { data: clientId } = await axios.get('/api/config/paypal');
                setClientId(clientId);
            } catch (err) {
                console.error("Failed to load PayPal Client ID");
            }
        };
        getPayPalClientId();

        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${orderId}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching order details");
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const successPaymentHandler = async (paymentResult) => {
        try {
            await axios.put(`/api/orders/${orderId}/pay`, paymentResult);
            toast.success('Payment Successful!');
            setTimeout(() => {
                window.location.reload(); 
            }, 1500);
        } catch (error) {
            toast.error('Payment Error occurred. Please try again.');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
    );
    
    if (!order) return <div className="text-center mt-20 text-2xl font-bold text-gray-500">Order Not Found</div>;

    return (
        <div className="container mx-auto p-4 max-w-7xl animate-fade-in">
            <h1 className="text-3xl font-black mb-2 text-gray-900">Order Details</h1>
            <p className="text-gray-500 mb-8 font-mono bg-gray-100 inline-block px-3 py-1 rounded">ID: {order._id}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT SIDE - ORDER INFO */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Shipping Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <FaTruck size={100} />
                        </div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><FaTruck /></div>
                            Shipping Info
                        </h2>
                        
                        <div className="space-y-3 text-lg z-10 relative">
                            <p><strong>Name:</strong> {order.user?.name || "Customer"}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${order.user?.email}`} className="text-blue-500 hover:underline">{order.user?.email || "N/A"}</a></p>
                            <p>
                                <strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                            </p>
                        </div>
                        
                        <div className="mt-6">
                            {order.isDelivered ? (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                                    <FaCheckCircle /> Delivered on {order.deliveredAt?.substring(0, 10)}
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                                    <FaTimesCircle /> Not Delivered
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <FaCreditCard size={100} />
                        </div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="bg-purple-100 p-3 rounded-full text-purple-600"><FaCreditCard /></div>
                            Payment Method
                        </h2>
                        
                        <p className="text-lg mb-6 z-10 relative"><strong>Method:</strong> PayPal</p>
                        
                        <div>
                            {order.isPaid ? (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                                    <FaCheckCircle /> Paid on {order.paidAt ? order.paidAt.substring(0, 10) : 'Today'}
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                                    <FaTimesCircle /> Not Paid
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="bg-orange-100 p-3 rounded-full text-orange-600"><FaBox /></div>
                            Order Items
                        </h2>
                        
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mix-blend-multiply bg-white p-1 rounded-xl shadow-sm" />
                                        <Link to={`/product/${item.product}`} className="font-bold text-gray-800 hover:text-blue-600 transition line-clamp-2">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div className="text-gray-700 font-medium whitespace-nowrap bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                        {item.qty} x ${item.price} = <span className="font-black text-gray-900 ml-1">${(item.qty * item.price).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - SUMMARY & PAY BUTTON */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                        <h2 className="text-2xl font-black mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                        
                        <div className="space-y-4 text-lg font-medium text-gray-600 mb-6">
                            <div className="flex justify-between"><span>Items</span><span>${order.totalPrice}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span className="text-emerald-600 font-bold">Free</span></div>
                            <div className="flex justify-between"><span>Tax</span><span>$0.00</span></div>
                        </div>
                        
                        <div className="flex justify-between text-2xl font-black text-gray-900 mb-8 pt-6 border-t border-gray-100">
                            <span>Total</span>
                            <span>${order.totalPrice}</span>
                        </div>

                        {!order.isPaid && (
                            <div className="mt-4">
                                {clientId ? (
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                                        <PayPalScriptProvider options={{ "client-id": clientId }}>
                                            <PayPalButtons 
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [{
                                                            amount: { value: order.totalPrice.toString() } 
                                                        }]
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        successPaymentHandler(details);
                                                    });
                                                }}
                                                onError={(err) => {
                                                    console.error("PayPal Error:", err);
                                                    toast.error("PayPal failed to load. Please try again.");
                                                }}
                                                style={{ layout: "vertical", shape: "rect", color: "blue" }}
                                            />
                                        </PayPalScriptProvider>
                                    </div>
                                ) : (
                                    <div className="animate-pulse bg-gray-200 h-12 rounded-xl w-full"></div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;