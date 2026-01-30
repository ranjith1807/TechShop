import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { removeFromCart } from '../slices/cartSlice'; // Make sure this path matches your file name (cart or cartSlice)

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    // --- THIS WAS MISSING ---
   const checkoutHandler = () => {
        console.log("Button Clicked!"); // 1. Check Console
        console.log("User Info:", userInfo); // 2. Check User Status

        if (!userInfo) {
            alert("User is LOGGED OUT. Redirecting to Login...");
            navigate('/login');
        } else {
            alert("User is LOGGED IN. Redirecting to Shipping...");
            navigate('/shipping');
        }
    };
    // ------------------------

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="bg-blue-50 p-4 rounded text-blue-700">
                    Your cart is empty. <Link to="/" className="font-bold underline">Go Back</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded shadow">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                <Link to={`/product/${item._id}`} className="font-semibold text-lg hover:text-blue-600 flex-1 ml-4">{item.name}</Link>
                                <p className="font-bold text-gray-700 mr-4">${item.price}</p>
                                <button onClick={() => removeFromCartHandler(item._id)} className="text-red-500 hover:text-red-700">
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-6 rounded shadow h-fit">
                        <h2 className="text-xl font-bold mb-4">Subtotal ({cartItems.length}) items</h2>
                        <p className="text-2xl font-bold mb-6">
                            {/* Fixed the calculation to ensure it treats prices as numbers */}
                            ${cartItems.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2)}
                        </p>
                        
                        {/* --- THIS BUTTON NOW WORKS --- */}
                        <button 
                            onClick={checkoutHandler}
                            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
                        >
                            PROCEED TO CHECKOUT
                        </button>
                        {/* ----------------------------- */}
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;