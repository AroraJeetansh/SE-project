import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, Square, Users, AlertCircle, CheckCircle, Video } from 'lucide-react';
import WebCamCapture from '../components/WebCamCapture';
import API_BASE_URL from '../config/api';

const AttendanceSession = () => {
    const navigate = useNavigate();
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const startSession = () => {
        setSessionId('SES-' + Math.floor(1000 + Math.random() * 9000));
        setSessionActive(true);
        setMessage('Session is active. Look closely into the webcam to log attendance.');
        setMessageType('info');
    };

    const stopSession = () => {
        setSessionActive(false);
        setMessage('Session has been successfully ended.');
        setMessageType('info');
    };

    const handleCapture = async (imageSrc) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/attendance/mark`, {
                face_image: imageSrc,
                session_id: sessionId
            });
            if (res.data.success) {
                setMessage(res.data.message);
                setMessageType('success');
            } else {
                setMessage(res.data.message || 'Unknown error occurred.');
                setMessageType('error');
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to mark attendance.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <button
                onClick={() => navigate('/faculty')}
                className="group flex items-center gap-3 text-neutral-500 hover:text-neutral-900 transition-colors font-bold text-lg mb-4 px-6 py-3 rounded-2xl hover:bg-neutral-100 border border-transparent w-fit"
            >
                <div className="p-1.5 rounded-xl bg-neutral-200 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </div>
                Back to Dashboard
            </button>

            <div className={`p-8 lg:p-10 rounded-[2rem] shadow-sm border flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative transition-all duration-500 ${sessionActive ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>

                <div className="relative z-10 flex items-center gap-5 w-full md:w-auto">
                    <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center rotate-3 shadow-md ${sessionActive ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100 border-neutral-200'}`}>
                        <Video className={`w-10 h-10 ${sessionActive ? 'text-white' : 'text-neutral-900'}`} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${sessionActive ? 'text-white' : 'text-neutral-900'}`}>
                            Live Attendance
                        </h1>
                        <p className={`mt-2 font-medium text-lg flex items-center gap-2 ${sessionActive ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {sessionActive ? (
                                <><span className="w-3 h-3 rounded-full bg-white animate-pulse inline-block"></span> Active Session: <span className="text-white ml-1">{sessionId}</span></>
                            ) : 'Start a new session to begin recording'}
                        </p>
                    </div>
                </div>
                <div className="relative z-10 w-full md:w-auto">
                    {!sessionActive ? (
                        <button
                            onClick={startSession}
                            className="w-full md:w-auto flex justify-center items-center gap-3 px-8 py-4 bg-neutral-900 text-white font-extrabold text-lg rounded-2xl shadow-md hover:bg-neutral-800 hover:-translate-y-1 transition-all border border-neutral-800"
                        >
                            <Play fill="currentColor" size={20} />
                            Start Session
                        </button>
                    ) : (
                        <button
                            onClick={stopSession}
                            className="w-full md:w-auto flex justify-center items-center gap-3 px-8 py-4 bg-neutral-100 hover:bg-white text-neutral-900 font-extrabold text-lg rounded-2xl shadow-md transition-all hover:-translate-y-1 border border-neutral-200"
                        >
                            <Square fill="currentColor" size={20} />
                            Stop Session
                        </button>
                    )}
                </div>
            </div>

            {sessionActive && (
                <div className="bg-neutral-50 rounded-[2rem] shadow-sm border border-neutral-200 p-8 flex flex-col items-center animate-in zoom-in-95 duration-500">

                    {message && (
                        <div className={`mb-8 w-full max-w-2xl px-6 py-4 rounded-2xl text-base font-bold flex items-center gap-3 shadow-sm border ${messageType === 'error' ? 'bg-neutral-900 text-white border-neutral-800' :
                            messageType === 'success' ? 'bg-white text-neutral-900 border-neutral-200 shadow-md' : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                            }`}>
                            {messageType === 'error' && <AlertCircle size={22} className="shrink-0" />}
                            {messageType === 'success' && <CheckCircle size={22} className="shrink-0 text-neutral-900" />}
                            {messageType === 'info' && <Users size={22} className="shrink-0" />}
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-32 flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-6" />
                            <p className="text-neutral-900 font-extrabold text-xl animate-pulse tracking-wide">Processing Biometrics...</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl bg-neutral-900 p-2 rounded-3xl shadow-lg border border-neutral-800">
                            <WebCamCapture onCapture={handleCapture} buttonText="Scan & Mark Attendance" />
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};
export default AttendanceSession;
