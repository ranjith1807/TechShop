import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ContactScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    
    const [name, setName] = useState(userInfo ? userInfo.name : '');
    const [email, setEmail] = useState(userInfo ? userInfo.email : '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    
    const [statusMessage, setStatusMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage(null);
        setError(null);
        try {
            await axios.post('/api/contact', { name, email, subject, message });
            setStatusMessage('Your message has been sent successfully! We will get back to you soon.');
            setSubject('');
            setMessage('');
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl mt-10 animate-fade-in">
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                <h1 className="text-3xl font-black mb-6 text-gray-900 text-center">Contact Us</h1>
                <p className="text-gray-600 mb-8 text-center">
                    Have a question or facing an issue? Send us a message and our support team will help you out!
                </p>

                {statusMessage && <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 font-semibold text-center">{statusMessage}</div>}
                {error && <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-6 font-semibold text-center">{error}</div>}

                <form onSubmit={submitHandler} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Subject</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                            placeholder="What is this regarding?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Message</label>
                        <textarea 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition resize-none"
                            placeholder="Describe your issue or question..."
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition mt-4" disabled={loading}>
                        {loading ? 'Sending Message...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactScreen;
