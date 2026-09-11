import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';

const ResetPasswordScreen = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        
        if (password.length < 8) {
            setMessage('Password must be at least 8 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.put(`/api/users/resetpassword/${token}`, { password });
            dispatch(setCredentials(data));
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
                <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
                {message && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-bold">
                        Password Reset Successful! Redirecting...
                    </div>
                )}
                {!success && (
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Confirm New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordScreen;
