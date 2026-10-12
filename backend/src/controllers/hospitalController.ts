import { Request, Response } from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEMO_BIG_HOSPITALS = [
    { id: 'aiims-delhi', name: 'AIIMS New Delhi', address: 'Ansari Nagar, New Delhi', position: { lat: 28.5672, lng: 77.2100 }, beds: 45, occupancy: 95, queue: 12, distance: "Nearby", state: "Delhi" },
    { id: 'apollo-chennai', name: 'Apollo Hospitals Greams Road', address: '21 Greams Lane, Chennai', position: { lat: 13.0604, lng: 80.2496 }, beds: 20, occupancy: 85, queue: 8, distance: "Nearby", state: "Tamil Nadu" },
    { id: 'cmc-vellore', name: 'Christian Medical College', address: 'Ida Scudder Road, Vellore', position: { lat: 12.9248, lng: 79.1352 }, beds: 50, occupancy: 90, queue: 15, distance: "Nearby", state: "Tamil Nadu" },
    { id: 'fortis-delhi', name: 'Fortis Escorts Heart Institute', address: 'Okhla Road, New Delhi', position: { lat: 28.5639, lng: 77.2758 }, beds: 15, occupancy: 80, queue: 5, distance: "Nearby", state: "Delhi" },
    { id: 'tata-mumbai', name: 'Tata Memorial Hospital', address: 'Dr E Borges Road, Mumbai', position: { lat: 19.0041, lng: 72.8443 }, beds: 8, occupancy: 98, queue: 20, distance: "Nearby", state: "Maharashtra" },
    { id: 'hinduja-mumbai', name: 'Hinduja Hospital', address: 'Veer Savarkar Marg, Mumbai', position: { lat: 19.0304, lng: 72.8398 }, beds: 12, occupancy: 70, queue: 4, distance: "Nearby", state: "Maharashtra" },
    { id: 'narayana-bangalore', name: 'Narayana Health City', address: 'Bommasandra Industrial Area, Bangalore', position: { lat: 12.8085, lng: 77.5815 }, beds: 60, occupancy: 60, queue: 2, distance: "Nearby", state: "Karnataka" },
    { id: 'manipal-bangalore', name: 'Manipal Hospital', address: 'HAL Airport Road, Bangalore', position: { lat: 12.9592, lng: 77.6483 }, beds: 25, occupancy: 75, queue: 6, distance: "Nearby", state: "Karnataka" },
    { id: 'medanta-gurugram', name: 'Medanta The Medicity', address: 'CH Baktawar Singh Road, Gurugram', position: { lat: 28.4357, lng: 77.0425 }, beds: 30, occupancy: 82, queue: 10, distance: "Nearby", state: "Haryana" },
    { id: 'pgimer-chandigarh', name: 'PGIMER', address: 'Sector 12, Chandigarh', position: { lat: 30.7629, lng: 76.7744 }, beds: 18, occupancy: 92, queue: 14, distance: "Nearby", state: "Chandigarh" },
    { id: 'sgpgi-lucknow', name: 'SGPGI Lucknow', address: 'Raebareli Road, Lucknow', position: { lat: 26.7450, lng: 80.9348 }, beds: 40, occupancy: 88, queue: 9, distance: "Nearby", state: "Uttar Pradesh" },
    { id: 'max-vaishali', name: 'Max Super Speciality Hospital', address: 'Vaishali, Ghaziabad', position: { lat: 28.6433, lng: 77.3411 }, beds: 22, occupancy: 75, queue: 7, distance: "Nearby", state: "Uttar Pradesh" },
    { id: 'amrita-kochi', name: 'Amrita Hospital', address: 'Ponekkara, Kochi', position: { lat: 10.0333, lng: 76.2952 }, beds: 35, occupancy: 92, queue: 11, distance: "Nearby", state: "Kerala" },
    { id: 'aster-medcity', name: 'Aster Medcity', address: 'Chettichira, Kochi', position: { lat: 10.0469, lng: 76.2731 }, beds: 28, occupancy: 80, queue: 6, distance: "Nearby", state: "Kerala" },
    { id: 'aiims-bhopal', name: 'AIIMS Bhopal', address: 'Saket Nagar, Bhopal', position: { lat: 23.2045, lng: 77.4561 }, beds: 42, occupancy: 85, queue: 10, distance: "Nearby", state: "Madhya Pradesh" },
    { id: 'appolo-hyderabad', name: 'Apollo Jubilee Hills', address: 'Road No 72, Jubilee Hills, Hyderabad', position: { lat: 17.4187, lng: 78.4116 }, beds: 38, occupancy: 90, queue: 13, distance: "Nearby", state: "Telangana" },
    { id: 'care-hyderabad', name: 'Care Hospitals Banjara Hills', address: 'Road No 10, Banjara Hills, Hyderabad', position: { lat: 17.4132, lng: 78.4418 }, beds: 20, occupancy: 78, queue: 8, distance: "Nearby", state: "Telangana" },
    { id: 'apollo-gleneagles-kolkata', name: 'Apollo Gleneagles Hospital', address: 'Canal Circular Road, Kolkata', position: { lat: 22.5694, lng: 88.4019 }, beds: 45, occupancy: 82, queue: 12, distance: "Nearby", state: "West Bengal" },
];

