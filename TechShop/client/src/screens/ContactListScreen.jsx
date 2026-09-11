import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaTrash, FaCheck, FaEnvelope } from 'react-icons/fa';

const ContactListScreen = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                const { data } = await axios.get('/api/contact', config);
                setMessages(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.isAdmin) {
            fetchMessages();
        } else {
            navigate('/login');
        }
    }, [navigate, userInfo, refresh]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                await axios.delete(`/api/contact/${id}`, config);
                setRefresh(!refresh);
            } catch (error) {
                console.error(error);
                alert('Error deleting message');
            }
        }
    };

    const markReadHandler = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            await axios.put(`/api/contact/${id}/read`, {}, config);
            setRefresh(!refresh);
        } catch (error) {
            console.error(error);
            alert('Error marking as read');
        }
    };

    return (
        <div className="container mx-auto p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <FaEnvelope className="text-blue-500" /> Support Messages
                </h1>
            </div>

            {loading ? <div className="text-center mt-10">Loading...</div> : (
                <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-100">
                    {messages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No support messages found.</div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">User</th>
                                    <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Subject</th>
                                    <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Message</th>
                                    <th className="py-4 px-6 text-center font-bold text-sm uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-center font-bold text-sm uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {messages.map((msg) => (
                                    <tr key={msg._id} className={`hover:bg-gray-50 transition ${!msg.isRead ? 'bg-blue-50/30' : ''}`}>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                            {msg.createdAt.substring(0, 10)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-gray-900">{msg.name}</div>
                                            <div className="text-sm text-gray-500">{msg.email}</div>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-gray-800">
                                            {msg.subject}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={msg.message}>
                                            {msg.message}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {msg.isRead ? (
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Read
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    New
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center gap-3">
                                                {!msg.isRead && (
                                                    <button onClick={() => markReadHandler(msg._id)} className="text-green-500 hover:text-green-700 hover:scale-110 transition" title="Mark as Read">
                                                        <FaCheck size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => deleteHandler(msg._id)} className="text-red-500 hover:text-red-700 hover:scale-110 transition" title="Delete">
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactListScreen;
