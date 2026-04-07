import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, AlertCircle } from 'lucide-react';

const WebCamCapture = ({ onCapture, buttonText = "Capture Face" }) => {
    const webcamRef = useRef(null);
    const [error, setError] = useState(false);

    const capture = useCallback((e) => {
        e.preventDefault();
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            onCapture(imageSrc);
        }
    }, [webcamRef, onCapture]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-slate-900 inline-block">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    height={300}
                    onUserMediaError={() => setError(true)}
                    className="object-cover"
                />
                <div className="absolute inset-0 pointer-events-none ring-4 ring-inset ring-indigo-500/20 rounded-2xl"></div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg mt-4 text-sm font-medium">
                    <AlertCircle size={16} />
                    Camera access denied or unavailable.
                </div>
            )}

            <button
                type="button"
                onClick={capture}
                className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 outline-none text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-transform active:scale-95"
            >
                <Camera size={20} />
                {buttonText}
            </button>
        </div>
    );
};
export default WebCamCapture;
