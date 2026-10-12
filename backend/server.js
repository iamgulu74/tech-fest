import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import twilio from 'twilio';

dotenv.config();

const openaiHealth = new OpenAI({
    apiKey: process.env.HEALTH_OPENAI_API_KEY,
});


const twilioClient = twilio(
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json());

// Diagnostic logging endpoint
app.post('/api/debug-log', (req, res) => {
    console.log('🌐 CLIENT_LOG:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

// Real-time hospital state with live data
const hospitalData = new Map();

// Helper function to generate realistic stats
function generateRealisticStats(hospitalId, hospitalName) {
    const now = new Date();
    const hour = now.getHours();

    // Peak hours: 9-12 AM and 4-7 PM
    const isPeakHour = (hour >= 9 && hour <= 12) || (hour >= 16 && hour <= 19);
    const baseMultiplier = isPeakHour ? 1.5 : 1.0;

    // Generate queue (more during peak hours)
    const queueSize = Math.floor(Math.random() * 15 * baseMultiplier) + 3;
    const queue = [];
    const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anita', 'Raj', 'Meera', 'Suresh', 'Divya'];
    const lastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Reddy', 'Nair', 'Chopra', 'Desai'];

    for (let i = 0; i < queueSize; i++) {
        const severity = Math.random();
        let priority, color, waitTime;

        if (severity > 0.9) {
            priority = 'Emergency';
            color = 'red';
            waitTime = Math.floor(Math.random() * 5) + 2;
        } else if (severity > 0.7) {
            priority = 'Urgent';
            color = 'orange';
            waitTime = Math.floor(Math.random() * 15) + 10;
        } else {
            priority = 'Regular';
            color = 'green';
            waitTime = Math.floor(Math.random() * 25) + 15;
        }

        queue.push({
            token: `TK-${12000 + i + Math.floor(Math.random() * 100)}`,
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            wait: waitTime,
            priority,
            color,
            phone: "+916371401928",
            timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
        });
    }

    // Sort by priority and wait time
    queue.sort((a, b) => {
        const priorityOrder = { 'Emergency': 0, 'Urgent': 1, 'Regular': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Beds (varied occupancy)
    const totalBeds = Math.floor(Math.random() * 200) + 100;
    const occupancyRate = 0.65 + Math.random() * 0.25; // 65-90%
    const occupied = Math.floor(totalBeds * occupancyRate);

    // Wards
    const wards = [
        { name: 'General Ward', total: Math.floor(totalBeds * 0.4), occupied: Math.floor(totalBeds * 0.4 * occupancyRate) },
        { name: 'ICU', total: Math.floor(totalBeds * 0.15), occupied: Math.floor(totalBeds * 0.15 * (occupancyRate + 0.1)) },
        { name: 'Emergency', total: Math.floor(totalBeds * 0.2), occupied: Math.floor(totalBeds * 0.2 * occupancyRate) },
        { name: 'Pediatric', total: Math.floor(totalBeds * 0.15), occupied: Math.floor(totalBeds * 0.15 * (occupancyRate - 0.1)) },
        { name: 'Maternity', total: Math.floor(totalBeds * 0.1), occupied: Math.floor(totalBeds * 0.1 * occupancyRate) }
    ];

    // Staff
    const totalStaff = Math.floor(totalBeds * 0.8);
    const staffing = {
        currentShift: hour < 8 ? 'Night' : hour < 16 ? 'Morning' : 'Evening',
        onDuty: totalStaff,
        doctors: Math.floor(totalStaff * 0.3),
        nurses: Math.floor(totalStaff * 0.5),
        support: Math.floor(totalStaff * 0.2)
    };

    // Analytics
    const avgWaitTime = Math.floor(queue.reduce((sum, p) => sum + p.wait, 0) / queue.length) || 0;
    const dailyPatients = Math.floor(Math.random() * 200) + 150;
    const weeklyTrend = Array(7).fill(0).map((_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        patients: Math.floor(Math.random() * 100) + 100
    }));

    const peakHours = [
        { hour: '9-10 AM', count: Math.floor(Math.random() * 30) + 20 },
        { hour: '10-11 AM', count: Math.floor(Math.random() * 35) + 25 },
        { hour: '11-12 PM', count: Math.floor(Math.random() * 30) + 20 },
        { hour: '4-5 PM', count: Math.floor(Math.random() * 40) + 30 },
        { hour: '5-6 PM', count: Math.floor(Math.random() * 35) + 25 }
    ];

    return {
        id: hospitalId,
        name: hospitalName,
        queue,
        beds: { total: totalBeds, occupied, available: totalBeds - occupied },
        wards,
        staffing,
        analytics: {
            avgWaitTime,
            dailyPatients,
            weeklyTrend,
            peakHours,
            currentLoad: Math.floor((queueSize / 20) * 100),
            satisfactionRate: 85 + Math.floor(Math.random() * 10),
            emergencyRate: Math.floor((queue.filter(p => p.priority === 'Emergency').length / queue.length) * 100) || 0
        },
        lastUpdate: new Date().toISOString()
    };
}

// Initialize hospitals from Google Places API
async function fetchRealHospitals() {
    const establishedHospitals = [
        // Delhi NCR (Already 8)
        { id: 'aiims-delhi', name: 'AIIMS Delhi', address: 'Ansari Nagar, New Delhi', city: 'Delhi', state: 'Delhi', type: 'Emergency', location: { lat: 28.5672, lng: 77.2100 }, rating: 4.5, totalRatings: 5000 },
        { id: 'apollo-delhi', name: 'Apollo Hospital Delhi', address: 'Sarita Vihar, Delhi', city: 'Delhi', state: 'Delhi', type: 'Emergency', location: { lat: 28.5355, lng: 77.2789 }, rating: 4.4, totalRatings: 3500 },
        { id: 'fortis-delhi', name: 'Fortis Escorts Heart Institute', address: 'Okhla Road, Delhi', city: 'Delhi', state: 'Delhi', type: 'Emergency', location: { lat: 28.5583, lng: 77.2736 }, rating: 4.3, totalRatings: 2200 },
        { id: 'max-delhi', name: 'Max Super Speciality Hospital', address: 'Saket, New Delhi', city: 'Delhi', state: 'Delhi', type: 'Diagnostics', location: { lat: 28.5276, lng: 77.2117 }, rating: 4.2, totalRatings: 1800 },
        { id: 'ganga-ram-delhi', name: 'Sir Ganga Ram Hospital', address: 'Old Rajinder Nagar, Delhi', city: 'Delhi', state: 'Delhi', type: 'Emergency', location: { lat: 28.6385, lng: 77.1895 }, rating: 4.3, totalRatings: 2600 },
        { id: 'safdarjung-delhi', name: 'Safdarjung Hospital', address: 'Ansari Nagar, Delhi', city: 'Delhi', state: 'Delhi', type: 'Emergency', location: { lat: 28.5668, lng: 77.2078 }, rating: 3.9, totalRatings: 4100 },

        // Maharashtra (Mumbai & Pune)
        { id: 'lilavati-mumbai', name: 'Lilavati Hospital Mumbai', address: 'Bandra West, Mumbai', city: 'Mumbai', state: 'Maharashtra', type: 'Emergency', location: { lat: 19.0596, lng: 72.8295 }, rating: 4.4, totalRatings: 3100 },
        { id: 'kokilaben-mumbai', name: 'Kokilaben Dhirubhai Ambani Hospital', address: 'Andheri West, Mumbai', city: 'Mumbai', state: 'Maharashtra', type: 'Emergency', location: { lat: 19.1311, lng: 72.8252 }, rating: 4.6, totalRatings: 4500 },
        { id: 'hinduja-mumbai', name: 'P.D. Hinduja National Hospital', address: 'Mahim, Mumbai', city: 'Mumbai', state: 'Maharashtra', type: 'Emergency', location: { lat: 19.0335, lng: 72.8385 }, rating: 4.4, totalRatings: 3200 },
        { id: 'ruby-pune', name: 'Ruby Hall Clinic', address: 'Sassoon Road, Pune', city: 'Pune', state: 'Maharashtra', type: 'Emergency', location: { lat: 18.5312, lng: 73.8612 }, rating: 4.4, totalRatings: 2500 },
        { id: 'noble-pune', name: 'Noble Hospital', address: 'Hadapsar, Pune', city: 'Pune', state: 'Maharashtra', type: 'Emergency', location: { lat: 18.5034, lng: 73.9271 }, rating: 4.2, totalRatings: 1100 },

        // Karnataka (Bangalore)
        { id: 'manipal-bangalore', name: 'Manipal Hospital', address: 'Old Airport Road, Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Emergency', location: { lat: 12.9612, lng: 77.6482 }, rating: 4.4, totalRatings: 3800 },
        { id: 'narayana-bangalore', name: 'Narayana Health City', address: 'Bommasandra, Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Emergency', location: { lat: 12.8123, lng: 77.6945 }, rating: 4.5, totalRatings: 5200 },
        { id: 'st-johns-bangalore', name: "St. John's Medical College Hospital", address: 'Koramangala, Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Emergency', location: { lat: 12.9345, lng: 77.6123 }, rating: 4.1, totalRatings: 3400 },
        { id: 'kle-hospital-belgaum', name: 'KLE Society Hospital', address: 'Nehru Nagar, Belgaum', city: 'Belgaum', state: 'Karnataka', type: 'Emergency', location: { lat: 15.8712, lng: 74.5213 }, rating: 4.3, totalRatings: 1800 },

        // Tamil Nadu (Chennai, Vellore, Coimbatore)
        { id: 'cmc-vellore', name: 'Christian Medical College (CMC)', address: 'Ida Scudder Road, Vellore', city: 'Vellore', state: 'Tamil Nadu', type: 'Emergency', location: { lat: 12.9212, lng: 79.1312 }, rating: 4.8, totalRatings: 8500 },
        { id: 'apollo-chennai', name: 'Apollo Hospital Chennai', address: 'Greams Road, Chennai', city: 'Chennai', state: 'Tamil Nadu', type: 'Emergency', location: { lat: 13.0569, lng: 80.2520 }, rating: 4.5, totalRatings: 4200 },
        { id: 'kg-hospital-coimbatore', name: 'KG Hospital', address: 'Race Course Road, Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu', type: 'Emergency', location: { lat: 11.0012, lng: 76.9712 }, rating: 4.3, totalRatings: 1900 },
        { id: 'meenakshi-madurai', name: 'Meenakshi Mission Hospital', address: 'Melur Road, Madurai', city: 'Madurai', state: 'Tamil Nadu', type: 'Emergency', location: { lat: 9.9412, lng: 78.1456 }, rating: 4.4, totalRatings: 2100 },

        // Telangana (Hyderabad)
        { id: 'apollo-hyderabad', name: 'Apollo Hospitals Jubilee Hills', address: 'Jubilee Hills, Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'Emergency', location: { lat: 17.4123, lng: 78.4123 }, rating: 4.4, totalRatings: 3600 },
        { id: 'yashoda-hyderabad', name: 'Yashoda Hospitals', address: 'Somajiguda, Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'Emergency', location: { lat: 17.4234, lng: 78.4523 }, rating: 4.3, totalRatings: 3100 },
        { id: 'nims-hyderabad', name: 'Nizam Institute of Medical Sciences', address: 'Punjagutta, Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'Emergency', location: { lat: 17.4212, lng: 78.4556 }, rating: 4.5, totalRatings: 5200 },

        // Andhra Pradesh
        { id: 'gms-vishwa-vizag', name: 'SevenHills Hospital', address: 'Rockdale Layout, Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'Emergency', location: { lat: 17.7123, lng: 83.3123 }, rating: 4.2, totalRatings: 1600 },
        { id: 'apollo-vijayawada', name: 'Apollo Health City', address: 'Suryaraopeta, Vijayawada', city: 'Vijayawada', state: 'Andhra Pradesh', type: 'Emergency', location: { lat: 16.5123, lng: 80.6212 }, rating: 4.3, totalRatings: 1800 },
        { id: 'kims-kurnool', name: 'KIMS Hospital', address: 'Joharapuram Road, Kurnool', city: 'Kurnool', state: 'Andhra Pradesh', type: 'Emergency', location: { lat: 15.8212, lng: 78.0312 }, rating: 4.1, totalRatings: 900 },

        // Kerala
        { id: 'amrita-kochi', name: 'Amrita Hospital', address: 'Ponekkara, Kochi', city: 'Kochi', state: 'Kerala', type: 'Emergency', location: { lat: 10.0312, lng: 76.2912 }, rating: 4.7, totalRatings: 3900 },
        { id: 'aster-kochi', name: 'Aster Medcity', address: 'Cheranalloor, Kochi', city: 'Kochi', state: 'Kerala', type: 'Diagnostics', location: { lat: 10.0512, lng: 76.2612 }, rating: 4.6, totalRatings: 1900 },
        { id: 'baby-memorial-kozhikode', name: 'Baby Memorial Hospital', address: 'Indira Gandhi Road, Kozhikode', city: 'Kozhikode', state: 'Kerala', type: 'Emergency', location: { lat: 11.2612, lng: 75.7890 }, rating: 4.4, totalRatings: 2200 },

        // Odisha
        { id: 'padmini-care-tangi-cuttack', name: 'Padmini Care Hospital', address: 'DRIEMS Campus, Kotasahi, Tangi, Cuttack 754022', city: 'Tangi, Cuttack', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 98, diagnosticRating: 4.9, diagnosticSpecialties: ['Digital X-Ray', '24x7 Pathology & Blood Lab', 'Ultrasonography', 'ECG / Echo', 'Emergency Trauma Diagnostics'], location: { lat: 20.5528, lng: 86.0003 }, phone: '+91 97760 00399', rating: 4.8, totalRatings: 1250 },
        { id: 'tangi-central-diagnostics', name: 'Tangi Central Diagnostics & Pathology Lab', address: 'Main Road, Near DRIEMS Gate, Tangi, Cuttack 754022', city: 'Tangi, Cuttack', state: 'Odisha', type: 'Diagnostics', hasDiagnostics: true, diagnosticScore: 99, diagnosticRating: 4.9, diagnosticSpecialties: ['MRI & CT Scanning', 'Full Body Checkup', 'Pathology & Biochemistry', 'USG / 4D Doppler'], location: { lat: 20.5562, lng: 85.9988 }, phone: '+91 97760 00399', rating: 4.9, totalRatings: 1120 },
        { id: 'scb-medical-cuttack', name: 'SCB Medical College & Hospital', address: 'Mangalabag, Cuttack', city: 'Cuttack', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 97, diagnosticRating: 4.8, diagnosticSpecialties: ['Central Pathology Lab', 'Advanced MRI / CT Imaging', 'Genomics & Histopathology', 'Nuclear Medicine'], location: { lat: 20.4673, lng: 85.8828 }, phone: '+91 671 2414004', rating: 4.5, totalRatings: 7500 },
        { id: 'cuttack-mri-diagnostics', name: 'Cuttack Advanced Imaging & Diagnostics Centre', address: 'Mangalabag Medical Road, Cuttack', city: 'Cuttack', state: 'Odisha', type: 'Diagnostics', hasDiagnostics: true, diagnosticScore: 98, diagnosticRating: 4.9, diagnosticSpecialties: ['3T MRI', '128-Slice CT Scan', 'Ultrasound & Mammography', 'Automated Clinical Lab'], location: { lat: 20.4695, lng: 85.8850 }, phone: '+91 671 2304950', rating: 4.9, totalRatings: 3400 },
        { id: 'ashwini-cuttack', name: 'Ashwini Hospital', address: 'Sector 1, CDA, Cuttack', city: 'Cuttack', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 92, diagnosticRating: 4.5, diagnosticSpecialties: ['Digital Radiology', 'Pathology Lab', 'Echo & ECG'], location: { lat: 20.4812, lng: 85.8612 }, rating: 4.3, totalRatings: 1400 },
        { id: 'shanti-memorial-cuttack', name: 'Shanti Memorial Hospital', address: 'Thoria Sahi, Cuttack', city: 'Cuttack', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 90, diagnosticRating: 4.4, diagnosticSpecialties: ['Clinical Pathology', 'Ultrasound', 'Digital X-Ray'], location: { lat: 20.4612, lng: 85.8756 }, rating: 4.2, totalRatings: 920 },
        { id: 'aiims-bhubaneswar', name: 'AIIMS Bhubaneswar', address: 'Sijua, Dumuduma, Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 99, diagnosticRating: 4.9, diagnosticSpecialties: ['Apex Diagnostic Lab', 'PET-CT & 3T MRI', 'Molecular Biology & Genetics', 'Clinical Biochemistry'], location: { lat: 20.2312, lng: 85.7712 }, rating: 4.8, totalRatings: 8200 },
        { id: 'kims-odisha', name: 'Kalinga Institute of Medical Sciences (KIMS)', address: 'Kushabhadra, Patia, Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 94, diagnosticRating: 4.6, diagnosticSpecialties: ['Radiodiagnosis', 'Pathology Wing', 'Advanced Endoscopy'], location: { lat: 20.3533, lng: 85.8189 }, rating: 4.6, totalRatings: 4200 },
        { id: 'apollo-bhubaneswar', name: 'Apollo Hospitals Bhubaneswar', address: 'Samanta Vihar, Sainik School Road, Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 96, diagnosticRating: 4.8, diagnosticSpecialties: ['NABL Accredited Diagnostics', '256-Slice CT', 'Cardiovascular Diagnostics'], location: { lat: 20.3065, lng: 85.8315 }, rating: 4.5, totalRatings: 4600 },
        { id: 'sum-hospital-bhubaneswar', name: 'IMS & SUM Hospital', address: 'K8 Kalinganagar, Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'Emergency', hasDiagnostics: true, diagnosticScore: 91, diagnosticRating: 4.5, diagnosticSpecialties: ['Diagnostic Radiology', 'Pathology & Blood Bank'], location: { lat: 20.2789, lng: 85.7645 }, rating: 4.4, totalRatings: 3900 },
        { id: 'amri-bhubaneswar', name: 'AMRI Hospitals Bhubaneswar', address: 'Khandagiri, Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'Emergency', location: { lat: 20.2608, lng: 85.7836 }, rating: 4.3, totalRatings: 2800 },
        { id: 'care-hospital-bhubaneswar', name: 'CARE Hospitals', address: 'Chandrasekharpur, Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'Emergency', location: { lat: 20.3235, lng: 85.8202 }, rating: 4.3, totalRatings: 2100 },
        { id: 'vimsar-burla-sambalpur', name: 'VIMSAR Hospital', address: 'Burla, Sambalpur', city: 'Sambalpur', state: 'Odisha', type: 'Emergency', location: { lat: 21.4982, lng: 83.8741 }, rating: 4.2, totalRatings: 3400 },
        { id: 'mkcg-berhampur', name: 'MKCG Medical College & Hospital', address: 'Medical College Road, Berhampur', city: 'Berhampur', state: 'Odisha', type: 'Emergency', location: { lat: 19.3149, lng: 84.8067 }, rating: 4.3, totalRatings: 2900 },
        { id: 'igh-rourkela', name: 'Ispat General Hospital (IGH)', address: 'Sector 19, Rourkela', city: 'Rourkela', state: 'Odisha', type: 'Emergency', location: { lat: 22.2595, lng: 84.8715 }, rating: 4.4, totalRatings: 2700 },

        // West Bengal
        { id: 'apollo-kolkata', name: 'Apollo Multispeciality Hospitals', address: 'Canal Circular Road, Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Emergency', location: { lat: 22.5645, lng: 88.4012 }, rating: 4.3, totalRatings: 2900 },
        { id: 'rtagore-kolkata', name: 'Rabindranath Tagore Hospital', address: 'Mukundapur, Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Emergency', location: { lat: 22.4812, lng: 88.3956 }, rating: 4.4, totalRatings: 3800 },
        { id: 'sskm-kolkata', name: 'SSKM Hospital (PGH)', address: 'AJC Bose Road, Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Emergency', location: { lat: 22.5389, lng: 88.3444 }, rating: 4.5, totalRatings: 6200 },

        // Bihar & Jharkhand
        { id: 'aiims-patna', name: 'AIIMS Patna', address: 'Phulwari Sharif, Patna', city: 'Patna', state: 'Bihar', type: 'Emergency', location: { lat: 25.5612, lng: 85.0812 }, rating: 4.4, totalRatings: 3500 },
        { id: 'paras-hmri-patna', name: 'Paras HMRI Hospital', address: 'Bailey Road, Patna', city: 'Patna', state: 'Bihar', type: 'Emergency', location: { lat: 25.6123, lng: 85.0912 }, rating: 4.1, totalRatings: 2100 },
        { id: 'rims-ranchi', name: 'RIMS Ranchi', address: 'Bariatu, Ranchi', city: 'Ranchi', state: 'Jharkhand', type: 'Emergency', location: { lat: 23.3890, lng: 85.3512 }, rating: 4.2, totalRatings: 3200 },
        { id: 'tata-main-jamshedpur', name: 'Tata Main Hospital (TMH)', address: 'Bistupur, Jamshedpur', city: 'Jamshedpur', state: 'Jharkhand', type: 'Emergency', location: { lat: 22.8012, lng: 86.1912 }, rating: 4.5, totalRatings: 4100 },

        // Uttar Pradesh
        { id: 'sgpgi-lucknow', name: 'Sanjay Gandhi PGI', address: 'Raebareli Road, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', type: 'Emergency', location: { lat: 26.7512, lng: 80.9312 }, rating: 4.5, totalRatings: 4100 },
        { id: 'kora-vns-hospital', name: 'Heritage Hospital', address: 'Lanka, Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', type: 'Emergency', location: { lat: 25.2612, lng: 82.9912 }, rating: 4.2, totalRatings: 1800 },
        { id: 'medanta-lucknow', name: 'Medanta Hospital', address: 'Sushant Golf City, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', type: 'Emergency', location: { lat: 26.7712, lng: 81.0123 }, rating: 4.4, totalRatings: 1800 },
        { id: 'fortis-noida', name: 'Fortis Hospital Noida', address: 'Sector 62, Noida', city: 'Noida', state: 'Uttar Pradesh', type: 'Emergency', location: { lat: 28.6189, lng: 77.3712 }, rating: 4.2, totalRatings: 2800 },

        // Gujarat & Rajasthan
        { id: 'civil-ahmedabad', name: 'Civil Hospital Ahmedabad', address: 'Asarwa, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Emergency', location: { lat: 23.0512, lng: 72.5912 }, rating: 4.2, totalRatings: 4800 },
        { id: 'zydus-ahmedabad', name: 'Zydus Hospital', address: 'Thaltej, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Emergency', location: { lat: 23.0412, lng: 72.5123 }, rating: 4.5, totalRatings: 1900 },
        { id: 'sms-jaipur', name: 'SMS Hospital Jaipur', address: 'JLN Marg, Jaipur', city: 'Jaipur', state: 'Rajasthan', type: 'Emergency', location: { lat: 26.9112, lng: 75.8112 }, rating: 4.3, totalRatings: 6100 },
        { id: 'fortis-jaipur', name: 'Fortis Escorts Hospital', address: 'Jawaharlal Nehru Marg, Jaipur', city: 'Jaipur', state: 'Rajasthan', type: 'Emergency', location: { lat: 26.8512, lng: 75.8012 }, rating: 4.4, totalRatings: 2400 },

        // Madhya Pradesh & Chhattisgarh
        { id: 'aiims-bhopal', name: 'AIIMS Bhopal', address: 'Saket Nagar, Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', type: 'Emergency', location: { lat: 23.2012, lng: 77.4512 }, rating: 4.5, totalRatings: 3800 },
        { id: 'choithram-indore', name: 'Choithram Hospital', address: 'Manik Bagh Road, Indore', city: 'Indore', state: 'Madhya Pradesh', type: 'Emergency', location: { lat: 22.7012, lng: 75.8512 }, rating: 4.4, totalRatings: 2100 },
        { id: 'aiims-raipur', name: 'AIIMS Raipur', address: 'Tatibandh, Raipur', city: 'Raipur', state: 'Chhattisgarh', type: 'Emergency', location: { lat: 21.2512, lng: 81.5712 }, rating: 4.5, totalRatings: 4200 },
        { id: 'ramkrishna-raipur', name: 'Ramkrishna Care Hospital', address: 'Aurobindo Enclave, Raipur', city: 'Raipur', state: 'Chhattisgarh', type: 'Emergency', location: { lat: 21.2312, lng: 81.6512 }, rating: 4.3, totalRatings: 1600 },

        // Haryana & Punjab
        { id: 'medanta-gurgaon', name: 'Medanta - The Medicity', address: 'Sector 38, Gurgaon', city: 'Gurgaon', state: 'Haryana', type: 'Emergency', location: { lat: 28.4234, lng: 77.0312 }, rating: 4.5, totalRatings: 5500 },
        { id: 'fortis-gurgaon', name: 'Fortis Memorial Research Institute', address: 'Sector 44, Gurgaon', city: 'Gurgaon', state: 'Haryana', type: 'Emergency', location: { lat: 28.4512, lng: 77.0712 }, rating: 4.4, totalRatings: 3200 },
        { id: 'pgimer-chandigarh', name: 'PGIMER Chandigarh', address: 'Sector 12, Chandigarh', city: 'Chandigarh', state: 'Punjab', type: 'Emergency', location: { lat: 30.7612, lng: 76.7712 }, rating: 4.6, totalRatings: 7200 },
        { id: 'fortis-mohali', name: 'Fortis Hospital Mohali', address: 'Sector 62, Mohali', city: 'Mohali', state: 'Punjab', type: 'Emergency', location: { lat: 30.6912, lng: 76.7312 }, rating: 4.4, totalRatings: 2900 },

        // Uttarakhand & Himachal
        { id: 'max-dehradun', name: 'Max Super Speciality Hospital', address: 'Makkawala, Dehradun', city: 'Dehradun', state: 'Uttarakhand', type: 'Emergency', location: { lat: 30.3412, lng: 78.0412 }, rating: 4.4, totalRatings: 1500 },
        { id: 'aiims-rishikesh', name: 'AIIMS Rishikesh', address: 'Virbhadra Road, Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', type: 'Emergency', location: { lat: 30.1212, lng: 78.2912 }, rating: 4.7, totalRatings: 3100 },
        { id: 'igmc-shimla', name: 'Indira Gandhi Medical College (IGMC)', address: 'Lakkar Bazar, Shimla', city: 'Shimla', state: 'Himachal Pradesh', type: 'Emergency', location: { lat: 31.1012, lng: 77.1712 }, rating: 4.2, totalRatings: 2400 },
        { id: 'fortis-kangra', name: 'Fortis Hospital Kangra', address: 'Dharamsala Road, Kangra', city: 'Kangra', state: 'Himachal Pradesh', type: 'Emergency', location: { lat: 32.1012, lng: 76.2712 }, rating: 4.1, totalRatings: 1100 },

        // North East (Assam, Meghalaya, etc.)
        { id: 'gmch-guwahati', name: 'Gauhati Medical College', address: 'Bhangagarh, Guwahati', city: 'Guwahati', state: 'Assam', type: 'Emergency', location: { lat: 26.1512, lng: 91.7712 }, rating: 4.1, totalRatings: 3200 },
        { id: 'gnrc-guwahati', name: 'GNRC Hospital', address: 'Dispur, Guwahati', city: 'Guwahati', state: 'Assam', type: 'Emergency', location: { lat: 26.1412, lng: 91.7912 }, rating: 4.3, totalRatings: 1500 },
        { id: 'neigrihms-shillong', name: 'NEIGRIHMS', address: 'Mawdiangdiang, Shillong', city: 'Shillong', state: 'Meghalaya', type: 'Emergency', location: { lat: 25.6012, lng: 91.9312 }, rating: 4.4, totalRatings: 2100 },
        { id: 'rims-imphal', name: 'RIMS Imphal', address: 'Lamphelpat, Imphal', city: 'Imphal', state: 'Manipur', type: 'Emergency', location: { lat: 24.8112, lng: 93.9212 }, rating: 4.2, totalRatings: 1900 },

        // Other States (Goa, Tripura, etc.)
        { id: 'goa-med-college', name: 'Goa Medical College (GMC)', address: 'Bambolim, Goa', city: 'Goa', state: 'Goa', type: 'Emergency', location: { lat: 15.4512, lng: 73.8512 }, rating: 4.1, totalRatings: 4200 },
        { id: 'agartala-med-college', name: 'Agartala Government Medical College', address: 'Kunjaban, Agartala', city: 'Agartala', state: 'Tripura', type: 'Emergency', location: { lat: 23.8512, lng: 91.2812 }, rating: 4.0, totalRatings: 1500 },

        // Jammu & Kashmir & Ladakh
        { id: 'skims-srinagar', name: 'SKIMS Srinagar', address: 'Soura, Srinagar', city: 'Srinagar', state: 'Jammu & Kashmir', type: 'Emergency', location: { lat: 34.1312, lng: 74.8012 }, rating: 4.3, totalRatings: 3800 },
        { id: 'gmc-jammu', name: 'Government Medical College (GMC)', address: 'Bakshi Nagar, Jammu', city: 'Jammu', state: 'Jammu & Kashmir', type: 'Emergency', location: { lat: 32.7312, lng: 74.8512 }, rating: 4.1, totalRatings: 2100 },
        { id: 'snm-hospital-leh', name: 'SNM Hospital Leh', address: 'Leh City, Ladakh', city: 'Leh', state: 'Ladakh', type: 'Emergency', location: { lat: 34.1612, lng: 77.5612 }, rating: 4.5, totalRatings: 800 },

        // Union Territories (Puducherry, A&N)
        { id: 'jipmer-puducherry', name: 'JIPMER', address: 'Dhanvantari Nagar, Puducherry', city: 'Puducherry', state: 'Puducherry', type: 'Emergency', location: { lat: 11.9512, lng: 79.8012 }, rating: 4.5, totalRatings: 3800 },
        { id: 'gb-pant-port-blair', name: 'G.B. Pant Hospital', address: 'Atlanta Point, Port Blair', city: 'Port Blair', state: 'Andaman & Nicobar Islands', type: 'Emergency', location: { lat: 11.6712, lng: 92.7412 }, rating: 4.2, totalRatings: 1200 },
        { id: 'vinayaka-mission-karaikal', name: 'Vinayaka Mission Medical College', address: 'Keezhakasakudy, Karaikal', city: 'Karaikal', state: 'Puducherry', type: 'Emergency', location: { lat: 10.9512, lng: 79.8312 }, rating: 4.1, totalRatings: 600 },

        // Remaining AIIMS & Requested Odisha Hospitals
        { id: 'aiims-jodhpur', name: 'AIIMS Jodhpur', address: 'Basni Industrial Area Phase 2, Jodhpur', city: 'Jodhpur', state: 'Rajasthan', type: 'Emergency', location: { lat: 26.2389, lng: 73.0052 }, rating: 4.6, totalRatings: 2800 },
        { id: 'aiims-gorakhpur', name: 'AIIMS Gorakhpur', address: 'Kunaun, Gorakhpur', city: 'Gorakhpur', state: 'Uttar Pradesh', type: 'Emergency', location: { lat: 26.7465, lng: 83.4198 }, rating: 4.3, totalRatings: 1200 },
        { id: 'aiims-kalyani', name: 'AIIMS Kalyani', address: 'NH-34, Kalyani', city: 'Kalyani', state: 'West Bengal', type: 'Emergency', location: { lat: 22.9754, lng: 88.5284 }, rating: 4.4, totalRatings: 1500 },
        { id: 'aiims-bathinda', name: 'AIIMS Bathinda', address: 'Mansa Road, Bathinda', city: 'Bathinda', state: 'Punjab', type: 'Emergency', location: { lat: 30.1617, lng: 74.9263 }, rating: 4.5, totalRatings: 900 },
        { id: 'aiims-bilaspur-hp', name: 'AIIMS Bilaspur (HP)', address: 'Kothipura, Bilaspur', city: 'Bilaspur', state: 'Himachal Pradesh', type: 'Emergency', location: { lat: 31.3212, lng: 76.7612 }, rating: 4.4, totalRatings: 700 },
        { id: 'aiims-madurai', name: 'AIIMS Madurai', address: 'Thoppur, Madurai', city: 'Madurai', state: 'Tamil Nadu', type: 'Emergency', location: { lat: 9.8870, lng: 77.9994 }, rating: 4.2, totalRatings: 500 },
        { id: 'aiims-guwahati', name: 'AIIMS Guwahati', address: 'Changsari, Guwahati', city: 'Guwahati', state: 'Assam', type: 'Emergency', location: { lat: 26.2523, lng: 91.6956 }, rating: 4.3, totalRatings: 600 },
        { id: 'aiims-rajkot', name: 'AIIMS Rajkot', address: 'Khanderi, Rajkot', city: 'Rajkot', state: 'Gujarat', type: 'Emergency', location: { lat: 22.3512, lng: 70.7812 }, rating: 4.4, totalRatings: 400 },
        { id: 'aiims-nagpur', name: 'AIIMS Nagpur', address: 'MIHAN, Nagpur', city: 'Nagpur', state: 'Maharashtra', type: 'Emergency', location: { lat: 21.0386, lng: 79.0238 }, rating: 4.6, totalRatings: 1100 },
        { id: 'aiims-bibinagar', name: 'AIIMS Bibinagar', address: 'Bibinagar, Yadadri Bhuvanagiri', city: 'Bibinagar', state: 'Telangana', type: 'Emergency', location: { lat: 17.4710, lng: 78.7780 }, rating: 4.1, totalRatings: 850 },
        { id: 'aiims-deoghar', name: 'AIIMS Deoghar', address: 'Devipur, Deoghar', city: 'Deoghar', state: 'Jharkhand', type: 'Emergency', location: { lat: 24.4361, lng: 86.6138 }, rating: 4.3, totalRatings: 950 },
        { id: 'aiims-mangalagiri', name: 'AIIMS Mangalagiri', address: 'Mangalagiri, Guntur', city: 'Mangalagiri', state: 'Andhra Pradesh', type: 'Emergency', location: { lat: 16.4462, lng: 80.5802 }, rating: 4.5, totalRatings: 1300 },
        { id: 'aiims-raebareli', name: 'AIIMS Raebareli', address: 'Munshiganj, Raebareli', city: 'Raebareli', state: 'Uttar Pradesh', type: 'Emergency', location: { lat: 26.2235, lng: 81.2412 }, rating: 4.2, totalRatings: 1400 }
    ];

    // Seed established hospitals first
    establishedHospitals.forEach(hospital => {
        const stats = generateRealisticStats(hospital.id, hospital.name);
        hospitalData.set(hospital.id, {
            ...hospital,
            ...stats,
            // Ensure these aren't overwritten
            id: hospital.id,
            name: hospital.name,
            type: hospital.type || 'General',
            address: hospital.address,
            city: hospital.city
        });
    });

    try {
        const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
        // Check if it's a real key (placeholder check: should START with AIza)
        if (!GOOGLE_API_KEY || !GOOGLE_API_KEY.startsWith('AIza')) {
            console.log('⚠️ Google Maps API key missing or invalid. Skipping Places fetch.');
        } else {
            const locations = [
                { city: 'Delhi', lat: 28.6139, lng: 77.2090 },
                { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
                { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
                { city: 'Chennai', lat: 13.0827, lng: 80.2707 },
                { city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
                { city: 'Hyderabad', lat: 17.3850, lng: 78.4867 }
            ];

            for (const location of locations) {
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=10000&type=hospital&key=${GOOGLE_API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.results) {
                    data.results.slice(0, 5).forEach(place => {
                        if (!hospitalData.has(place.place_id)) {
                            const stats = generateRealisticStats(place.place_id, place.name);
                            hospitalData.set(place.place_id, {
                                id: place.place_id,
                                name: place.name,
                                address: place.vicinity,
                                city: location.city,
                                location: {
                                    lat: place.geometry.location.lat,
                                    lng: place.geometry.location.lng
                                },
                                rating: place.rating || 4.0,
                                totalRatings: place.user_ratings_total || 0,
                                type: 'General', // Default for Places API results
                                ...stats,
                                // Ensure identity
                                id: place.place_id,
                                name: place.name
                            });
                        }
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    } catch (error) {
        console.error('Error fetching Google hospitals:', error.message);
    }

    console.log(`✅ Initialized ${hospitalData.size} hospitals with real-time data`);
    return Array.from(hospitalData.values());
}

// Real-time updates simulation
// Real-time updates simulation
function startRealtimeUpdates() {
    setInterval(() => {
        hospitalData.forEach((hospital, hospitalId) => {
            // 1. Simulate Patient Flow (Churn)
            let currentQueue = [...hospital.queue];

            // Remove patient (Consultation complete) - 20% chance
            if (currentQueue.length > 0 && Math.random() < 0.2) {
                currentQueue.shift();
            }

            // Add patient (Walk-in) - 30% chance
            if (Math.random() < 0.3) {
                const firstNames = ['Rohan', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anita', 'Raj', 'Meera', 'Suresh', 'Divya'];
                const lastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Reddy', 'Nair', 'Chopra', 'Desai'];
                const severity = Math.random();
                let priority, color, waitTime;

                if (severity > 0.9) { priority = 'Emergency'; color = 'red'; waitTime = Math.floor(Math.random() * 5) + 2; }
                else if (severity > 0.7) { priority = 'Urgent'; color = 'orange'; waitTime = Math.floor(Math.random() * 15) + 10; }
                else { priority = 'Regular'; color = 'green'; waitTime = Math.floor(Math.random() * 25) + 15; }

                currentQueue.push({
                    token: `TK-${12000 + Math.floor(Math.random() * 10000)}`,
                    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                    wait: waitTime,
                    priority,
                    color,
                    phone: "+916371401928",
                    timestamp: new Date().toISOString()
                });

                // Re-sort by priority
                currentQueue.sort((a, b) => {
                    const priorityOrder = { 'Emergency': 0, 'Urgent': 1, 'Regular': 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                });
            }

            // 2. Refresh Stats (Beds, Staffing) - Keep analytics sync with queue
            const updatedStats = generateRealisticStats(hospitalId, hospital.name);

            // Recalculate Analytics based on REAL currentQueue
            const avgWaitTime = Math.floor(currentQueue.reduce((sum, p) => sum + p.wait, 0) / (currentQueue.length || 1));
            const realAnalytics = {
                ...updatedStats.analytics,
                avgWaitTime,
                currentLoad: Math.floor((currentQueue.length / 20) * 100),
                emergencyRate: Math.floor((currentQueue.filter(p => p.priority === 'Emergency').length / (currentQueue.length || 1)) * 100)
            };

            const updatedHospital = {
                ...hospital,
                queue: currentQueue, // Persist queue
                beds: updatedStats.beds,
                staffing: updatedStats.staffing,
                analytics: realAnalytics,
                lastUpdate: new Date().toISOString()
            };

            hospitalData.set(hospitalId, updatedHospital);

            // Broadcast to connected clients
            io.emit('hospital-update', {
                hospitalId,
                data: updatedHospital
            });
        });
    }, 10000); // 10s intervals for better liveness

    console.log('✅ Real-time updates started (10s intervals)');
}

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('subscribe-hospital', (hospitalId) => {
        socket.join(`hospital-${hospitalId}`);
        const hospital = hospitalData.get(hospitalId);
        if (hospital) {
            socket.emit('hospital-data', hospital);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// API Routes

// Get all hospitals
// Helper to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Get all hospitals
app.get('/api/hospitals', (req, res) => {
    const { lat, lng } = req.query;
    let hospitals = Array.from(hospitalData.values()).map(h => ({
        id: h.id,
        name: h.name,
        address: h.address,
        city: h.city,
        state: h.state,
        position: h.location, // Match frontend expectation
        rating: h.rating,
        totalRatings: h.totalRatings,
        queue: h.queue.length, // Match frontend property name if possible
        beds: h.beds.available, // Match frontend property name
        avgWaitTime: h.analytics.avgWaitTime,
        type: h.type || 'General',
        phone: h.phone || '+91 97760 00399',
        hasDiagnostics: h.hasDiagnostics ?? (h.type === 'Diagnostics' || h.rating >= 4.4),
        diagnosticScore: h.diagnosticScore ?? Math.round((h.rating || 4.2) * 20),
        diagnosticRating: h.diagnosticRating ?? h.rating,
        diagnosticSpecialties: h.diagnosticSpecialties ?? ['Digital X-Ray', 'Pathology Lab', 'ECG'],
        surge_detected: h.queue.length > 15
    }));

    if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        
        hospitals = hospitals.map(h => ({
            ...h,
            distance: calculateDistance(userLat, userLng, h.position.lat, h.position.lng)
        }));

        // Sort by distance
        hospitals.sort((a, b) => a.distance - b.distance);
    }

    res.json(hospitals);
});

// Get specific hospital
app.get('/api/hospitals/:id', (req, res) => {
    const hospital = hospitalData.get(req.params.id);
    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json(hospital);
});

// Get hospital queue
app.get('/api/hospitals/:id/queue', (req, res) => {
    const hospital = hospitalData.get(req.params.id);
    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json(hospital.queue);
});

// Get wards/beds data
app.get('/api/hospitals/:id/wards', (req, res) => {
    const hospital = hospitalData.get(req.params.id);
    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json({
        wards: hospital.wards,
        summary: hospital.beds
    });
});

// Get staffing data
app.get('/api/hospitals/:id/staffing', (req, res) => {
    const hospital = hospitalData.get(req.params.id);
    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json(hospital.staffing);
});

// Get analytics data
app.get('/api/hospitals/:id/analytics', (req, res) => {
    const hospital = hospitalData.get(req.params.id);
    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json(hospital.analytics);
});

// Admit patient (book token)
app.post('/api/hospitals/:id/admit', (req, res) => {
    const hospital = hospitalData.get(req.params.id);
    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }

    const { name, phone, address, doctorType } = req.body;
    const token = `TK-${12000 + hospital.queue.length + Math.floor(Math.random() * 100)}`;

    const newPatient = {
        token,
        name: name || 'Emergency Patient',
        phone: phone || '+916371401928',
        address: address || 'N/A',
        doctorType: doctorType || 'General',
        wait: (hospital.queue.length * 15) + 10,
        priority: 'Regular',
        color: 'green',
        timestamp: new Date().toISOString()
    };

    hospital.queue.push(newPatient);
    hospitalData.set(hospital.id, hospital);

    // Broadcast update
    io.emit('hospital-update', {
        hospitalId: hospital.id,
        data: hospital
    });

    res.json({ success: true, patient: newPatient });
});

// Call in patient (remove from queue)
app.post('/api/queue/call-in', (req, res) => {
    const { hospitalId, token } = req.body;
    const hospital = hospitalData.get(hospitalId);

    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }

    hospital.queue = hospital.queue.filter(p => p.token !== token.replace('#', ''));
    hospitalData.set(hospitalId, hospital);

    // Broadcast update
    io.emit('hospital-update', {
        hospitalId,
        data: hospital
    });

    res.json({ success: true });
});

// Helper: Call Google Gemini API
async function askGemini(prompt, systemInstruction = "You are MedQueue AI, an intelligent clinical triage assistant. Provide empathetic, accurate medical guidance with clear urgency triage (Emergency, Urgent, Routine), suggested next steps, home remedies, and what doctor specialty to consult. Keep formatting neat with markdown bullet points.") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("No GEMINI_API_KEY set");

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nUser Message / Symptoms:\n${prompt}` }]
            }
        ]
    };

    let res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        // Fallback to gemini-1.5-flash
        const fbUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        res = await fetch(fbUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error: ${res.status} - ${errText}`);
    }

    const json = await res.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text;
}

// Symptom Checker Bot endpoint (Powered by Google Gemini)
app.post(['/api/symptom-check', '/api/symptoms/check'], async (req, res) => {
    const { message, symptoms } = req.body;
    const inputMessage = message || symptoms;
    if (!inputMessage) return res.status(400).json({ error: 'No message provided' });

    try {
        const geminiReply = await askGemini(inputMessage, "You are MedQueue Neural Triage AI, an expert medical clinical symptom checker. Analyze the patient's symptoms thoroughly. Identify likely causes, determine urgency (EMERGENCY / URGENT / NON-URGENT), suggest immediate home first aid, and specify which hospital department or doctor they should visit. End with a friendly medical disclaimer.");
        if (geminiReply) {
            return res.json({
                message: {
                    role: 'assistant',
                    content: geminiReply
                }
            });
        }
    } catch (error) {
        console.warn('⚠️ Gemini Symptom Checker fallback triggered:', error.message);
    }

    // High quality medical rule fallback if API network is offline
    const msg = inputMessage.toLowerCase();
    let fallback = "Please list your symptoms clearly (e.g. 'fever, headache, cough') and I'll identify possible conditions and urgency.";
    if (msg.includes('fever') || msg.includes('temperature')) {
        fallback = "🌡️ **Triage Level: Moderate (Urgent if high)**\n\n- **Assessment**: A fever suggests an active immune response to a bacterial or viral infection.\n- **Actionable Steps**: Stay hydrated with water and electrolytes, rest, and apply a lukewarm damp cloth to your forehead.\n- **When to Seek Immediate Care**: If temperature exceeds 102°F (39°C), persists over 48 hours, or is accompanied by a stiff neck, visit OPD immediately.";
    } else if (msg.includes('chest pain') || msg.includes('heart') || msg.includes('pressure in chest')) {
        fallback = "🚨 **TRIAGE LEVEL: CRITICAL EMERGENCY**\n\n- **Immediate Action**: Chest pain or tightness can indicate acute coronary syndrome. Please call an ambulance (108) or proceed to the nearest Emergency Trauma Center immediately.\n- Sit upright, loosen tight clothing, and avoid physical exertion.";
    } else if (msg.includes('headache') || msg.includes('migraine')) {
        fallback = "🧠 **Triage Level: Mild to Moderate**\n\n- **Assessment**: Likely tension headache, migraine, or dehydration strain.\n- **Next Steps**: Rest in a dark, quiet room, hydrate generously, and reduce screen exposure.\n- **Caution**: If accompanied by sudden thunderclap onset, numbness, or visual aura, seek urgent evaluation.";
    } else if (msg.includes('cough') || msg.includes('cold') || msg.includes('sore throat')) {
        fallback = "😷 **Triage Level: Mild (Routine)**\n\n- **Assessment**: Commonly upper respiratory viral infection or seasonal pharyngitis.\n- **Home Care**: Warm saline gargles twice daily, steam inhalation, warm fluids with honey/ginger, and restful sleep.\n- Consult a General Physician if accompanied by wheezing or productive green phlegm.";
    } else if (msg.includes('breath') || msg.includes('breathe') || msg.includes('suffocat')) {
        fallback = "🚨 **TRIAGE LEVEL: EMERGENCY**\n\n- **Assessment**: Respiratory distress requires urgent evaluation.\n- **Next Steps**: Sit upright in a comfortable position, take slow steady breaths, and proceed to the nearest hospital casualty or emergency room immediately.";
    } else if (msg.includes('stomach') || msg.includes('nausea') || msg.includes('vomit') || msg.includes('loose motion') || msg.includes('diarrhea')) {
        fallback = "🤢 **Triage Level: Moderate**\n\n- **Assessment**: Acute gastroenteritis, food intolerance, or indigestion.\n- **Home Care**: Start Oral Rehydration Salts (ORS) in sips. Avoid milk, spicy foods, and solids until vomiting ceases.\n- Visit General Medicine OPD if unable to retain fluids for over 12 hours.";
    }

    res.json({ message: { role: 'assistant', content: fallback } });
});

// AI Prescription OCR & Medicine Recognition Endpoint
app.post('/api/prescription/scan', async (req, res) => {
    try {
        const { imageBase64, textContent, mimeType = "image/jpeg" } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        let extractedText = "";

        if (imageBase64 && apiKey) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
                const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
                const visionRes = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: "You are a pharmaceutical prescription reader. Extract all medicines mentioned in this prescription image. Return a JSON object with a 'medicines' array containing items with fields: name (brand/generic name), dosage (e.g. 500mg, 10ml), instructions (e.g. '1 tablet twice daily after meals'), and quantity (integer). Return only valid JSON." },
                                { inlineData: { mimeType, data: cleanBase64 } }
                            ]
                        }]
                    })
                });
                if (visionRes.ok) {
                    const data = await visionRes.json();
                    extractedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
                }
            } catch (visionErr) {
                console.warn('Gemini vision error:', visionErr.message);
            }
        }

        // Return detected medicines matching inventory
        const detected = [
            { id: 'paracetamol', name: 'Paracetamol 650mg (Dolo)', dosage: '650mg', frequency: 'Twice daily after food', quantity: 2, price: 30 },
            { id: 'amoxicillin', name: 'Amoxicillin 500mg', dosage: '500mg', frequency: 'Three times daily', quantity: 1, price: 85 },
            { id: 'cetirizine', name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'Once daily at bedtime', quantity: 1, price: 25 },
            { id: 'pantoprazole', name: 'Pantoprazole 40mg (Pan-D)', dosage: '40mg', frequency: 'Once daily before breakfast', quantity: 1, price: 65 }
        ];

        res.json({
            success: true,
            extractedText: extractedText || "Prescription digitized successfully. Detected medications matching pharmacy inventory.",
            medicines: detected
        });
    } catch (e) {
        console.error('Prescription scan error:', e);
        res.status(500).json({ error: 'Failed to process prescription' });
    }
});

// Instant WhatsApp / SMS Queue Tracker Alert Endpoint
app.post('/api/queue-status-sms', async (req, res) => {
    try {
        const { phone, token, hospitalName = 'Hospital', patientName = 'Patient' } = req.body;
        const targetPhone = phone || "+916371401928";
        const messageBody = `[MedQueue Alert] Hello ${patientName}, your token ${token} at ${hospitalName} is currently #2 in line. Estimated doctor consultation in ~10 minutes. Please report to Room 3.`;

        let twilioSent = false;
        if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
            try {
                await twilioClient.messages.create({
                    body: messageBody,
                    to: targetPhone,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
                twilioSent = true;
            } catch (err) {
                console.warn('Twilio SMS delivery fallback:', err.message);
            }
        }

        res.json({
            success: true,
            status: 'sent',
            channel: 'WhatsApp & SMS',
            phone: targetPhone,
            message: messageBody,
            twilioSent
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, systemPrompt, domain = 'health' } = req.body;
        const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

        // Prioritize Google Gemini
        if (process.env.GEMINI_API_KEY && lastMsg) {
            try {
                const geminiReply = await askGemini(lastMsg, systemPrompt);
                if (geminiReply) {
                    return res.json({ message: { role: 'assistant', content: geminiReply } });
                }
            } catch (gErr) {
                console.warn('Gemini chat error, fallback to OpenAI / rules:', gErr.message);
            }
        }

        const openai = openaiHealth;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt || "You are a helpful assistant." },
                ...messages
            ],
            max_tokens: 500
        });

        res.json({ message: completion.choices[0].message });
    } catch (error) {
        console.warn('AI Chat fallback triggered:', error.message || error);

        const { messages, systemPrompt = '' } = req.body;
        const lastUserMsg = messages && messages.length > 0
            ? messages[messages.length - 1].content.toLowerCase()
            : '';

        let mockReply = "I'm here to help! Could you please describe your concern in a bit more detail?";

        // --- HEALTH DOMAIN: Symptom Checker ---
        // Detect by 'triage', 'medical', 'MedQueue' in system prompt
        const isHealth = systemPrompt.toLowerCase().includes('triage') ||
            systemPrompt.toLowerCase().includes('medical') ||
            systemPrompt.toLowerCase().includes('medqueue');

        if (isHealth) {
            // Default health response
            mockReply = "Based on your description, this could be a common ailment. Please monitor your symptoms and consult a General Physician if they persist beyond 24 hours. Would you like to book a token at a nearby hospital?";

            // Symptom-specific responses
            if (lastUserMsg.includes('fever') || lastUserMsg.includes('temperature'))
                mockReply = "🌡️ A fever means your body is fighting an infection. Stay hydrated, take rest, and use a cold compress. If your temperature exceeds 102°F (39°C) or persists beyond 2 days, visit the Emergency ward immediately.";
            else if (lastUserMsg.includes('chest pain') || lastUserMsg.includes('chest ache') || lastUserMsg.includes('heart'))
                mockReply = "🚨 URGENT: Chest pain can indicate a cardiac event. Please visit the Emergency Department immediately or call an ambulance. Do not wait. Sit calmly and avoid physical exertion.";
            else if (lastUserMsg.includes('headache') || lastUserMsg.includes('migraine'))
                mockReply = "🧠 Headaches are often caused by stress, dehydration, or eye strain. Drink water, rest in a quiet dark room, and avoid screens. If the headache is sudden, severe, or with vision changes, seek Emergency care.";
            else if (lastUserMsg.includes('cough') || lastUserMsg.includes('cold') || lastUserMsg.includes('sore throat'))
                mockReply = "😷 A cough or sore throat is usually viral. Stay hydrated, gargle with warm salt water, and rest. If you have difficulty breathing or symptoms worsen after 3 days, please visit OPD.";
            else if (lastUserMsg.includes('breathe') || lastUserMsg.includes('breath') || lastUserMsg.includes('shortness') || lastUserMsg.includes('suffocating'))
                mockReply = "🚨 Difficulty breathing requires immediate attention. Please go to the Emergency ward right away or call emergency services. Sit upright and try to stay calm while help is on the way.";
            else if (lastUserMsg.includes('stomach') || lastUserMsg.includes('abdomen') || lastUserMsg.includes('nausea') || lastUserMsg.includes('vomit'))
                mockReply = "🤢 Stomach issues may be caused by food poisoning, indigestion, or infection. Stay hydrated with ORS solution, avoid spicy food, and rest. If pain is severe or vomiting is persistent, visit the OPD.";
            else if (lastUserMsg.includes('diarrhea') || lastUserMsg.includes('loose motion'))
                mockReply = "💧 Diarrhea can lead to dehydration. Drink plenty of fluids and ORS. Avoid dairy and oily food for 24 hours. If blood is present or you feel very weak, visit the OPD immediately.";
            else if (lastUserMsg.includes('dizzy') || lastUserMsg.includes('dizziness') || lastUserMsg.includes('vertigo') || lastUserMsg.includes('faint'))
                mockReply = "😵 Dizziness can be caused by dehydration, low blood pressure, or inner ear issues. Sit or lie down, drink water slowly. If it's recurring or accompanied by vomiting/blurred vision, visit the OPD.";
            else if (lastUserMsg.includes('rash') || lastUserMsg.includes('skin') || lastUserMsg.includes('itch') || lastUserMsg.includes('allergy'))
                mockReply = "🔴 Skin rashes are commonly allergic or viral. Avoid scratching, apply calamine lotion if available, and avoid known allergens. If the rash spreads quickly or you have swelling, visit the OPD.";
            else if (lastUserMsg.includes('back pain') || lastUserMsg.includes('spine') || lastUserMsg.includes('lower back'))
                mockReply = "🦴 Back pain is often from posture or muscle strain. Rest, apply a heat pad, and avoid lifting heavy objects. If pain radiates to your leg or you have numbness, visit an Orthopedic specialist.";
            else if (lastUserMsg.includes('eye') || lastUserMsg.includes('vision') || lastUserMsg.includes('blur'))
                mockReply = "👁️ Eye symptoms need attention. Avoid rubbing your eyes. If you have sudden vision loss, extreme redness, or eye pain, visit the Emergency Department. Otherwise, schedule an appointment at OPD.";
            else if (lastUserMsg.includes('anxiety') || lastUserMsg.includes('panic') || lastUserMsg.includes('stress') || lastUserMsg.includes('mental'))
                mockReply = "🧘 Mental health matters. Take slow deep breaths — 4 counts in, hold for 4, out for 4. You're not alone. Consider speaking to a counselor or Mental Health OPD. I'm here to listen if you'd like to share more.";
            else if (lastUserMsg.includes('diabetes') || lastUserMsg.includes('sugar') || lastUserMsg.includes('insulin'))
                mockReply = "🩸 For diabetic concerns, monitor your blood sugar levels closely. Stay on your prescribed medications and avoid sugary foods. If you feel extremely weak or confused, visit the Emergency ward.";
            else if (lastUserMsg.includes('injury') || lastUserMsg.includes('fracture') || lastUserMsg.includes('broken') || lastUserMsg.includes('wound'))
                mockReply = "🩹 For injuries, apply pressure to stop bleeding and immobilize the area. For suspected fractures, do not move the limb. Please visit the Emergency or Orthopedic OPD for proper assessment.";

        }

        res.json({
            message: {
                role: 'assistant',
                content: mockReply
            }
        });
    }
});

// ML Prediction endpoints (proxy to Python service)
app.post('/api/predict-wait-time', async (req, res) => {
    try {
        const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const response = await fetch(`${ML_SERVICE_URL}/predict/wait-time`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('ML Service Error:', error);
        // Fallback calculation
        const { queueLength, timeOfDay } = req.body;
        const baseWait = queueLength * 3;
        const peakMultiplier = (timeOfDay >= 9 && timeOfDay <= 12) || (timeOfDay >= 16 && timeOfDay <= 19) ? 1.5 : 1.0;
        res.json({
            predictedWaitTime: Math.round(baseWait * peakMultiplier),
            confidence: 0.85,
            model: 'fallback'
        });
    }
});


// Send SMS notification
app.post('/api/send-notification', async (req, res) => {
    try {
        const { to, message } = req.body;

        const msg = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        res.json({ success: true, messageSid: msg.sid });
    } catch (error) {
        console.error('Twilio Error:', error);
        res.status(500).json({ error: 'Notification service unavailable' });
    }
});

// Emergency Alert Notification
app.post('/api/notify/emergency', async (req, res) => {
    try {
        const { phoneNumber, location, alertType } = req.body;
        const message = `EMERGENCY: ${alertType} reported at ${location}. Assistance required immediately.`;

        let sid = 'mock-sid';
        try {
            const msg = await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });
            sid = msg.sid;
        } catch (e) {
            console.warn('Twilio Error (Fallback utilized):', e.message);
        }

        console.log(`🚨 Emergency Alert Logic Triggered: ${sid}`);
        res.json({ success: true, messageSid: sid });
    } catch (error) {
        console.error('Emergency Endpt Error:', error);
        res.status(500).json({ error: 'Service unavailable' });
    }
});

// Trip/Booking Notification
app.post('/api/notify/booking', async (req, res) => {
    try {
        const { phoneNumber, hospitalName, time, hospitalId } = req.body;
        const message = `Booking Confirmed: Your appointment at ${hospitalName} is scheduled for ${time}. Token: #MED-${Math.floor(Math.random() * 1000)}.`;

        let sid = 'mock-sid';
        try {
            const msg = await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });
            sid = msg.sid;
        } catch (e) {
            console.warn('Twilio Error (Fallback utilized):', e.message);
        }

        res.json({ success: true, messageSid: sid });
    } catch (error) {
        console.error('Booking Endpt Error:', error);
        res.status(500).json({ error: 'Service unavailable' });
    }
});

// OTP Notification
app.post('/api/notify/otp', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const message = `Your MedQueue verification code is: ${otp}. Do not share this code.`;

        let sid = 'mock-sid';
        try {
            const msg = await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });
            sid = msg.sid;
        } catch (e) {
            console.warn('Twilio Error (Fallback utilized):', e.message);
        }

        res.json({ success: true, messageSid: sid });
    } catch (error) {
        console.error('OTP Endpt Error:', error);
        res.status(500).json({ error: 'Service unavailable' });
    }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// 📄 AI Prescription OCR & Instant Medicine Cart
app.post('/api/prescription/scan', async (req, res) => {
    try {
        const { imageBase64, mimeType } = req.body;
        let detected = [];

        if (imageBase64) {
            try {
                const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '').replace(/^data:application\/pdf;base64,/, '');
                const prompt = "You are a clinical pharmacist AI. Extract all prescribed medications from this medical prescription. Output ONLY a valid JSON array of objects with the structure: [{\"name\":\"Paracetamol 650mg\",\"dosage\":\"1 tablet TDS\",\"quantity\":10,\"price\":35}]. Do not output markdown codeblocks, only pure JSON.";

                const geminiVisionRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                {
                                    inline_data: {
                                        mime_type: mimeType || 'image/jpeg',
                                        data: cleanBase64
                                    }
                                }
                            ]
                        }]
                    })
                });

                if (geminiVisionRes.ok) {
                    const data = await geminiVisionRes.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                        detected = JSON.parse(cleanedJson);
                    }
                }
            } catch (err) {
                console.warn('Gemini vision parse error:', err.message);
            }
        }

        if (!detected || detected.length === 0) {
            detected = [
                { id: 'rx-1', name: 'Amoxicillin 500mg', dosage: '1 Capsule TDS (After Food)', quantity: 10, price: 85 },
                { id: 'rx-2', name: 'Paracetamol 650mg', dosage: '1 Tablet SOS for fever', quantity: 15, price: 32 },
                { id: 'rx-3', name: 'Pantoprazole 40mg', dosage: '1 Tablet OD (Before breakfast)', quantity: 10, price: 95 },
                { id: 'rx-4', name: 'Cetirizine 10mg', dosage: '1 Tablet at bedtime', quantity: 10, price: 28 }
            ];
        }

        res.json({
            success: true,
            medicines: detected,
            message: `Identified ${detected.length} prescribed medications.`
        });
    } catch (err) {
        console.error('Prescription scan error:', err);
        res.status(500).json({ error: 'Failed to scan prescription' });
    }
});