// Load real-world hospitals from the json file in symptom folder
let EXTERNAL_HOSPITALS: any[] = [];
try {
    const filePath = path.join(__dirname, '../../../symptom/medical_centers.json');
    console.log('--- LOADING HOSPITALS FROM:', filePath);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(rawData);
    EXTERNAL_HOSPITALS = jsonData.intents.map((h: any, i: number) => ({
        id: `ext-${i}`,
        name: h.tag,
        address: h.Address || "Local Area",
        position: { lat: h.location[0], lng: h.location[1] },
        beds: Math.floor(Math.random() * 40) + 1,
        occupancy: Math.floor(Math.random() * 100),
        queue: Math.floor(Math.random() * 15),
        distance: "Verified",
        state: h.Address?.includes("Tamil Nadu") ? "Tamil Nadu" : "Verified"
    }));
    console.log('--- LOADED EXTERNAL HOSPITALS:', EXTERNAL_HOSPITALS.length);
} catch (e) {
    console.error("Failed to load external hospitals:", e);
}

const REAL_HOSPITAL_NAMES = [
    "Max Super Speciality Hospital", "Sir Ganga Ram Hospital", "Indraprastha Apollo Hospital", 
    "BLK-Max Super Speciality Hospital", "Medanta - The Medicity", "Fortis Hospital",
    "Artemis Hospital", "Manipal Hospital", "Aster CMI Hospital", "Narayana Multispeciality Hospital",
    "KIMS Hospitals", "Yashoda Hospitals", "Care Hospitals", "Apollo Hospitals",
    "Lilavati Hospital and Research Centre", "Kokilaben Dhirubhai Ambani Hospital", "Nanavati Max Super Speciality",
    "Breach Candy Hospital", "P.D. Hinduja Hospital", "Global Hospital", "Gleneagles Global Health City",
    "MGM Healthcare", "Kauvery Hospital", "MIOT International", "Amrita Hospital",
    "Rajagiri Hospital", "Aster Medcity", "Christian Medical College (CMC)", "Kasturba Hospital",
    "Sanjay Gandhi Post Graduate Institute", "Tata Medical Center", "Peerless Hospital", "AMRI Hospitals"
];

