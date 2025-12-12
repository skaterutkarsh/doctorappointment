import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope } from 'lucide-react';

export default function Layout() {
    const { user, login, logout } = useAuth(); // Mock login logic usage

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition">
                        <Stethoscope className="w-8 h-8" />
                        <span className="text-xl font-bold tracking-tight">MediBook</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link to="/" className="font-medium text-gray-600 hover:text-primary-600 transition">Find Doctors</Link>
                        <Link to="/admin" className="font-medium text-gray-600 hover:text-primary-600 transition">Admin</Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">Hi, <b>{user.name}</b></span>
                                <button
                                    onClick={logout}
                                    className="text-sm text-red-600 font-medium hover:underline"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => login("Guest User", "guest@example.com")}
                                className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-primary-700 hover:shadow-lg transition-all"
                            >
                                Login
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <Outlet />
            </main>

            <footer className="bg-slate-900 text-slate-300 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="mb-2">© 2025 MediBook. Premium Healthcare Booking.</p>
                    <p className="text-sm text-slate-500">Built for High Concurrency Performance.</p>
                </div>
            </footer>
        </div>
    );
}
