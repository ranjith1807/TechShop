import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaShoppingCart, FaUser, FaTrash, FaUsers, FaBoxOpen, FaClipboardList, FaSearch, FaStar, FaEnvelope } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';

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
    <header className="bg-gray-900/90 backdrop-blur-md text-white p-4 shadow-md sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tighter hover:scale-105 transition-transform">
            TechShop
        </Link>
        
        <form onSubmit={submitSearchHandler} className="flex flex-grow max-w-md mx-4 relative group">
            <input 
                type="text" 
                name="q" 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Search Products..." 
                className="w-full p-2 pl-4 pr-10 rounded-full text-black bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition text-white flex items-center justify-center w-8 h-8">
                <FaSearch size={14} />
            </button>
        </form>

        <nav className="flex gap-6 items-center">
          {userInfo && userInfo.isAdmin && (
             <div className="hidden md:flex gap-4 border-r border-gray-700 pr-4">
                <Link to="/admin/userlist" className="hover:text-emerald-400 flex items-center gap-1 transition-colors"><FaUsers /> Users</Link>
                <Link to="/admin/productlist" className="hover:text-emerald-400 flex items-center gap-1 transition-colors"><FaBoxOpen /> Products</Link>
                <Link to="/admin/orderlist" className="hover:text-emerald-400 flex items-center gap-1 transition-colors"><FaClipboardList /> Orders</Link>
                <Link to="/admin/contactlist" className="hover:text-emerald-400 flex items-center gap-1 transition-colors"><FaEnvelope /> Support</Link>
             </div>
          )}
          
          <Link to="/contact" className="flex items-center gap-2 hover:text-blue-400 transition font-medium hidden sm:flex">
             <FaEnvelope size={18} /> Contact Us
          </Link>
          
          <Link to="/cart" className="flex items-center gap-2 hover:text-blue-400 transition group relative">
            <div className="relative">
              <FaShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-900 font-bold">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-medium">Cart</span>
          </Link>
          
          {userInfo ? (
            <div className="flex items-center gap-3 bg-gray-800/50 rounded-full pl-4 pr-1 py-1 border border-gray-700 hover:border-gray-500 transition-colors">
                <Link to="/profile" className="text-blue-200 hover:text-white font-bold text-sm truncate max-w-[100px]">
                    {userInfo.name.split(' ')[0]}
                </Link>
                <button onClick={logoutHandler} className="text-xs bg-red-600/90 text-white px-3 py-1.5 rounded-full hover:bg-red-500 transition font-semibold shadow-sm">
                    Logout
                </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition shadow hover:shadow-lg font-semibold text-sm">
                <FaUser size={16} /> Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
