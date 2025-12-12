
const axios = require('axios');

async function runConcurrencyTest() {
    const BASE_URL = 'http://localhost:3000/api';

    // 1. Setup: Create a doctor and a slot
    console.log("Setting up test data...");
    let doctorId, slotId;

    try {
        const docRes = await axios.post(`${BASE_URL}/admin/doctors`, {
            name: "Dr. House",
            specialization: "Diagnostic Medicine"
        });
        doctorId = docRes.data.id;

        const slotRes = await axios.post(`${BASE_URL}/admin/slots`, {
            doctorId: doctorId,
            startTime: new Date().toISOString()
        });
        slotId = slotRes.data.id;
        console.log(`Created Slot: ${slotId}`);
    } catch (e) {
        console.error("Setup failed (Server might not be running?):", e.message);
        return;
    }

    // 2. Fire 20 concurrent requests
    console.log("Firing 20 concurrent booking requests...");
    const requests = [];
    for (let i = 0; i < 20; i++) {
        requests.push(
            axios.post(`${BASE_URL}/book`, {
                slotId: slotId,
                patientName: `Patient ${i}`
            }).then(res => ({ status: 'success', data: res.data }))
                .catch(err => ({ status: 'failed', error: err.response?.data || err.message }))
        );
    }

    const results = await Promise.all(requests);

    // 3. Analyze results
    const successes = results.filter(r => r.status === 'success');
    const failures = results.filter(r => r.status === 'failed');

    console.log(`Total Requests: ${results.length}`);
    console.log(`Successes: ${successes.length}`);
    console.log(`Failures: ${failures.length}`);

    if (successes.length === 1 && failures.length === 19) {
        console.log("✅ TEST PASSED: Only 1 booking succeeded.");
    } else {
        console.log("❌ TEST FAILED: Unexpected result distribution.");
    }
}

runConcurrencyTest();
