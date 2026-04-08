import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Calendar, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../config/api';

const StudentDashboard = () => {
    const [records, setRecords] = useState([]);
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/attendance`)
            .then(res => {
                if (res.data.success) {
                    const myRecords = res.data.attendance.filter(r => r.roll_number === user?.username);
                    setRecords(myRecords);
                }
            })
            .catch(console.error);
    }, [user]);

    return (
        <div className="space-y-8 relative z-10 w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-sm border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden relative transition-shadow duration-300">
                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight pb-1">Student Portal</h1>
                    <p className="text-neutral-500 mt-2 font-semibold text-lg">Welcome back, <span className="text-neutral-800">{user?.username}</span>!</p>
                </div>
                <div className="relative z-10 h-20 w-20 lg:h-24 lg:w-24 bg-neutral-900 rounded-[2rem] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 shadow-md">
                    <User className="w-10 h-10 lg:w-12 lg:h-12 text-white" strokeWidth={1.5} />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-200 overflow-hidden transition-shadow duration-300">
                <div className="p-8 lg:px-10 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
                    <div className="p-2.5 bg-neutral-200 text-neutral-900 rounded-xl border border-neutral-300/50"><Calendar size={22} strokeWidth={2.5} /></div>
                    <h2 className="text-2xl font-extrabold text-neutral-900">My Attendance</h2>
                </div>
                <div className="p-8 lg:p-10">
                    {records.length === 0 ? (
                        <div className="text-center py-20 px-4 bg-neutral-50 rounded-[2rem] border border-neutral-200">
                            <p className="text-neutral-700 font-bold text-xl mb-3">No attendance records found.</p>
                            <p className="text-neutral-500 text-base max-w-md mx-auto">Ensure your face is registered by the faculty and wait for the next attendance session.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {records.map((r, index) => (
                                <div key={r.id} className="p-6 rounded-[1.5rem] border border-neutral-200 bg-white flex flex-col gap-2 hover:border-neutral-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest bg-neutral-100 w-fit px-2 py-1 rounded-lg">Date</div>
                                    <div className="text-2xl font-black text-neutral-900">{r.date}</div>
                                    <div className="mt-1 text-sm text-neutral-600 font-semibold font-mono bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">Session {r.session_id}</div>
                                    <div className="mt-5 flex items-center gap-1.5 text-neutral-800 bg-neutral-100 border border-neutral-300 px-4 py-2 rounded-xl w-fit text-sm font-extrabold shadow-sm">
                                        <CheckCircle size={18} strokeWidth={2.5} />
                                        {r.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default StudentDashboard;
