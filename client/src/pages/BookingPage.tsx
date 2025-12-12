import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Clock, CheckCircle, AlertOctagon, ArrowLeft, User } from 'lucide-react';

interface Slot {
    id: string;
    startTime: string;
    status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
}

export default function BookingPage() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const queryClient = useQueryClient();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data: slots, isLoading } = useQuery<Slot[]>({
        queryKey: ['slots', doctorId],
        queryFn: async () => {
            const res = await api.get(`/doctors/${doctorId}/slots`);
            return res.data;
        },
        refetchInterval: 3000,
    });

    const bookMutation = useMutation({
        mutationFn: async (slotId: string) => {
            if (!user) throw new Error("Please log in first");
            return api.post('/book', {
                slotId,
                patientName: user.name,
                patientEmail: user.email
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slots', doctorId] });
            alert("✅ Booking Confirmed Successfully!");
            navigate('/');
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.error || "Booking Failed");
        }
    });

    const handleBook = () => {
        if (!selectedSlot) return;
        if (!user) {
            login("Guest Patient", "guest@patient.com");
        }
        setErrorMsg(null);
        bookMutation.mutate(selectedSlot);
    };

    const selectedSlotData = slots?.find(s => s.id === selectedSlot);

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Doctors
            </button>

            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-slate-900">Select Time Slot</h1>
                <p className="text-slate-600">Choose your preferred appointment time</p>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500">Loading available slots...</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-3">

                        {/* Slots Grid */}
                        <div className="md:col-span-2 p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Available Slots</h3>
                                    <p className="text-sm text-slate-600">Live updates every 3 seconds</p>
                                </div>
                            </div>

                            {slots && slots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {slots.map(slot => {
                                        const isAvailable = slot.status === 'AVAILABLE';
                                        const isSelected = selectedSlot === slot.id;

                                        return (
                                            <button
                                                key={slot.id}
                                                disabled={!isAvailable}
                                                onClick={() => setSelectedSlot(slot.id)}
                                                className={cn(
                                                    "relative py-4 px-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                                                    isAvailable
                                                        ? "border-slate-200 hover:border-primary-500 hover:bg-primary-50 text-slate-700 hover:text-primary-700 hover:shadow-md"
                                                        : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed",
                                                    isSelected && "border-primary-600 bg-primary-600 text-white hover:bg-primary-700 hover:border-primary-700 shadow-lg ring-2 ring-primary-200"
                                                )}
                                            >
                                                <div className="text-center">
                                                    {format(new Date(slot.startTime), 'hh:mm a')}
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 bg-white text-primary-600 rounded-full p-0.5" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <Clock className="w-16 h-16 mx-auto mb-3 text-slate-300" />
                                    <p>No slots available for this doctor</p>
                                </div>
                            )}

                            {/* Legend */}
                            <div className="flex items-center gap-6 text-sm pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 border-2 border-slate-200 rounded-lg"></div>
                                    <span className="text-slate-600">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-primary-600 rounded-lg"></div>
                                    <span className="text-slate-600">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-50 border-2 border-slate-100 rounded-lg"></div>
                                    <span className="text-slate-600">Booked</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary Panel */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Booking Summary</h3>
                                    <p className="text-slate-400 text-sm">Review your appointment details</p>
                                </div>

                                {user && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                                            <User className="w-5 h-5 text-primary-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Patient</p>
                                                <p className="font-semibold">{user.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedSlotData && (
                                    <div className="p-4 bg-primary-600/30 border border-primary-500/50 rounded-xl">
                                        <p className="text-xs text-primary-300 font-semibold uppercase tracking-wider mb-2">Selected Time</p>
                                        <p className="text-2xl font-bold">
                                            {format(new Date(selectedSlotData.startTime), 'MMM dd, yyyy')}
                                        </p>
                                        <p className="text-3xl font-bold mt-1">
                                            {format(new Date(selectedSlotData.startTime), 'hh:mm a')}
                                        </p>
                                    </div>
                                )}

                                {errorMsg && (
                                    <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg flex items-start gap-3">
                                        <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-red-300 text-sm">Booking Failed</p>
                                            <p className="text-red-400 text-xs mt-1">{errorMsg}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleBook}
                                disabled={!selectedSlot || bookMutation.isPending}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {bookMutation.isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Confirm Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
