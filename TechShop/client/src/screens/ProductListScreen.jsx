import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false); // New state to control reloading
    
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // We define the function INSIDE useEffect to prevent crashes
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('https://techshop-gj1f.onrender.com/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.isAdmin) {
            fetchProducts();
        } else {
            navigate('/login');
        }
    }, [navigate, userInfo, refresh]); // Dependency on 'refresh' reloads the list when it changes

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`https://techshop-gj1f.onrender.com/api/products/${id}`);
                alert('Product Deleted');
                setRefresh(!refresh); // Toggle this to reload the list automatically
            } catch (error) {
                console.error(error);
                alert('Error deleting product');
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Create a new product?')) {
            try {
                await axios.post('https://techshop-gj1f.onrender.com/api/products', { user: userInfo._id });
                alert('Product Created! Click Edit to add details.');
                setRefresh(!refresh); // Toggle this to reload the list automatically
            } catch (error) {
                console.error(error);
                alert('Error creating product');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <button onClick={createProductHandler} className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
                    <FaPlus /> Create Product
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">NAME</th>
                                <th className="py-3 px-4 text-left">PRICE</th>
                                <th className="py-3 px-4 text-left">CATEGORY</th>
                                <th className="py-3 px-4 text-left">BRAND</th>
                                <th className="py-3 px-4 text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-mono text-gray-500">{product._id}</td>
                                    <td className="py-3 px-4 font-bold">{product.name}</td>
                                    <td className="py-3 px-4">${product.price}</td>
                                    <td className="py-3 px-4">{product.category}</td>
                                    <td className="py-3 px-4">{product.brand}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-4">
                                            <Link to={`/admin/product/${product._id}/edit`} className="text-blue-500 hover:text-blue-700">
                                                <FaEdit size={20} />
                                            </Link>
                                            <button onClick={() => deleteHandler(product._id)} className="text-red-500 hover:text-red-700">
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
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

export default ProductListScreen;