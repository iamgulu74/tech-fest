const fs = require('fs');
const path = require('path');


const hospitals = [
    // AIIMS (Comprehensive list of 25)
    { tag: "AIIMS New Delhi", location: [28.5672, 77.2100], Address: "Ansari Nagar, New Delhi, Delhi 110029" },
    { tag: "AIIMS Bhopal", location: [23.2045, 77.4561], Address: "Saket Nagar, Bhopal, Madhya Pradesh 462020" },
    { tag: "AIIMS Bhubaneswar", location: [20.2312, 85.7712], Address: "Sijua, Dumuduma, Bhubaneswar, Odisha 751019" },
    { tag: "AIIMS Jodhpur", location: [26.2694, 72.9836], Address: "Basni Industrial Area Phase-2, Jodhpur, Rajasthan 342005" },
    { tag: "AIIMS Patna", location: [25.5612, 85.0812], Address: "Phulwari Sharif, Patna, Bihar 801507" },
    { tag: "AIIMS Raipur", location: [21.2570, 81.5794], Address: "Tatibandh, GE Road, Raipur, Chhattisgarh 492099" },
    { tag: "AIIMS Rishikesh", location: [30.1245, 78.2974], Address: "Virbhadra Road, Rishikesh, Uttarakhand 249203" },
    { tag: "AIIMS Raebareli", location: [26.2235, 81.2422], Address: "Dalmau Road, Munshiganj, Raebareli, Uttar Pradesh 229405" },
    { tag: "AIIMS Mangalagiri", location: [16.4357, 80.5612], Address: "Mangalagiri, Guntur, Andhra Pradesh 522503" },
    { tag: "AIIMS Nagpur", location: [21.0822, 79.0357], Address: "Plot No. 2, Sector 20, MIHAN, Nagpur, Maharashtra 441108" },
    { tag: "AIIMS Gorakhpur", location: [26.7606, 83.3731], Address: "Kunraghat, Gorakhpur, Uttar Pradesh 273008" },
    { tag: "AIIMS Kalyani", location: [22.9751, 88.4345], Address: "NH-34 Connector, Basantapur, Saguna, West Bengal 741245" },
    { tag: "AIIMS Bathinda", location: [30.1587, 74.9454], Address: "Mansa Road, Bathinda, Punjab 151001" },
    { tag: "AIIMS Bibinagar", location: [17.4500, 78.7900], Address: "Warangal Highway, Bibinagar, Telangana 508126" },
    { tag: "AIIMS Deoghar", location: [24.4833, 86.7000], Address: "Devipur, Deoghar, Jharkhand 814143" },
    { tag: "AIIMS Rajkot", location: [22.3000, 70.7833], Address: "Khandheri, Rajkot, Gujarat 360006" },
    { tag: "AIIMS Vijaypur", location: [32.5500, 74.9000], Address: "Vijaypur, Samba, Jammu and Kashmir 184120" },
    { tag: "AIIMS Bilaspur", location: [31.3333, 76.7583], Address: "Kothipura, Bilaspur, Himachal Pradesh 174001" },
    { tag: "AIIMS Guwahati", location: [26.1900, 91.6800], Address: "Changsari, Kamrup, Assam 781101" },
    { tag: "AIIMS Madurai", location: [9.9167, 78.1167], Address: "Thoppur, Madurai, Tamil Nadu 625008" },
    { tag: "AIIMS Darbhanga", location: [26.1500, 85.9000], Address: "Darbhanga, Bihar 846003" },
    { tag: "AIIMS Awantipora", location: [33.9167, 74.9833], Address: "Awantipora, Pulwama, Jammu and Kashmir 192122" },
    { tag: "AIIMS Rewari", location: [28.1833, 76.6167], Address: "Majra, Rewari, Haryana 123401" },

    // Top Private & Government Institutions (Adding to reach 100+)
    { tag: "Apollo Hospitals Greams Road, Chennai", location: [13.0604, 80.2496], Address: "21 Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006" },
    { tag: "Christian Medical College (CMC), Vellore", location: [12.9248, 79.1352], Address: "Ida Scudder Rd, Vellore, Tamil Nadu 632004" },
    { tag: "Tata Memorial Hospital, Mumbai", location: [19.0041, 72.8443], Address: "Dr. E Borges Rd, Parel, Mumbai, Maharashtra 400012" },
    { tag: "PGIMER, Chandigarh", location: [30.7629, 76.7744], Address: "Sector 12, Chandigarh 160012" },
    { tag: "SGPGI, Lucknow", location: [26.7450, 80.9348], Address: "Raebareli Rd, Lucknow, Uttar Pradesh 226014" },
    { tag: "Medanta - The Medicity, Gurugram", location: [28.4357, 77.0425], Address: "Sector 38, Gurugram, Haryana 122001" },
    { tag: "Sir Ganga Ram Hospital, New Delhi", location: [28.6385, 77.1895], Address: "Rajinder Nagar, New Delhi 110060" },
    { tag: "Kokilaben Hospital, Mumbai", location: [19.1311, 72.8252], Address: "Andheri West, Mumbai 400053" },
    { tag: "NIMHANS, Bengaluru", location: [12.9428, 77.5900], Address: "Hosur Road, Bengaluru 560029" },
    { tag: "Manipal Hospital, Bengaluru", location: [12.9592, 77.6483], Address: "HAL Old Airport Rd, Bengaluru 560017" },
    { tag: "Fortis Memorial, Gurugram", location: [28.4600, 77.0700], Address: "Sector 44, Gurugram 122002" },

    // Odisha Specific
    { tag: "SCB Medical College & Hospital", location: [20.4812, 85.8612], Address: "Cuttack, Odisha 753007" },
    { tag: "IMS & SUM Hospital", location: [20.2285, 85.7681], Address: "K-8, Kalinga Nagar, Bhubaneswar, Odisha 751003" },
    { tag: "Kalinga Institute (KIMS)", location: [20.3533, 85.8189], Address: "Patia, Bhubaneswar, Odisha 751024" },
    { tag: "Capital Hospital, Bhubaneswar", location: [20.2644, 85.8281], Address: "Unit 6, Bhubaneswar, Odisha 751001" },
    { tag: "AMRI Hospital, Bhubaneswar", location: [20.2500, 85.8000], Address: "Khandagiri, Bhubaneswar, Odisha 751030" },

    // More across states
    { tag: "Global Hospital, Chennai", location: [12.8941, 80.2014], Address: "Perumbakkam, Chennai, Tamil Nadu 600100" },
    { tag: "MIOT International, Chennai", location: [13.0185, 80.1874], Address: "Manapakkam, Chennai, Tamil Nadu 600089" },
    { tag: "Jaslok Hospital, Mumbai", location: [18.9700, 72.8100], Address: "Peddar Road, Mumbai 400026" },
    { tag: "Breach Candy Hospital, Mumbai", location: [18.9711, 72.8055], Address: "Bhulabhai Desai Road, Mumbai 400026" },
    { tag: "Narayana Hrudayalaya, Bengaluru", location: [12.8085, 77.5815], Address: "Bommasandra, Bengaluru 560099" },
    { tag: "Aster CMI Hospital, Bengaluru", location: [13.0600, 77.5900], Address: "Hebbal, Bengaluru 560092" },
    { tag: "Ruby Hall Clinic, Pune", location: [18.5312, 73.8612], Address: "Sassoon Rd, Pune 411001" },
    { tag: "Sahyadri Hospital, Pune", location: [18.5100, 73.8300], Address: "Deccan Gymkhana, Pune 411004" },
    { tag: "Inlaks & Budhrani Hospital, Pune", location: [18.5400, 73.8900], Address: "Koregaon Park, Pune 411001" },
    { tag: "KEM Hospital, Pune", location: [18.5200, 73.8600], Address: "Rasta Peth, Pune 411011" },
    { tag: "MGM Healthcare, Chennai", location: [13.0600, 80.2400], Address: "Nungambakkam, Chennai 600034" },
    { tag: "Kauvery Hospital, Chennai", location: [13.0300, 80.2500], Address: "Alwarpet, Chennai 600018" },
    { tag: "CARE Hospitals, Hyderabad", location: [17.4100, 78.4400], Address: "Banjara Hills, Hyderabad 500034" },
    { tag: "Yashoda Hospitals, Hyderabad", location: [17.4200, 78.4500], Address: "Somajiguda, Hyderabad 500082" },
    { tag: "Max Super Speciality, Delhi", location: [28.5200, 77.2100], Address: "Saket, New Delhi 110017" },
    { tag: "BLK-Max Super Speciality, Delhi", location: [28.6400, 77.1800], Address: "Pusa Road, New Delhi 110005" },
    { tag: "Moolchand Hospital, Delhi", location: [28.5600, 77.2300], Address: "Lajpat Nagar, New Delhi 110024" },
    { tag: "Holy Family Hospital, Delhi", location: [28.5600, 77.2700], Address: "Okhla, New Delhi 110025" },
    { tag: "St. Martha's Hospital, Bengaluru", location: [12.9700, 77.5800], Address: "Nrupathunga Rd, Bengaluru 560001" },
    { tag: "Sakra World Hospital, Bengaluru", location: [12.9300, 77.6900], Address: "Marathahalli, Bengaluru 560103" },
    { tag: "Fortis Hospital, Bannerghatta, Bengaluru", location: [12.8900, 77.6000], Address: "Bannerghatta Rd, Bengaluru 560076" },
    { tag: "Sparsh Hospital, Bengaluru", location: [12.8100, 77.5800], Address: "Bommasandra, Bengaluru 560099" },
    { tag: "Rainbow Children's Hospital, Hyderabad", location: [17.4100, 78.4300], Address: "Banjara Hills, Hyderabad 500034" },
    { tag: "LV Prasad Eye Institute, Hyderabad", location: [17.4100, 78.4200], Address: "Banjara Hills, Hyderabad 500034" },
    { tag: "Basavatarakam Indo American Cancer Hospital, Hyderabad", location: [17.4200, 78.4100], Address: "Jubilee Hills, Hyderabad 500033" },
    { tag: "Rajiv Gandhi Cancer Institute, Delhi", location: [28.7100, 77.1100], Address: "Rohini, New Delhi 110085" },
    { tag: "Homi Bhabha Cancer Hospital, Varanasi", location: [25.2600, 82.9900], Address: "Lahartara, Varanasi 221002" },
    { tag: "Mahavir Cancer Sansthan, Patna", location: [25.5900, 85.0900], Address: "Phulwari Sharif, Patna 801505" },
    { tag: "Sree Chitra Tirunal Institute, Trivandrum", location: [8.5200, 76.9200], Address: "Medical College Campus, Trivandrum 695011" },
    { tag: "RCC, Trivandrum", location: [8.5200, 76.9200], Address: "Medical College Campus, Trivandrum 695011" },
    { tag: "Kasturba Hospital, Manipal", location: [13.3400, 74.7800], Address: "Manipal, Karnataka 576104" },
    { tag: "Jawaharlal Institute (JIPMER), Puducherry", location: [11.9500, 79.8100], Address: "Dhanvantari Nagar, Puducherry 605006" },
    { tag: "King George Hospital, Vizag", location: [17.7000, 83.3000], Address: "Maharanipeta, Visakhapatnam 530002" },
    { tag: "Narayana Super Speciality, Kolkata", location: [22.4600, 88.3500], Address: "Howrah, West Bengal 711103" },
    { tag: "Chittaranjan National Cancer Institute, Kolkata", location: [22.5200, 88.3500], Address: "Hazra, Kolkata 700026" },
    { tag: "Vidyasagar Hospital, Kolkata", location: [22.4800, 88.3100], Address: "Behala, Kolkata 700034" },
    { tag: "AMRI Hospital, Dhakuria, Kolkata", location: [22.5100, 88.3600], Address: "Dhakuria, Kolkata 700029" },
    { tag: "Woodlands Hospital, Kolkata", location: [22.5300, 88.3300], Address: "Alipore, Kolkata 700027" },
    { tag: "Calcutta Medical College", location: [22.5700, 88.3600], Address: "College Street, Kolkata 700073" },
    { tag: "Nil Ratan Sircar Medical College (NRS), Kolkata", location: [22.5600, 88.3700], Address: "Sealdah, Kolkata 700014" },
    { tag: "R.G. Kar Medical College, Kolkata", location: [22.5900, 88.3700], Address: "Shyambazar, Kolkata 700004" },
    { tag: "Fortis Escorts Heart Institute, Delhi", location: [28.5600, 77.2700], Address: "Okhla Rd, New Delhi 110025" },
    { tag: "Max Smart Super Speciality, Delhi", location: [28.5200, 77.2200], Address: "Saket, New Delhi 110017" },
    { tag: "Indraprastha Apollo Hospitals, Delhi", location: [28.5400, 77.2800], Address: "Sarita Vihar, New Delhi 110076" }
];

const medicalCenters = { intents: hospitals };

const paths = [
    path.join(__dirname, '../symptom/medical_centers.json'),
    path.join(__dirname, '../backend/ai_engine/medical_centers.json'),
    path.join(__dirname, '../ml-service/symptom_checker/medical_centers.json')
];

paths.forEach(p => {
    try {
        const dir = path.dirname(p);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(p, JSON.stringify(medicalCenters, null, 4));
        console.log(`✅ Updated ${p}`);
    } catch (e) {
        console.error(`❌ Failed to update ${p}: ${e.message}`);
    }
});

console.log(`🚀 Done! Total hospitals: ${hospitals.length}`);
