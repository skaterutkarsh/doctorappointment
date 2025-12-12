import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { DoctorService } from '../services/doctorService';
import { z } from 'zod';

// Zod Schemas for Validation
const CreateDoctorSchema = z.object({
    name: z.string().min(2),
    specialization: z.string().min(2),
    bio: z.string().optional()
});

const CreateSlotSchema = z.object({
    doctorId: z.string().uuid(),
    startTime: z.string().datetime() // ISO String
});

const BookSlotSchema = z.object({
    slotId: z.string().uuid(),
    patientName: z.string().min(2),
    patientEmail: z.string().email().optional()
});

export class MainController {

    // --- Admin ---
    static async createDoctor(req: Request, res: Response) {
        try {
            const data = CreateDoctorSchema.parse(req.body);
            const doctor = await DoctorService.createDoctor(data.name, data.specialization, data.bio);
            res.status(201).json(doctor);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async createSlot(req: Request, res: Response) {
        try {
            const data = CreateSlotSchema.parse(req.body);
            const slot = await DoctorService.createSlot(data.doctorId, new Date(data.startTime));
            res.status(201).json(slot);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // --- Public ---
    static async getDoctors(req: Request, res: Response) {
        try {
            const doctors = await DoctorService.getAllDoctors();
            res.json(doctors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSlots(req: Request, res: Response) {
        try {
            const { doctorId } = req.params;
            if (!doctorId) throw new Error("Doctor ID required");

            const slots = await DoctorService.getDoctorSlots(doctorId);
            res.json(slots);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // --- Booking (Critical) ---
    static async bookSlot(req: Request, res: Response) {
        try {
            const data = BookSlotSchema.parse(req.body);

            const booking = await BookingService.bookSlot(data.slotId, data.patientName, data.patientEmail);
            res.status(201).json({ success: true, booking });

        } catch (error: any) {
            // Distinguish race condition or logical error
            if (error.message.includes("Slot is already booked")) {
                res.status(409).json({ error: "Race Condition: Slot already booked by another user." });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }
}
