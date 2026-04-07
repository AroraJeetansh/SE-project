import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, UserPlus, FileText, CheckCircle, GraduationCap } from 'lucide-react';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/attendance')
            .then(res => {
                if (res.data.success) {
                    setAttendanceRecords(res.data.attendance);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <div className="space-y-8 relative z-10 w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative transition-shadow duration-300">
                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight pb-1">Faculty Dashboard</h1>
                    <p className="text-neutral-500 mt-2 font-medium text-lg">Manage class operations and monitor attendance</p>
                </div>
                <div className="relative z-10 h-20 w-20 lg:h-24 lg:w-24 bg-neutral-900 rounded-[2rem] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 shadow-md">
                    <GraduationCap className="w-10 h-10 lg:w-12 lg:h-12 text-white" strokeWidth={1.5} />
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                    onClick={() => navigate('/faculty/attendance')}
                    className="group bg-neutral-900 rounded-[2rem] p-8 cursor-pointer hover:bg-neutral-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-center min-h-[220px] focus:outline-none focus:ring-4 focus:ring-neutral-500/30 border border-neutral-800"
                    tabIndex="0"
                >
                    <div className="absolute -bottom-8 -right-8 p-8 opacity-10">
                        <Camera size={140} className="text-white transform group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white/20 transition-colors border border-white/10">
                            <Camera size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-3">Launch Session</h2>
                        <p className="text-neutral-300 font-medium text-lg leading-snug">Open webcam interface to automatically log student attendance</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/faculty/register')}
                    className="group bg-white rounded-[2rem] p-8 cursor-pointer border border-neutral-200 hover:border-neutral-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-center min-h-[220px] focus:outline-none focus:ring-4 focus:ring-neutral-200"
                    tabIndex="0"
                >
                    <div className="absolute -bottom-8 -right-8 p-8 opacity-5">
                        <UserPlus size={140} className="text-neutral-900 transform group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-200 group-hover:bg-neutral-200 transition-colors">
                            <UserPlus size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-neutral-900 mb-3">Register Student</h2>
                        <p className="text-neutral-500 font-medium text-lg leading-snug">Add a new student profile and securely capture facial biometrics</p>
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-200 overflow-hidden transition-shadow duration-300">
                <div className="px-8 py-6 border-b border-neutral-100 bg-neutral-50">
                    <h2 className="text-2xl font-extrabold text-neutral-900 flex items-center gap-3">
                        <div className="p-2.5 bg-neutral-200 text-neutral-900 rounded-xl"><FileText size={22} strokeWidth={2.5} /></div>
                        Recent Attendance Logs
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 text-xs font-bold uppercase tracking-widest border-b border-neutral-100">
                                <th className="px-8 py-5">Student Name</th>
                                <th className="px-8 py-5">Roll Number</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Session</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                            {attendanceRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-neutral-400 font-semibold text-lg border-none">No recent records. Start a session to log attendance.</td>
                                </tr>
                            ) : attendanceRecords.map((record, index) => (
                                <tr key={record.id} className="hover:bg-neutral-50 transition-colors animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                                    <td className="px-8 py-5 font-bold text-neutral-900">{record.name}</td>
                                    <td className="px-8 py-5 text-neutral-600 font-medium">{record.roll_number}</td>
                                    <td className="px-8 py-5 text-neutral-600 font-medium">{record.date}</td>
                                    <td className="px-8 py-5 text-neutral-400 font-mono text-sm">{record.session_id}</td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                                            <CheckCircle size={15} strokeWidth={2.5} />
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default FacultyDashboard;
