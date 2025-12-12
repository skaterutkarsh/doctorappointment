const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const doctors = [
    {
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        bio: "Board-certified cardiologist with 15+ years of experience in treating heart conditions and preventive cardiology."
    },
    {
        name: "Dr. Michael Chen",
        specialization: "Neurology",
        bio: "Expert neurologist specializing in migraine treatment, epilepsy, and neurodegenerative diseases."
    },
    {
        name: "Dr. Emily Williams",
        specialization: "Pediatrics",
        bio: "Compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence."
    },
    {
        name: "Dr. James Rodriguez",
        specialization: "Orthopedics",
        bio: "Orthopedic surgeon with expertise in sports medicine, joint replacement, and minimally invasive procedures."
    },
    {
        name: "Dr. Priya Sharma",
        specialization: "Dermatology",
        bio: "Dermatologist specializing in medical and cosmetic dermatology, skin cancer screening, and anti-aging treatments."
    }
];

// Random time slots throughout the day (9 AM to 5 PM)
const timeSlots = [
    { hour: 9, minute: 0 },   // 9:00 AM
    { hour: 9, minute: 30 },  // 9:30 AM
    { hour: 10, minute: 0 },  // 10:00 AM
    { hour: 10, minute: 30 }, // 10:30 AM
    { hour: 11, minute: 0 },  // 11:00 AM
    { hour: 11, minute: 30 }, // 11:30 AM
    { hour: 14, minute: 0 },  // 2:00 PM
    { hour: 14, minute: 30 }, // 2:30 PM
    { hour: 15, minute: 0 },  // 3:00 PM
    { hour: 15, minute: 30 }, // 3:30 PM
    { hour: 16, minute: 0 },  // 4:00 PM
    { hour: 16, minute: 30 }, // 4:30 PM
    { hour: 17, minute: 0 },  // 5:00 PM
];

// Helper function to get random time slots
function getRandomTimeSlots(count) {
    const shuffled = [...timeSlots].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

async function seed() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.booking.deleteMany();
    await prisma.slot.deleteMany();
    await prisma.doctor.deleteMany();

    console.log('👨‍⚕️ Creating doctors...');

    for (const doctorData of doctors) {
        const doctor = await prisma.doctor.create({
            data: doctorData
        });

        console.log(`✅ Created: ${doctor.name} (${doctor.specialization})`);
        console.log(`   📅 Creating randomized slots for ${doctor.name}...`);

        // Create slots for next 7 days with random times
        for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
            // Get 3-5 random time slots for each day
            const slotsPerDay = Math.floor(Math.random() * 3) + 3; // 3 to 5 slots
            const randomTimes = getRandomTimeSlots(slotsPerDay);

            for (const timeSlot of randomTimes) {
                const slotDate = new Date();
                slotDate.setDate(slotDate.getDate() + dayOffset);
                slotDate.setHours(timeSlot.hour, timeSlot.minute, 0, 0);

                await prisma.slot.create({
                    data: {
                        doctorId: doctor.id,
                        startTime: slotDate,
                        status: 'AVAILABLE'
                    }
                });
            }
        }

        const totalSlots = await prisma.slot.count({ where: { doctorId: doctor.id } });
        console.log(`   ✅ Created ${totalSlots} randomized slots for ${doctor.name}`);
    }

    const totalSlots = await prisma.slot.count();
    console.log('\n✨ Seed completed successfully!');
    console.log(`📊 Summary: ${doctors.length} doctors, ${totalSlots} total slots`);
    console.log(`⏰ Time slots randomized between 9:00 AM - 5:00 PM`);
}

seed()
    .catch(e => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
