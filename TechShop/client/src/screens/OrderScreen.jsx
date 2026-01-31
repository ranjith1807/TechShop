import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clientId, setClientId] = useState('');

    useEffect(() => {
        const getPayPalClientId = async () => {
            const { data: clientId } = await axios.get('http://localhost:5000/api/config/paypal');
            setClientId(clientId);
        };
        getPayPalClientId();

        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order:", error);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const successPaymentHandler = async (paymentResult) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/pay`, paymentResult);
            alert('Payment Successful');
            window.location.reload(); 
        } catch (error) {
            console.error(error);
            alert('Payment Error');
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!order) return <div className="p-4">Order Not Found</div>;

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Order {order._id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* LEFT SIDE - ORDER INFO */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded shadow border">
                        <h2 className="text-xl font-bold mb-4">Shipping</h2>
                        {/* SAFETY CHECK: Use ?. to prevent crashes */}
                        <p className="mb-2"><strong>Name:</strong> {order.user?.name || "Customer"}</p>
                        <p className="mb-2"><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                        <p className="mb-4">
                            <strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="bg-green-100 text-green-800 p-2 rounded">Delivered</div>
                        ) : (
                            <div className="bg-red-100 text-red-800 p-2 rounded">Not Delivered</div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded shadow border">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <p className="mb-4"><strong>Method:</strong> PayPal</p>
                        {order.isPaid ? (
                            <div className="bg-green-100 text-green-800 p-2 rounded">
                                {/* SAFETY CHECK: Check if paidAt exists before substring */}
                                Paid on {order.paidAt ? order.paidAt.substring(0, 10) : 'Today'}
                            </div>
                        ) : (
                            <div className="bg-red-100 text-red-800 p-2 rounded">Not Paid</div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded shadow border">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-b py-2">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                    <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">{item.name}</Link>
                                </div>
                                <div className="text-gray-600">
                                    {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE - SUMMARY & PAY BUTTON */}
                <div className="bg-white p-6 rounded shadow border h-fit">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <div className="flex justify-between mb-2"><span>Items</span><span>${order.totalPrice}</span></div>
                    <div className="flex justify-between mb-2"><span>Shipping</span><span>$0.00</span></div>
                    <div className="flex justify-between mb-4 font-bold border-t pt-2 text-lg"><span>Total</span><span>${order.totalPrice}</span></div>

                    {!order.isPaid && clientId && (
                        <div className="mt-4">
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
                                        alert("PayPal Error: Check Console");
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;