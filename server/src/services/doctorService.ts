import prisma from '../config/db';

export class DoctorService {
    static async createDoctor(name: string, specialization: string, bio?: string) {
        return prisma.doctor.create({
            data: { name, specialization, bio }
        });
    }

    static async getAllDoctors() {
        return prisma.doctor.findMany({
            include: { slots: { where: { status: 'AVAILABLE' } } } // Include available slots count potentially
        });
    }

    static async createSlot(doctorId: string, startTime: Date) {
        return prisma.slot.create({
            data: {
                doctorId,
                startTime,
                status: 'AVAILABLE'
            }
        });
    }

    static async getDoctorSlots(doctorId: string) {
        return prisma.slot.findMany({
            where: { doctorId },
            orderBy: { startTime: 'asc' }
        });
    }
}