const generateMockNearbyHospitals = (lat: number, lng: number, count: number = 10) => {
    return Array.from({ length: count }).map((_, i) => {
        const randomNameIndex = Math.floor(Math.random() * REAL_HOSPITAL_NAMES.length);
        return {
            id: `mock-nearby-${Date.now()}-${i}`,
            name: REAL_HOSPITAL_NAMES[randomNameIndex],
            address: `Primary Road, Near Central Block, Local Area`,
            position: { 
                lat: lat + (Math.random() - 0.5) * 0.1, 
                lng: lng + (Math.random() - 0.5) * 0.1 
            },
            beds: Math.floor(Math.random() * 50) + 5,
            occupancy: Math.floor(Math.random() * 100),
            queue: Math.floor(Math.random() * 20),
            distance: "Nearby", 
            state: "Local"
        };
    });
};

export const hospitalController = {
    getAllHospitals: async (req: Request, res: Response) => {
        const lat = parseFloat(req.query.lat as string) || 20.5937;
        const lng = parseFloat(req.query.lng as string) || 78.9629;
        const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao";
        
        let nearbyHospitals: any[] = [];
        
        try {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=hospital&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json() as any;
            
            if (data.results && data.results.length > 0) {
                nearbyHospitals = data.results.map((place: any) => ({
                    id: place.place_id,
                    name: place.name,
                    address: place.vicinity || "Local Area",
                    position: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
                    beds: Math.floor(Math.random() * 50) + 10,
                    occupancy: Math.floor(Math.random() * 100),
                    queue: Math.floor(Math.random() * 20),
                    distance: "Nearby",
                    state: "Local Area"
                }));
            } else {
                // Try OSM fallback
                try {
                    const overpassUrl = "http://overpass-api.de/api/interpreter";
                    const overpassQuery = `[out:json];node(around:50000,${lat},${lng})[amenity=hospital];out 15;`;
                    const osmResponse = await fetch(`${overpassUrl}?data=${encodeURIComponent(overpassQuery)}`);
                    const osmData = await osmResponse.json() as any;
                    if (osmData.elements) {
                        nearbyHospitals = osmData.elements.map((place: any) => ({
                            id: `osm-${place.id}`,
                            name: place.tags.name || "Nearby Medical Center",
                            address: place.tags["addr:full"] || "Verified Local Hub",
                            position: { lat: place.lat, lng: place.lon },
                            beds: Math.floor(Math.random() * 50) + 10,
                            occupancy: Math.floor(Math.random() * 100),
                            queue: Math.floor(Math.random() * 20),
                            distance: "Verified",
                            state: "Local Area"
                        }));
                    }
                } catch (e) {}
            }
        } catch (error) {}

        // Combine everything: Demo + Externals + Dynamic Nearby
        const combined = [...DEMO_BIG_HOSPITALS, ...EXTERNAL_HOSPITALS, ...nearbyHospitals];
        const unique = Array.from(new Map(combined.map(h => [h.name, h])).values());
        
        console.log(`--- API RETURNING ${unique.length} HOSPITALS`);
        res.json(unique);
    },
    
    getHospitalById: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            // Check if it's one of our demo or external hospitals first
            const localHospital = [...DEMO_BIG_HOSPITALS, ...EXTERNAL_HOSPITALS].find(h => h.id === id);
            if (localHospital) {
                return res.json({
                    ...localHospital,
                    phone: "N/A"
                });
            }

            const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao";
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json() as any;
            
            if (data.result) {
                const place = data.result;
                const hospital = {
                    id: place.place_id,
                    name: place.name,
                    address: place.formatted_address || place.vicinity,
                    phone: place.formatted_phone_number || "N/A",
                    position: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
                    beds: Math.floor(Math.random() * 50) + 10,
                    occupancy: Math.floor(Math.random() * 100),
                    queue: Math.floor(Math.random() * 20)
                };
                res.json(hospital);
            } else {
                res.status(404).json({ error: 'Hospital not found' });
            }
        } catch (error) {
            console.error("Failed to fetch hospital details:", error);
            res.status(500).json({ error: 'Failed to fetch hospital details' });
        }
    }
};
