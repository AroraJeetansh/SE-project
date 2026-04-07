import { useState, useEffect } from 'react';
import { Plus, Users, UserPlus, Activity, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_users: '...', total_students: '...', attendance_records: '...' });
    const [formData, setFormData] = useState({ username: '', password: '', role: 'faculty' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats');
            if (res.data.success) {
                setStats(res.data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch stats');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await axios.post('http://localhost:5000/api/users/add', formData);
            if (res.data.success) {
                setMessage({ text: res.data.message, type: 'success' });
                setFormData({ username: '', password: '', role: 'faculty' });
                fetchStats();
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Failed to add user', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 relative z-10 w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight pb-1">Admin Portal</h1>
                    <p className="text-neutral-500 mt-2 font-medium text-lg">Manage system users, roles, and metrics</p>
                </div>
                <div className="relative z-10 h-20 w-20 lg:h-24 lg:w-24 bg-neutral-900 rounded-[2rem] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 shadow-md">
                    <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-white" strokeWidth={1.5} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stats Panel */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-200 flex flex-col hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-neutral-900">
                        <div className="p-3 bg-neutral-100 text-neutral-900 rounded-2xl"><Activity size={24} strokeWidth={2.5} /></div>
                        System Pulse
                    </h2>
                    <div className="space-y-5 flex-grow flex flex-col justify-center">
                        <div className="group bg-neutral-50 px-6 py-5 rounded-2xl flex justify-between items-center border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors">
                            <span className="font-bold text-neutral-600 flex items-center gap-3"><Users size={22} className="text-neutral-900 group-hover:scale-110 transition-transform" /> Total Users</span>
                            <span className="text-4xl font-black text-neutral-900 tracking-tight">{stats.total_users}</span>
                        </div>
                        <div className="group bg-neutral-50 px-6 py-5 rounded-2xl flex justify-between items-center border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors">
                            <span className="font-bold text-neutral-600 flex items-center gap-3"><UserPlus size={22} className="text-neutral-900 group-hover:scale-110 transition-transform" /> Registered Students</span>
                            <span className="text-4xl font-black text-neutral-900 tracking-tight">{stats.total_students}</span>
                        </div>
                        <div className="group bg-neutral-50 px-6 py-5 rounded-2xl flex justify-between items-center border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors">
                            <span className="font-bold text-neutral-600 flex items-center gap-3"><Activity size={22} className="text-neutral-900 group-hover:scale-110 transition-transform" /> Attendance Records</span>
                            <span className="text-4xl font-black text-neutral-900 tracking-tight">{stats.attendance_records}</span>
                        </div>
                    </div>
                </div>

                {/* Add User Panel */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-neutral-900">
                        <div className="p-3 bg-neutral-100 text-neutral-900 rounded-2xl"><Plus size={24} strokeWidth={2.5} /></div>
                        Register Staff
                    </h2>

                    {message.text && (
                        <div className={`mb-6 px-5 py-4 rounded-2xl text-sm font-bold border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-neutral-100 text-neutral-900 border-neutral-300' : 'bg-red-50 text-red-600 border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleAddUser} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Username</label>
                            <input type="text" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 focus:bg-white transition-all font-semibold text-neutral-900 placeholder-neutral-400 shadow-sm outline-none" placeholder="e.g. jdoe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Password</label>
                            <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 focus:bg-white transition-all font-semibold text-neutral-900 placeholder-neutral-400 shadow-sm outline-none" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Role</label>
                            <div className="relative">
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 focus:bg-white transition-all font-semibold text-neutral-900 appearance-none shadow-sm cursor-pointer outline-none">
                                    <option value="faculty">Faculty Member</option>
                                    <option value="admin">Administrator</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-neutral-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full mt-4 py-4 px-6 bg-neutral-900 text-white font-extrabold text-lg rounded-2xl shadow-md hover:bg-neutral-800 hover:-translate-y-1 transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed border border-transparent">
                            {loading ? (
                                <><div className="w-6 h-6 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div> Processing...</>
                            ) : (
                                <><Plus size={24} strokeWidth={2.5} /> Create Account</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
