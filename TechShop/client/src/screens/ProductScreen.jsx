import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const ProductScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({ reviews: [] });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load product details');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, refresh]);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product }));
        toast.success(`${product.name} added to cart!`);
        navigate('/cart');
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            await axios.post(`/api/products/${id}/reviews`, {
                rating,
                comment,
                user: userInfo
            });
            toast.success('Review Submitted!');
            setComment('');
            setRating(0);
            setRefresh(!refresh);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
    );

    if (!product.name) return <div className="text-center mt-10 text-xl font-bold">Product not found.</div>;

    return (
        <div className="container mx-auto p-4 mt-2 animate-fade-in">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6 transition-colors">
                <FaArrowLeft /> Go Back
            </Link>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="bg-gray-50 rounded-2xl p-8 flex justify-center items-center h-full">
                        <img src={product.image} alt={product.name} className="w-full max-w-md object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex flex-col h-full justify-center">
                        <div className="uppercase tracking-widest text-sm text-blue-500 font-bold mb-2">{product.brand}</div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">
                                <span>{product.rating ? product.rating.toFixed(1) : 0}</span> <FaStar />
                            </div>
                            <span className="text-gray-500 text-sm font-medium">({product.numReviews} verified reviews)</span>
                        </div>
                        
                        <div className="text-4xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-8">
                            ${product.price}
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                            {product.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <div className={`px-6 py-4 rounded-xl flex items-center justify-center font-bold flex-1 border ${product.countInStock > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                            </div>
                            
                            <button 
                                onClick={addToCartHandler} 
                                className="flex-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 hover:shadow-lg transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
                                disabled={product.countInStock === 0}
                            >
                                <FaShoppingCart />
                                {product.countInStock > 0 ? 'Add to Cart' : 'Unavailable'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-black mb-6 text-gray-900">Customer Reviews</h2>
                    
                    {(!product.reviews || product.reviews.length === 0) && (
                        <div className="bg-blue-50/50 border border-blue-100 p-8 text-center rounded-2xl">
                            <p className="text-blue-800 text-lg">No reviews yet. Share your thoughts!</p>
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        {product.reviews?.map((review) => (
                            <div key={review._id} className="bg-white p-6 shadow-sm rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <strong className="block text-gray-900 font-bold">{review.name}</strong>
                                            <span className="text-xs text-gray-500">{review.createdAt?.substring(0, 10)}</span>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 sticky top-24">
                        <h2 className="text-2xl font-black mb-6">Write a Review</h2>
                        {userInfo ? (
                            <form onSubmit={submitReviewHandler} className="flex flex-col gap-5">
                                <div>
                                    <label className="block mb-2 font-bold text-gray-700">Rating</label>
                                    <select 
                                        className="w-full border-gray-300 rounded-xl p-3 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                        value={rating} 
                                        onChange={(e) => setRating(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a rating...</option>
                                        <option value="1">1 - Poor</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="3">3 - Good</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="5">5 - Excellent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-bold text-gray-700">Comment</label>
                                    <textarea 
                                        className="w-full border-gray-300 rounded-xl p-3 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" 
                                        rows="4" 
                                        value={comment} 
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    disabled={reviewLoading} 
                                    type="submit" 
                                    className="bg-gray-900 text-white px-6 py-4 rounded-xl hover:bg-black font-bold transition shadow-md disabled:bg-gray-400 mt-2"
                                >
                                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl text-center">
                                <p className="text-yellow-800 mb-4">You must be logged in to post a review.</p>
                                <Link to="/login" className="inline-block bg-yellow-500 text-white font-bold py-2 px-6 rounded-full hover:bg-yellow-600 transition shadow-sm">
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;
