import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { removeFromCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const removeFromCartHandler = (id, name) => {
        dispatch(removeFromCart(id));
        toast.info(`${name} removed from cart`);
    };

    const checkoutHandler = () => {
        if (!userInfo) {
            toast.warn("Please log in to proceed to checkout");
            navigate('/login');
        } else {
            navigate('/shipping');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl animate-fade-in">
            <h1 className="text-4xl font-black mb-8 text-gray-900 border-b pb-4">Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-3xl text-center shadow-sm">
                    <p className="text-2xl text-blue-800 mb-6 font-medium">Your cart feels empty.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition shadow hover:shadow-lg hover:-translate-y-1">
                        <FaArrowLeft /> Keep Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-6 transition hover:shadow-md">
                                <img src={item.image} alt={item.name} className="w-32 h-32 object-contain bg-gray-50 rounded-xl p-2 mix-blend-multiply" />
                                
                                <div className="flex-1 text-center sm:text-left">
                                    <Link to={`/product/${item._id}`} className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                                        {item.name}
                                    </Link>
                                    <div className="text-gray-500 mt-2 font-medium">Qty: 1</div>
                                </div>
                                
                                <div className="text-2xl font-black text-gray-900">
                                    ${item.price}
                                </div>
                                
                                <button 
                                    onClick={() => removeFromCartHandler(item._id, item.name)} 
                                    className="bg-red-50 text-red-500 p-4 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-100 shadow-sm"
                                    title="Remove item"
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-2xl font-black mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                            
                            <div className="flex justify-between text-gray-600 mb-4 font-medium">
                                <span>Items ({cartItems.length})</span>
                                <span>${cartItems.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between text-gray-600 mb-6 font-medium">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">Free</span>
                            </div>
                            
                            <div className="flex justify-between text-2xl font-black text-gray-900 mb-8 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span>${cartItems.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2)}</span>
                            </div>
                            
                            <button 
                                onClick={checkoutHandler}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-xl font-bold text-lg hover:-translate-y-1"
                            >
                                Proceed to Checkout
                            </button>
                            
                            <div className="mt-6 text-center text-sm text-gray-500 font-medium">
                                Secure checkout processed by PayPal
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;