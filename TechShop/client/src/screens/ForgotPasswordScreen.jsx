import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            const { data } = await axios.post('/api/users/forgotpassword', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
                <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    Remember your password? <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
