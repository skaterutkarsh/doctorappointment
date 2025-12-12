import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { UserPlus, CalendarPlus, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
    const queryClient = useQueryClient();
    const [doctorForm, setDoctorForm] = useState({ name: '', specialization: '', bio: '' });
    const [slotForm, setSlotForm] = useState({ doctorId: '', startTime: '' });

    // Fetch doctors for the dropdown
    const { data: doctors } = useQuery<any[]>({
        queryKey: ['doctors'],
        queryFn: async () => {
            const res = await api.get('/doctors');
            return res.data;
        }
    });

    const createDoctor = useMutation({
        mutationFn: (data: typeof doctorForm) => api.post('/admin/doctors', data),
        onSuccess: () => {
            alert('✅ Doctor Created Successfully!');
            setDoctorForm({ name: '', specialization: '', bio: '' });
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
        }
    });

    const createSlot = useMutation({
        mutationFn: (data: typeof slotForm) => {
            const isoDate = new Date(data.startTime).toISOString();
            return api.post('/admin/slots', { ...data, startTime: isoDate });
        },
        onSuccess: () => {
            alert('✅ Slot Created Successfully!');
            setSlotForm({ ...slotForm, startTime: '' });
        },
        onError: (err: any) => {
            alert('❌ Error: ' + (err.response?.data?.error || err.message));
        }
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Page Header */}
            <div className="text-center space-y-3 pt-8">
                <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Manage doctors and their availability</p>
            </div>

            {/* Create Doctor Section */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Add New Specialist</h2>
                        <p className="text-sm text-slate-600">Create a new doctor profile</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Doctor Name</label>
                        <input
                            type="text"
                            placeholder="Dr. John Smith"
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition"
                            value={doctorForm.name}
                            onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Specialization</label>
                        <input
                            type="text"
                            placeholder="Cardiology, Neurology, etc."
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition"
                            value={doctorForm.specialization}
                            onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-semibold text-slate-700">Bio (Optional)</label>
                        <textarea
                            placeholder="Brief description about the doctor's experience and expertise..."
                            className="w-full p-3 border-2 border-slate-200 rounded-lg h-24 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition resize-none"
                            value={doctorForm.bio}
                            onChange={e => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={() => createDoctor.mutate(doctorForm)}
                        disabled={createDoctor.isPending}
                        className="col-span-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {createDoctor.isPending ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Create Doctor
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Create Slots Section */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <CalendarPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Add Availability</h2>
                        <p className="text-sm text-slate-600">Create time slots for doctor appointments</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Select Doctor</label>
                        <select
                            className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition"
                            value={slotForm.doctorId}
                            onChange={e => setSlotForm({ ...slotForm, doctorId: e.target.value })}
                        >
                            <option value="">Choose a doctor</option>
                            {doctors?.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} ({doc.specialization})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Date & Time</label>
                        <input
                            type="datetime-local"
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition"
                            value={slotForm.startTime}
                            onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={() => createSlot.mutate(slotForm)}
                        disabled={createSlot.isPending}
                        className="col-span-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {createSlot.isPending ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Create Slot
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}
