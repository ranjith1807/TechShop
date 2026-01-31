import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const UserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Security Check: If not admin, kick them out
        if (userInfo && userInfo.isAdmin) {
            const fetchUsers = async () => {
                try {
                    const { data } = await axios.get('http://localhost:5000/api/users');
                    setUsers(data);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            };
            fetchUsers();
        } else {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">NAME</th>
                                <th className="py-3 px-4 text-left">EMAIL</th>
                                <th className="py-3 px-4 text-center">ADMIN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-mono text-gray-500">{user._id}</td>
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4"><a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a></td>
                                    <td className="py-3 px-4 text-center">
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500 mx-auto" />
                                        ) : (
                                            <FaTimes className="text-red-500 mx-auto" />
                                        )}
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

export default UserListScreen;