import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, ArrowRight, User as UserIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import WebCamCapture from '../components/WebCamCapture';
import API_BASE_URL from '../config/api';

const Registration = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', roll_number: '' });
    const [faceImage, setFaceImage] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleNext = (e) => {
        e.preventDefault();
        setMessage('');
        if (formData.name && formData.roll_number) setStep(2);
        else setMessage('Please fill in all required fields.');
    };

    const handleCapture = (imageSrc) => {
        setFaceImage(imageSrc);
        setStep(3);
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/students/register`, {
                ...formData,
                face_image: faceImage
            });
            if (res.data.success) {
                setStep(4);
                setMessage(res.data.message);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed');
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <button
                onClick={() => navigate('/faculty')}
                className="group flex items-center gap-3 text-neutral-500 hover:text-neutral-900 transition-colors font-bold text-lg mb-8 px-6 py-3 rounded-[1rem] hover:bg-neutral-100 border border-transparent w-fit"
            >
                <div className="p-1.5 rounded-xl bg-neutral-200 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </div>
                Back to Dashboard
            </button>

            <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-200 overflow-hidden relative">

                <div className="p-10 border-b border-neutral-100 flex items-center gap-5 bg-neutral-50">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-900 flex items-center justify-center rotate-3 shadow-md">
                        <UserIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Student Registration</h1>
                        <p className="mt-2 text-neutral-500 font-medium">Add a new student profile and biometric data</p>
                    </div>
                </div>

                <div className="p-10">
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-100 -translate-y-1/2 -z-10 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-neutral-900 -translate-y-1/2 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step > 3 ? 3 : Math.max(1, step)) - 1) * 50}%` }}></div>

                        {[1, 2, 3].map((num) => (
                            <div key={num} className={`flex flex-col items-center gap-3 bg-white px-2 transition-all duration-500 ${step >= num ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-4 ${step >= num ? 'bg-neutral-900 border-neutral-200 text-white shadow-md' : 'bg-white border-neutral-200 text-neutral-400'}`}>
                                    {step > num ? <CheckCircle size={20} /> : num}
                                </div>
                                <span className={`text-sm font-bold uppercase tracking-widest ${step >= num ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                    {num === 1 ? 'Details' : num === 2 ? 'Biometrics' : 'Confirm'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {message && step !== 4 && (
                        <div className="mb-8 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 bg-red-50 text-red-600 border border-red-200 shadow-sm">
                            <AlertCircle size={20} className="shrink-0" />
                            {message}
                        </div>
                    )}

                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        {step === 1 && (
                            <form onSubmit={handleNext} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 focus:bg-white transition-all font-semibold text-neutral-900 shadow-sm outline-none" placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Roll Number</label>
                                    <input type="text" required value={formData.roll_number} onChange={e => setFormData({ ...formData, roll_number: e.target.value })} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 focus:bg-white transition-all font-semibold text-neutral-900 shadow-sm outline-none" placeholder="e.g. CS2024001" />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white font-extrabold text-lg rounded-2xl shadow-md hover:bg-neutral-800 hover:-translate-y-1 transition-all">
                                        Next Step <ArrowRight size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col items-center">
                                <div className="w-full max-w-lg bg-neutral-900 rounded-[2rem] p-3 shadow-lg border border-neutral-700">
                                    <WebCamCapture onCapture={handleCapture} buttonText="Capture Face & Proceed" />
                                </div>
                                <button onClick={() => setStep(1)} className="mt-8 text-neutral-500 font-bold hover:text-neutral-900 flex items-center gap-2 transition-colors">
                                    <ArrowLeft size={18} /> Modify Details
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col items-center space-y-8">
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-extrabold text-neutral-900">Verify Information</h3>
                                    <p className="text-neutral-500 font-medium">Please confirm the details below.</p>
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-8 bg-neutral-50 p-8 rounded-3xl w-full border border-neutral-200 shadow-sm">
                                    <div className="w-48 h-48 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-md rotate-2 relative">
                                        {faceImage ? <img src={faceImage} alt="Captured" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neutral-200"></div>}
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Name</div>
                                            <div className="text-2xl font-black text-neutral-900 mt-1">{formData.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Roll Number</div>
                                            <div className="text-xl font-bold text-neutral-700 mt-1 font-mono">{formData.roll_number}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <button onClick={() => setStep(2)} className="flex-1 py-4 font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-2xl transition-colors border border-neutral-200">
                                        Retake Photo
                                    </button>
                                    <button onClick={handleRegister} disabled={loading} className="flex-1 py-4 font-extrabold text-white bg-neutral-900 hover:bg-neutral-800 rounded-2xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                        {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Registering...</> : <><CheckCircle size={20} /> Complete Registration</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex flex-col items-center py-12 text-center animate-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200 rotate-6">
                                    <CheckCircle size={50} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-extrabold text-neutral-900 mb-2">Registration Complete!</h3>
                                <p className="text-neutral-500 font-medium text-lg max-w-sm">{message}</p>
                                <button onClick={() => { setStep(1); setFormData({ name: '', roll_number: '' }); setFaceImage(null); setMessage(''); }} className="mt-10 px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold rounded-2xl transition-colors border border-neutral-200 shadow-sm">
                                    Register Another Student
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Registration;
