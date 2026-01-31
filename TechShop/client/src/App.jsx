import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaUser, FaTrash, FaUsers, FaBoxOpen, FaClipboardList, FaSearch, FaStar } from 'react-icons/fa';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { addToCart, removeFromCart } from './slices/cartSlice';
import LoginScreen from './screens/LoginScreen';
import { logout } from './slices/authSlice';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserListScreen from './screens/UserListScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderScreen from './screens/OrderScreen'; // <--- NEW IMPORT
// --- 1. HEADER COMPONENT ---
const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const logoutHandler = () => {
      dispatch(logout());
  };

  const submitSearchHandler = (e) => {
      e.preventDefault();
      if (keyword.trim()) {
          navigate(`/search/${keyword}`);
      } else {
          navigate('/');
      }
  };
  
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-blue-400 tracking-tighter">TechShop</Link>
        
        <form onSubmit={submitSearchHandler} className="flex flex-grow max-w-md mx-4">
            <input 
                type="text" 
                name="q" 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Search Products..." 
                className="w-full p-2 rounded-l text-black focus:outline-none"
            />
            <button type="submit" className="bg-blue-500 p-2 rounded-r hover:bg-blue-600 transition">
                <FaSearch />
            </button>
        </form>

        <nav className="flex gap-6 items-center">
          {userInfo && userInfo.isAdmin && (
             <div className="hidden md:flex gap-4">
                <Link to="/admin/userlist" className="hover:text-green-400 flex items-center gap-1"><FaUsers /> Users</Link>
                <Link to="/admin/productlist" className="hover:text-green-400 flex items-center gap-1"><FaBoxOpen /> Products</Link>
                <Link to="/admin/orderlist" className="hover:text-green-400 flex items-center gap-1"><FaClipboardList /> Orders</Link>
             </div>
          )}
          
          <Link to="/cart" className="flex items-center gap-2 hover:text-blue-400 transition">
            <div className="relative">
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
            Cart
          </Link>
          
          {userInfo ? (
            <div className="flex items-center gap-4">
                <Link to="/profile" className="text-blue-200 hover:text-white font-bold text-sm">
                    {userInfo.name.split(' ')[0]}
                </Link>
                <button onClick={logoutHandler} className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 transition"><FaUser size={18} /> Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

// --- 2. HOME SCREEN ---
const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { keyword } = useParams(); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`/api/products?keyword=${keyword || ''}`);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword]); 

    if(loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-l-4 border-blue-500 pl-4">
                {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
            </h1>
            
            {products.length === 0 && <p className="text-xl text-gray-500">No products found.</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group">
                        <Link to={`/product/${product._id}`}>
                            <div className="h-48 overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                            </div>
                        </Link>
                        <div className="p-5">
                            <Link to={`/product/${product._id}`}>
                                <h2 className="text-lg font-bold text-gray-800 hover:text-blue-600 truncate">{product.name}</h2>
                            </Link>
                            <div className="flex justify-between items-center mt-4">
                                 <h3 className="text-xl font-extrabold text-gray-900">${product.price}</h3>
                                 <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                                    {product.rating ? product.rating.toFixed(1) : 0} ★
                                 </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 3. PRODUCT SCREEN (FIXED TO PREVENT WHITE SCREEN CRASH) ---
const ProductScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    // FIX 1: Initialize reviews as an empty array to avoid undefined errors
    const [product, setProduct] = useState({ reviews: [] });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        axios.get(`/api/products/${id}`).then(res => setProduct(res.data));
    }, [id, refresh]);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product }));
        navigate('/cart');
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`/api/products/${id}/reviews`, {
                rating,
                comment,
                user: userInfo
            });
            alert('Review Submitted!');
            setComment('');
            setRating(0);
            setRefresh(!refresh);
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting review');
        } finally {
            setLoading(false);
        }
    };

    if(!product.name) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="container mx-auto p-4 mt-6">
            <Link to="/" className="text-gray-600 hover:text-blue-500 mb-4 inline-block">&larr; Go Back</Link>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
                <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-4 text-yellow-500">
                         <span className="font-bold text-xl">{product.rating ? product.rating.toFixed(1) : 0}</span> <FaStar />
                         <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
                    </div>
                    <p className="text-gray-500 mb-6">Brand: {product.brand}</p>
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex justify-between mb-4 border-b pb-2">
                            <span className="font-bold">Price:</span>
                            <span className="text-xl">${product.price}</span>
                        </div>
                        <div className="flex justify-between mb-6 border-b pb-2">
                            <span className="font-bold">Status:</span>
                            <span className={product.countInStock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <button 
                            onClick={addToCartHandler} 
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400" 
                            disabled={product.countInStock === 0}
                        >
                            {product.countInStock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                        </button>
                    </div>
                    <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                    
                    {/* FIX 2: Check if reviews exist before accessing length */}
                    {(!product.reviews || product.reviews.length === 0) && (
                        <div className="bg-blue-50 p-4 text-blue-700 rounded">No Reviews yet. Be the first!</div>
                    )}
                    
                    <div className="space-y-4">
                        {/* FIX 3: Add '?' to ensure we don't map over undefined */}
                        {product.reviews?.map((review) => (
                            <div key={review._id} className="bg-white p-4 shadow rounded border-l-4 border-blue-500">
                                <div className="flex justify-between items-center mb-2">
                                    <strong className="text-lg">{review.name}</strong>
                                    <span className="text-yellow-500 flex items-center gap-1 font-bold">{review.rating} <FaStar /></span>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">{review.createdAt?.substring(0, 10)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded shadow-inner h-fit">
                    <h2 className="text-xl font-bold mb-4">Write a Customer Review</h2>
                    {userInfo ? (
                        <form onSubmit={submitReviewHandler}>
                            <div className="mb-4">
                                <label className="block mb-2 font-bold">Rating</label>
                                <select className="w-full border p-2 rounded" value={rating} onChange={(e) => setRating(e.target.value)}>
                                    <option value="">Select...</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-bold">Comment</label>
                                <textarea className="w-full border p-2 rounded" rows="3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                            </div>
                            <button disabled={loading} type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full font-bold">
                                {loading ? 'Submitting...' : 'SUBMIT REVIEW'}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-yellow-100 p-4 rounded text-yellow-800">
                            Please <Link to="/login" className="font-bold underline">sign in</Link> to write a review.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 4. CART SCREEN ---
const CartScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (!userInfo) {
            navigate('/login');
        } else {
            navigate('/shipping');
        }
    };

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
                            ${cartItems.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2)}
                        </p>
                        <button onClick={checkoutHandler} className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition font-bold">
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 5. MAIN APP COMPONENT ---
const App = () => {
  return (
    <Provider store={store}>
        <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow py-6">
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/search/:keyword" element={<HomeScreen />} />
                    
                    <Route path="/product/:id" element={<ProductScreen />} />
                    <Route path="/cart" element={<CartScreen />} />
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/register" element={<RegisterScreen />} />
                    <Route path="/shipping" element={<ShippingScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/userlist" element={<UserListScreen />} />
                    <Route path="/admin/productlist" element={<ProductListScreen />} />
                    <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
                    <Route path="/admin/orderlist" element={<OrderListScreen />} />
                    <Route path="/order/:id" element={<OrderScreen />} />
                </Routes>
            </main>
            <footer className="bg-gray-900 text-white text-center p-6 mt-10">
                <p>Copyright &copy; TechShop 2026</p>
            </footer>
        </div>
        </Router>
    </Provider>
  );
};

export default App;