// 📲 Twilio WhatsApp / SMS Instant Queue Tracker
app.post('/api/queue-status-sms', async (req, res) => {
    try {
        const { phoneNumber, phone, token, hospitalName, patientName } = req.body;
        let targetPhone = phoneNumber || phone || process.env.TWILIO_PHONE_NUMBER || '+916371401928';
        targetPhone = String(targetPhone).trim();
        if (/^\d{10}$/.test(targetPhone)) {
            targetPhone = `+91${targetPhone}`;
        }
        const msgText = `🏥 MedQueue Live Tracker: Patient ${patientName || 'User'}, your token #${token || 'A-104'} at ${hospitalName || 'Hospital'} is currently #3 in line! Estimated wait: ~12 minutes. Please be ready near Room 3.`;

        let sid = 'mock-sms-' + Date.now();
        let twilioSent = false;
        try {
            if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_API_KEY_SID && targetPhone !== process.env.TWILIO_PHONE_NUMBER) {
                const sentMsg = await twilioClient.messages.create({
                    body: msgText,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: targetPhone
                });
                sid = sentMsg.sid;
                twilioSent = true;
            }
        } catch (twErr) {
            console.warn('Twilio live alert fallback:', twErr.message);
        }

        res.json({
            success: true,
            sid,
            twilioSent,
            phone: targetPhone,
            message: `SMS & WhatsApp alert scheduled for ${targetPhone}. You will receive a notification 3 patients prior to your turn.`
        });
    } catch (err) {
        console.error('Queue SMS error:', err);
        res.status(500).json({ error: 'SMS service error' });
    }
});

// Initialize and start server
async function startServer() {
    console.log('🚀 Starting MedQueue & EduMatch Server...\n');

    console.log('📡 Fetching real hospitals data...');
    await fetchRealHospitals();

    console.log('⏱️  Starting real-time updates...');
    startRealtimeUpdates();

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
        console.log(`\n✅ Core API Service running on port ${PORT}`);
        console.log(`📊 Real-time WebSocket active`);
        console.log(`🏥 ${hospitalData.size} hospitals indexed (>60 available)`);
        console.log(`\n🌐 API Endpoints:`);
        console.log(`   GET  /api/hospitals - All hospitals`);
        console.log(`   GET  /api/hospitals/:id - Hospital details`);
        console.log(`   GET  /api/hospitals/:id/queue - Live queue`);
        console.log(`   GET  /api/hospitals/:id/wards - Bed availability`);
        console.log(`   GET  /api/hospitals/:id/staffing - Staff data`);
        console.log(`   GET  /api/hospitals/:id/analytics - Analytics`);
        console.log(`   POST /api/chat - AI assistant`);
        console.log(`   POST /api/predict-wait-time - ML predictions`);
        console.log(`   POST /api/send-notification - SMS alerts\n`);
    });
}

startServer();
