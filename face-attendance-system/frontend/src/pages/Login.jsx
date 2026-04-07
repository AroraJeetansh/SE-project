import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ScanFace, Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/login', { username, password });
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                if (res.data.user.role === 'admin') navigate('/admin');
                else if (res.data.user.role === 'faculty') navigate('/faculty');
                else navigate('/student');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-neutral-200 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-neutral-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <ScanFace className="h-10 w-10 text-white" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Facify Attendance</h2>
                    <p className="mt-2 text-sm text-neutral-500 font-medium">Secure biometric authentication</p>
                </div>

                <form className="mt-8 space-y-6 flex flex-col" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 font-medium relative animate-in fade-in slide-in-from-top-2">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="block w-full pl-12 pr-4 py-3.5 border border-neutral-200 rounded-2xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm bg-neutral-50 focus:bg-white transition-all shadow-sm"
                                placeholder="Username (e.g., admin)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full pl-12 pr-4 py-3.5 border border-neutral-200 rounded-2xl placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm bg-neutral-50 focus:bg-white transition-all shadow-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-4 px-4 rounded-2xl text-white font-extrabold shadow-md transition-all ${loading ? 'bg-neutral-400 cursor-not-allowed' : 'bg-neutral-900 hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-1'}`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Authenticating...
                                </div>
                            ) : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
