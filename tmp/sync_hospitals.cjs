const fs = require('fs');
const path = require('path');

const serverJsPath = 'c:\\Quick Share\\trithon\\backend\\server.js';
const medicalCentersPath = 'c:\\Quick Share\\trithon\\symptom\\medical_centers.json';

const serverContent = fs.readFileSync(serverJsPath, 'utf8');

// Regex to extract the establishedHospitals array content
// This is a bit tricky due to formatting, but we can look for the start and end of the array
const arrayMatch = serverContent.match(/const establishedHospitals = \[\s*([\s\S]*?)^\s*\];/m);

if (!arrayMatch) {
    console.error("Could not find establishedHospitals array in server.js");
    process.exit(1);
}

const arrayContent = arrayMatch[1];

// Function to safely eval or parse the object strings
// Since server.js is JS, we can attempt to extract individual objects
const hospitalObjects = [];
const objectRegex = /{\s*id:[\s\S]*?}/g;
let m;
while ((m = objectRegex.exec(arrayContent)) !== null) {
    try {
        // Basic cleanup to make it JSON parsable or eval-able
        // Replace single quotes with double, add quotes to keys
        let objStr = m[0]
            .replace(/id:/g, '"id":')
            .replace(/name:/g, '"name":')
            .replace(/address:/g, '"address":')
            .replace(/city:/g, '"city":')
            .replace(/type:/g, '"type":')
            .replace(/location:/g, '"location":')
            .replace(/lat:/g, '"lat":')
            .replace(/lng:/g, '"lng":')
            .replace(/rating:/g, '"rating":')
            .replace(/totalRatings:/g, '"totalRatings":')
            .replace(/'/g, '"');
        
        // Remove trailing commas before closing braces
        objStr = objStr.replace(/,\s*}/g, '}');
        
        const hospital = JSON.parse(objStr);
        hospitalObjects.push(hospital);
    } catch (e) {
        // If JSON.parse fails, it might be due to nested objects or other JS features
        // We'll skip for now or try a more robust approach if needed
        console.warn("Failed to parse hospital object:", e.message);
    }
}

const legacyChennaiHospitals = [
    { tag: "A C Hospital, Chennai", location: [13.0972, 80.2328], Address: "No-8, 3Rd Main Road, United India Nagar, Ayanavaram, Chennai-60023, Tamil Nadu, India" },
    { tag: "A.N.N Hospital, Chennai", location: [13.0356, 80.1659], Address: "81-85, Annai Therasa Street, Valasaravakkam, Chennai, Tamil Nadu, India, 600087" },
    { tag: "A.V. Hospitals, Chennai", location: [13.1092, 80.2884], Address: "# 172, Solaiappan Street, Tondirepet (North Chennai) Near Maharani Theatre, Chennai, Tamil Nadu, India, 600021" },
    { tag: "Aakash Hospital, Chennai", location: [13.1605, 80.3065], Address: "# 393/1, T.H. Road, Tiruvottiyur, Tiruvallur, Chennai, Tamil Nadu, India, 600019" },
    { tag: "Abhijay Hospital (P) Ltd., Chennai", location: [13.1285, 80.2326], Address: "No.22/2, E.S.I Hospital Road, Peravallur, Chennai, Tamil Nadu, India, 600011" },
    { tag: "Aditya Hospital, Chennai", location: [13.0792, 80.2376], Address: "No.7, Barnbay Road, Kilpauk, Chennai-600010, Tamil Nadu, India, 600010" }
];

const allIntents = legacyChennaiHospitals.concat(hospitalObjects.map(h => ({
    tag: `${h.name}, ${h.city}`,
    location: [h.location.lat, h.location.lng],
    Address: h.address
})));

const finalJson = {
    intents: allIntents
};

fs.writeFileSync(medicalCentersPath, JSON.stringify(finalJson, null, 4));
console.log(`Successfully synced ${hospitalObjects.length} hospitals from server.js to medical_centers.json.`);
