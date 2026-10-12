const fs = require('fs');
const path = require('path');

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir"
]; // 30 states

const counts = states.map((s, i) => i < 10 ? 4 : 3);
let idCounter = 1;

const latLngBase = {
  "Andhra Pradesh": { lat: 16.5, lng: 80.6 },
  "Arunachal Pradesh": { lat: 27.1, lng: 93.6 },
  "Assam": { lat: 26.1, lng: 91.7 },
  "Bihar": { lat: 25.6, lng: 85.1 },
  "Chhattisgarh": { lat: 21.2, lng: 81.6 },
  "Goa": { lat: 15.4, lng: 73.8 },
  "Gujarat": { lat: 23.0, lng: 72.5 },
  "Haryana": { lat: 29.0, lng: 76.0 },
  "Himachal Pradesh": { lat: 31.1, lng: 77.1 },
  "Jharkhand": { lat: 23.3, lng: 85.3 },
  "Karnataka": { lat: 12.9, lng: 77.5 },
  "Kerala": { lat: 8.5, lng: 76.9 },
  "Madhya Pradesh": { lat: 23.2, lng: 77.4 },
  "Maharashtra": { lat: 19.0, lng: 72.8 },
  "Manipur": { lat: 24.8, lng: 93.9 },
  "Meghalaya": { lat: 25.5, lng: 91.8 },
  "Mizoram": { lat: 23.7, lng: 92.7 },
  "Nagaland": { lat: 25.6, lng: 94.1 },
  "Odisha": { lat: 20.2, lng: 85.8 },
  "Punjab": { lat: 30.9, lng: 75.8 },
  "Rajasthan": { lat: 26.9, lng: 75.8 },
  "Sikkim": { lat: 27.3, lng: 88.6 },
  "Tamil Nadu": { lat: 13.0, lng: 80.2 },
  "Telangana": { lat: 17.3, lng: 78.4 },
  "Tripura": { lat: 23.8, lng: 91.2 },
  "Uttar Pradesh": { lat: 26.8, lng: 80.9 },
  "Uttarakhand": { lat: 30.3, lng: 78.0 },
  "West Bengal": { lat: 22.5, lng: 88.3 },
  "Delhi": { lat: 28.6, lng: 77.2 },
  "Jammu & Kashmir": { lat: 34.0, lng: 74.8 }
};

const hospitals = [];
states.forEach((state, idx) => {
  const count = counts[idx];
  for (let i = 0; i < count; i++) {
    const lat = latLngBase[state].lat + (Math.random() * 0.5 - 0.25);
    const lng = latLngBase[state].lng + (Math.random() * 0.5 - 0.25);
    const beds = Math.floor(Math.random() * 150);
    const distance = (Math.random() * 20 + 1).toFixed(1) + " km";
    hospitals.push({
      id: idCounter++,
      state: state,
      name: state + " Hospital " + (i + 1),
      position: { lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) },
      beds: beds,
      distance: distance,
      address: "Main Road " + (i + 1) + ", " + state,
      phone: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000)
    });
  }
});

let outputTS = "// Huge mock hospitals data - 100 hospitals across India\nconst allHospitals = [\n";
hospitals.forEach(h => {
  outputTS += "    { id: " + h.id + ", state: '" + h.state + "', name: \"" + h.name + "\", position: { lat: " + h.position.lat + ", lng: " + h.position.lng + " }, beds: " + h.beds + ", distance: \"" + h.distance + "\", address: \"" + h.address + "\", phone: \"" + h.phone + "\" },\n";
});
outputTS = outputTS.slice(0, -2) + "\n];";

// Modify file frontend
const frontendPath = path.join(__dirname, 'src', 'pages', 'HospitalFinder.tsx');
let frontendData = fs.readFileSync(frontendPath, 'utf8');

const regex = /\/\/ Huge mock hospitals data - 100 hospitals across India[\s\S]*?\];/;
frontendData = frontendData.replace(regex, outputTS);
fs.writeFileSync(frontendPath, frontendData);
console.log("Updated HospitalFinder.tsx");

const backendPath = path.join(__dirname, 'backend', 'src', 'controllers', 'hospitalController.ts');
let backendData = fs.readFileSync(backendPath, 'utf8');

let outputBackend = "const hospitalData = [\n";
hospitals.forEach(h => {
  const occ = Math.floor(Math.random() * 100);
  const queue = Math.floor(Math.random() * 50);
  outputBackend += "    { id: 'hosp" + h.id + "', name: \"" + h.name + "\", address: \"" + h.address + "\", beds: " + h.beds + ", occupancy: " + occ + ", queue: " + queue + ", state: \"" + h.state + "\" },\n";
});
outputBackend = outputBackend.slice(0, -2) + "\n];";

let backendRegex = /const hospitalData = \[[\s\S]*?\];/;
backendData = backendData.replace(backendRegex, outputBackend);
fs.writeFileSync(backendPath, backendData);
console.log("Updated backend hospitalController.ts");
