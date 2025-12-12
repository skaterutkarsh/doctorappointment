import prisma from '../config/db';

/**
 * Service to handle booking logic with strict concurrency controls.
 */
export class BookingService {

    /**
     * Attempts to book a slot using Pessimistic Locking.
     * Note: For SQLite, writing is serially locked by default, but `FOR UPDATE` syntax is invalid.
     * We depend on the Transaction isolation here.
     */
    static async bookSlot(slotId: string, patientName: string, patientEmail?: string) {
        return await prisma.$transaction(async (tx) => {
            // 1. Lock/Get the Slot
            // SQLite does not support "FOR UPDATE". However, Prisma Interactive Transactions
            // on SQLite serialize writes. We verify status inside the transaction.
            const slot = await tx.slot.findUnique({
                where: { id: slotId }
            });

            if (!slot) {
                throw new Error("Slot not found");
            }

            // 2. Check status
            if (slot.status !== 'AVAILABLE') {
                throw new Error("Slot is already booked or currently locked by another user.");
            }

            // 3. Mark Slot as BOOKED
            await tx.slot.update({
                where: { id: slotId },
                data: {
                    status: 'BOOKED',
                }
            });

            // 4. Create Booking Record
            const booking = await tx.booking.create({
                data: {
                    slotId: slotId,
                    patientName: patientName,
                    patientEmail: patientEmail,
                    status: 'CONFIRMED'
                }
            });

            return booking;
        });
    }

    /**
     * Optional: Release expired locks (if we used LOCKED status)
     * This can be run by a cron job or lazily.
     */
    static async releaseExpiredLocks() {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        await prisma.slot.updateMany({
            where: {
                status: 'LOCKED',
                lockedAt: {
                    lt: twoMinutesAgo
                }
            },
            data: {
                status: 'AVAILABLE',
                lockedAt: null
            }
        });
    }
}
