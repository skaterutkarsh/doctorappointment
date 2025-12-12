import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Calendar, Stethoscope, Award, Shield } from 'lucide-react';

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    bio?: string;
}

export default function Home() {
    const { data: doctors, isLoading, error } = useQuery<Doctor[]>({
        queryKey: ['doctors'],
        queryFn: async () => {
            const res = await api.get('/doctors');
            return res.data;
        }
    });

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                                Making Health Care
                                <span className="block text-primary-600">Better Together</span>
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Book appointments with top-tier specialists. Experience real-time availability
                                with our advanced booking system. Zero overbooking, guaranteed quality care.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#doctors"
                                    className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold shadow-lg hover:bg-primary-700 transition-all hover:shadow-xl"
                                >
                                    Make An Appointment
                                </a>
                                <Link
                                    to="/admin"
                                    className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-all"
                                >
                                    Admin Panel
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
                            <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white shadow-2xl">
                                <Stethoscope className="w-full h-64 text-primary-600/20" strokeWidth={0.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                        <Shield className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Zero Overbooking</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Advanced concurrency handling ensures your slot is secured. One slot, one patient.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                        <Calendar className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Availability</h3>
                    <p className="text-slate-600 leading-relaxed">
                        See live slot availability updated every few seconds. Book with confidence.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                        <Award className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Top Specialists</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Access to board-certified doctors across various specializations.
                    </p>
                </div>
            </div>

            {/* Doctors Section */}
            <div id="doctors" className="scroll-mt-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Specialists</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Meet our team of experienced healthcare professionals dedicated to your well-being
                    </p>
                </div>

                {isLoading && (
                    <div className="text-center py-20">
                        <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500">Loading specialists...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
                        <p className="text-red-600">Failed to load doctors. Please ensure the backend is running.</p>
                    </div>
                )}

                {doctors && doctors.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map(doctor => (
                            <div key={doctor.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden">
                                <div className="h-48 bg-gradient-to-br from-primary-500 to-blue-600 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Stethoscope className="w-24 h-24 text-white/30" strokeWidth={1} />
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-primary-600 font-semibold">{doctor.specialization}</p>
                                    </div>

                                    <p className="text-slate-600 text-sm line-clamp-2 min-h-[40px]">
                                        {doctor.bio || "Experienced healthcare professional dedicated to patient care."}
                                    </p>

                                    <Link
                                        to={`/booking/${doctor.id}`}
                                        className="block w-full text-center py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            Book Appointment
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {doctors && doctors.length === 0 && (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg mb-4">No doctors found</p>
                        <Link to="/admin" className="text-primary-600 font-semibold hover:underline">
                            Go to Admin Panel to add doctors
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
