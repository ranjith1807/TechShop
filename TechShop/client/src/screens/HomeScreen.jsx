import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { keyword } = useParams(); 
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/products?keyword=${keyword || ''}&pageNumber=${currentPage}`);
                // If backend supports pagination it returns { products, page, pages }
                if (data.products) {
                    setProducts(data.products);
                    setPage(data.page);
                    setPages(data.pages);
                } else {
                    // Fallback if backend isn't updated yet
                    setProducts(data);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, currentPage]); 

    if(loading) return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div></div>;

    return (
        <div className="container mx-auto p-4 animate-fade-in">
            {!keyword && (
                <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 mb-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Next-Gen Tech Awaits</h2>
                        <p className="text-gray-300 text-lg mb-6">Discover the latest gadgets and accessories to elevate your digital lifestyle. Premium quality, unbeatable prices.</p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">Shop Now</button>
                    </div>
                    <div className="hidden md:block w-1/2 ml-8 relative">
                        {/* Realistic Hero Image */}
                        <div className="w-full h-64 rounded-xl overflow-hidden shadow-2xl relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent z-10"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Premium Tech" 
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">
                    {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
                </h1>
            </div>
            
            {products.length === 0 && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-8 text-center">
                    <p className="text-xl text-blue-800">No products found matching your criteria.</p>
                    <Link to="/" className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">Clear Search</Link>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
                        <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-gray-50 aspect-square">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500" 
                            />
                            {/* Overlay tag */}
                            {product.countInStock === 0 && (
                                <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                                    Sold Out
                                </div>
                            )}
                        </Link>
                        
                        <div className="p-5 flex flex-col flex-grow">
                            <Link to={`/product/${product._id}`}>
                                <h2 className="text-lg font-bold text-gray-800 hover:text-blue-600 line-clamp-2 min-h-[3.5rem]">{product.name}</h2>
                            </Link>
                            
                            <div className="flex items-center gap-1 mt-2 mb-4 text-sm text-gray-500">
                                <span className="flex items-center text-yellow-500 gap-1 font-bold">
                                    {product.rating ? product.rating.toFixed(1) : 0} <FaStar size={12} />
                                </span>
                                <span>({product.numReviews})</span>
                            </div>
                            
                            <div className="mt-auto flex justify-between items-end">
                                 <h3 className="text-2xl font-black text-gray-900">${product.price}</h3>
                                 <Link to={`/product/${product._id}`} className="bg-gray-100 hover:bg-blue-50 text-blue-600 p-2 rounded-lg transition-colors border border-transparent hover:border-blue-200">
                                     View Details
                                 </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    {[...Array(pages).keys()].map(x => (
                        <button 
                            key={x + 1}
                            onClick={() => setCurrentPage(x + 1)}
                            className={`w-10 h-10 rounded-full font-bold transition-all ${
                                currentPage === x + 1 
                                ? 'bg-blue-500 text-white shadow-md scale-110' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
