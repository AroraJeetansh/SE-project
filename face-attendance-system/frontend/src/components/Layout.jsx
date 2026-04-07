import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center font-extrabold text-2xl tracking-tight text-neutral-900">
                            Facify Attendance
                        </div>
                        {user && (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
                                    <User size={16} className="text-neutral-900" />
                                    <span className="text-sm font-semibold text-neutral-800">{user.username}</span>
                                    <span className="text-xs tracking-wider uppercase text-neutral-500 font-bold ml-1 bg-white px-2 py-0.5 rounded-full shadow-sm">{user.role}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-sm font-bold rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
export default Layout;
