import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        } else {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${productId}`);
                    setName(data.name);
                    setPrice(data.price);
                    setImage(data.image);
                    setBrand(data.brand);
                    setCategory(data.category);
                    setCountInStock(data.countInStock);
                    setDescription(data.description);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchProduct();
        }
    }, [productId, navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/products/${productId}`, {
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            });
            alert('Product Updated Successfully');
            navigate('/admin/productlist');
        } catch (error) {
            console.error(error);
            alert('Error updating product');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-xl">
            <Link to="/admin/productlist" className="text-gray-600 hover:text-blue-500 mb-4 inline-block">
                &larr; Go Back
            </Link>
            
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
            
            <form onSubmit={submitHandler} className="bg-white p-8 shadow-md rounded border space-y-4">
                
                {/* Name */}
                <div>
                    <label className="block mb-1 font-bold">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
                        className="w-full border p-2 rounded" />
                </div>

                {/* Price */}
                <div>
                    <label className="block mb-1 font-bold">Price</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} 
                        className="w-full border p-2 rounded" />
                </div>

                {/* Image URL */}
                <div>
                    <label className="block mb-1 font-bold">Image URL</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} 
                        className="w-full border p-2 rounded" />
                    <p className="text-xs text-gray-500 mt-1">Example: /images/phone.jpg or https://...</p>
                </div>

                {/* Brand */}
                <div>
                    <label className="block mb-1 font-bold">Brand</label>
                    <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} 
                        className="w-full border p-2 rounded" />
                </div>

                {/* Category */}
                <div>
                    <label className="block mb-1 font-bold">Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} 
                        className="w-full border p-2 rounded" />
                </div>

                {/* Count In Stock */}
                <div>
                    <label className="block mb-1 font-bold">Count In Stock</label>
                    <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} 
                        className="w-full border p-2 rounded" />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 font-bold">Description</label>
                    <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} 
                        className="w-full border p-2 rounded"></textarea>
                </div>

                <button type="submit" className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition">
                    UPDATE PRODUCT
                </button>
            </form>
        </div>
    );
};

export default ProductEditScreen;