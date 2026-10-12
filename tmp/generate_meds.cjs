const fs = require('fs');

const medicines = [
    // Fever & Cold (15)
    { name: 'Paracetamol 650', category: 'Fever', disease: ['Fever', 'Chills', 'Headache'], price: 30 },
    { name: 'Dolo 650', category: 'Fever', disease: ['Fever', 'Bodyache', 'Chills'], price: 32 },
    { name: 'Calpol 500', category: 'Fever', disease: ['High Fever', 'Headache'], price: 18 },
    { name: 'Crocin Advance', category: 'Fever', disease: ['Fever', 'Headache'], price: 25 },
    { name: 'Panadol 500', category: 'Fever', disease: ['Mild Fever', 'Pain'], price: 40 },
    { name: 'Vicks Action 500', category: 'Cold', disease: ['Cold', 'Cough', 'Bodyache'], price: 55 },
    { name: 'Benadryl Syrup', category: 'Cold', disease: ['Dry Cough', 'Sore Throat'], price: 105 },
    { name: 'Alex Syrup', category: 'Cold', disease: ['Cough', 'Nasal Congestion'], price: 120 },
    { name: 'Ascoril LS', category: 'Cold', disease: ['Cough', 'Congestion'], price: 115 },
    { name: 'Honitus Syrup', category: 'Cold', disease: ['Ayurvedic Cough Relief'], price: 95 },
    { name: 'Koflet Syrup', category: 'Cold', disease: ['Allergy Cough', 'Nasal Congestion'], price: 85 },
    { name: 'Cofsy Syrup', category: 'Cold', disease: ['Wet Cough', 'Sore Throat'], price: 75 },
    { name: 'Cheston Cold', category: 'Cold', disease: ['Nasal Block', 'Runny Nose'], price: 45 },
    { name: 'Solvin De', category: 'Cold', disease: ['Chronic Cough', 'Cold'], price: 65 },
    { name: 'Zingavita Vitamin C', category: 'Cold', disease: ['Cold Prevention', 'Immunity'], price: 350 },

    // Pain Relief (15)
    { name: 'Combiflam', category: 'Pain Relief', disease: ['Muscle Pain', 'Inflammation'], price: 48 },
    { name: 'Brufen 400', category: 'Pain Relief', disease: ['Joint Pain', 'Back Pain'], price: 15 },
    { name: 'Saridon', category: 'Pain Relief', disease: ['Severe Headache', 'Stress'], price: 12 },
    { name: 'Disprin', category: 'Pain Relief', disease: ['Headache Relief', 'Pain'], price: 10 },
    { name: 'Dart Tablets', category: 'Pain Relief', disease: ['Toothache', 'Headache'], price: 20 },
    { name: 'Ultracet', category: 'Pain Relief', disease: ['Severe Body Pain', 'Muscle Aches'], price: 180 },
    { name: 'Volini Spray', category: 'Pain Relief', disease: ['Muscle Spasm', 'Back ache'], price: 125 },
    { name: 'Moov Gel', category: 'Pain Relief', disease: ['Back Pain', 'Muscle Pull'], price: 95 },
    { name: 'Fastum Gel', category: 'Pain Relief', disease: ['Joint Inflammation', 'Knee Pain'], price: 210 },
    { name: 'Naproxen 250', category: 'Pain Relief', disease: ['Arthritis Pain', 'Joint Stiffness'], price: 85 },
    { name: 'Tramadol 50', category: 'Pain Relief', disease: ['Severe Pain Management'], price: 140 },
    { name: 'Meftal Forte', category: 'Pain Relief', disease: ['Period Pain', 'Cramps'], price: 55 },
    { name: 'Nimulid Oral Gel', category: 'Pain Relief', disease: ['Gingivitis', 'Mouth Pain'], price: 35 },
    { name: 'Ibuprofen 200', category: 'Pain Relief', disease: ['Mild Pain', 'Swelling'], price: 12 },
    { name: 'Piroxicam Gel', category: 'Pain Relief', disease: ['Sports Injury', 'Sprains'], price: 110 },

    // Digestion & Acidity (15)
    { name: 'Digene Tablets', category: 'Digestion', disease: ['Acidity', 'Gas', 'Bloating'], price: 22 },
    { name: 'Eno Lemon Sachet', category: 'Digestion', disease: ['Instant Acidity Relief'], price: 10 },
    { name: 'Gelusil MPS', category: 'Digestion', disease: ['Heartburn', 'Stomach Gas'], price: 115 },
    { name: 'Pantoprazole 40', category: 'Digestion', disease: ['GERD', 'Ulcer Prevention'], price: 125 },
    { name: 'Rabeprazole 20', category: 'Digestion', disease: ['Gastric Problems'], price: 140 },
    { name: 'Omeprazole 20', category: 'Digestion', disease: ['Acid Reflux', 'Bloating'], price: 85 },
    { name: 'Pudin Hara Capsules', category: 'Digestion', disease: ['Stomach Ache', 'Bloating'], price: 25 },
    { name: 'Isabgol Powder', category: 'Digestion', disease: ['Constipation', 'Bowel movement'], price: 195 },
    { name: 'Pet Saffa Powder', category: 'Digestion', disease: ['Stomach Cleanse', 'Gas'], price: 95 },
    { name: 'Kayam Churna', category: 'Digestion', disease: ['Severe Constipation'], price: 110 },
    { name: 'Dulcoflex 5mg', category: 'Digestion', disease: ['Laxative', 'Stool Softener'], price: 12 },
    { name: 'Zantac 150', category: 'Digestion', disease: ['Heartburn', 'Indigestion'], price: 45 },
    { name: 'Domstal 10mg', category: 'Digestion', disease: ['Vomiting', 'Nausea'], price: 35 },
    { name: 'Ondem MD 4', category: 'Digestion', disease: ['Nausea Relief', 'Motion Sickness'], price: 55 },
    { name: 'Sporolac Sachet', category: 'Digestion', disease: ['Diarrhea', 'Probiotic'], price: 48 },

    // Allergy & Respiratory (15)
    { name: 'Cetirizine 10', category: 'Allergy', disease: ['Itching', 'Runny Nose'], price: 12 },
    { name: 'Allegra 120', category: 'Allergy', disease: ['Hay Fever', 'Skin Allergy'], price: 185 },
    { name: 'Avil 25', category: 'Allergy', disease: ['Itching', 'Cold Allergy'], price: 15 },
    { name: 'Atarax 25', category: 'Allergy', disease: ['Skin Hives', 'Anxiety Itch'], price: 125 },
    { name: 'Montelukast 10', category: 'Allergy', disease: ['Asthma Allergy', 'Sneezing'], price: 145 },
    { name: 'Loratadine 10', category: 'Allergy', disease: ['Seasonal Allergy', 'Dust'], price: 95 },
    { name: 'Otrivin Nasal Drop', category: 'Allergy', disease: ['Blocked Nose', 'Sinusitis'], price: 85 },
    { name: 'Nasivion Adult', category: 'Allergy', disease: ['Nasal Congestion'], price: 75 },
    { name: 'Levocetirizine 5', category: 'Allergy', disease: ['Persistent Cold', 'Itching'], price: 45 },
    { name: 'Bilastine 20', category: 'Allergy', disease: ['Urticaria', 'Nasal Allergy'], price: 165 },
    { name: 'Clarinex 5mg', category: 'Allergy', disease: ['Indoor Allergies'], price: 210 },
    { name: 'Fluticasone Spray', category: 'Allergy', disease: ['Nasal Inflammation'], price: 340 },
    { name: 'Asthalin Inhaler', category: 'Allergy', disease: ['Breathing Difficulty', 'Asthma'], price: 155 },
    { name: 'Aerocort Inhaler', category: 'Allergy', disease: ['Bronchospasm', 'Wheezing'], price: 195 },
    { name: 'Duolin Rotacaps', category: 'Allergy', disease: ['COPD', 'Shortness of Breath'], price: 110 },

    // Skin Care (15)
    { name: 'Betadine 10%', category: 'Skin Care', disease: ['Cuts', 'Minor Wounds'], price: 105 },
    { name: 'Soframycin Cream', category: 'Skin Care', disease: ['Infected Wounds', 'Burns'], price: 45 },
    { name: 'Burnol Cream', category: 'Skin Care', disease: ['Minor Burns', 'Heat Rash'], price: 65 },
    { name: 'Neosporin Ointment', category: 'Skin Care', disease: ['Antibacterial', 'Scratches'], price: 120 },
    { name: 'Itch Guard Plus', category: 'Skin Care', disease: ['Fungal Infection', 'Itch'], price: 95 },
    { name: 'B-Tex Ointment', category: 'Skin Care', disease: ['Eczema', 'Ringworm'], price: 25 },
    { name: 'Calamine Lotion', category: 'Skin Care', disease: ['Sunburn', 'Prickly Heat'], price: 145 },
    { name: 'Dettol Antiseptic', category: 'Skin Care', disease: ['Disinfection', 'Washing'], price: 165 },
    { name: 'Savlon Liquid', category: 'Skin Care', disease: ['Wound Cleansing'], price: 140 },
    { name: 'Zincoderm G', category: 'Skin Care', disease: ['Dermatitis', 'Skin Rash'], price: 85 },
    { name: 'Fourderm Cream', category: 'Skin Care', disease: ['Skin Infection', 'Mixed Allergy'], price: 115 },
    { name: 'Elocon Cream', category: 'Skin Care', disease: ['Psoriasis', 'Severe Itching'], price: 245 },
    { name: 'Clotrimazole Dusting Powder', category: 'Skin Care', disease: ['Sweat Rash', 'Athletes Foot'], price: 135 },
    { name: 'Luliconazole Cream', category: 'Skin Care', disease: ['Ringworm', 'Skin Fungus'], price: 195 },
    { name: 'Boro Plus Cream', category: 'Skin Care', disease: ['Dry Skin', 'Cuts'], price: 65 },

    // Diabetes & Heart (15)
    { name: 'Metformin 500', category: 'Diabetes', disease: ['Type 2 Diabetes', 'Sugar'], price: 15 },
    { name: 'Glycomet GP 1', category: 'Diabetes', disease: ['High Blood Sugar'], price: 115 },
    { name: 'Januvia 50', category: 'Diabetes', disease: ['Oral Diabetes Care'], price: 450 },
    { name: 'Galvus Met 50/500', category: 'Diabetes', disease: ['Combined Glucose Control'], price: 380 },
    { name: 'Teneligliptin 20', category: 'Diabetes', disease: ['Post-meal Sugar Control'], price: 95 },
    { name: 'Amlodipine 5', category: 'Heart Care', disease: ['High Blood Pressure', 'BP'], price: 12 },
    { name: 'Telmisartan 40', category: 'Heart Care', disease: ['Hypertension', 'Cardiac Care'], price: 110 },
    { name: 'Atorvastatin 10', category: 'Heart Care', disease: ['High Cholesterol'], price: 85 },
    { name: 'Rosuvastatin 10', category: 'Heart Care', disease: ['Lipid Control', 'Heart Health'], price: 125 },
    { name: 'Ramipril 5mg', category: 'Heart Care', disease: ['After Cardiac Surgery', 'BP'], price: 145 },
    { name: 'Aspirin 75mg', category: 'Heart Care', disease: ['Blood Thinner', 'Stroke Prevention'], price: 15 },
    { name: 'Concor 5mg', category: 'Heart Care', disease: ['Congestive Heart Failure'], price: 180 },
    { name: 'Metoprolol 25', category: 'Heart Care', disease: ['Angina', 'Heart Rate Control'], price: 75 },
    { name: 'Hydralazine 25', category: 'Heart Care', disease: ['Severe Hypertension'], price: 210 },
    { name: 'Spironolactone 25', category: 'Heart Care', disease: ['Heart Edema', 'Fluid Retention'], price: 65 },

    // Eye & Ear Care (10)
    { name: 'Refresh Tears', category: 'Eye Care', disease: ['Dry Eyes', 'Irritation'], price: 145 },
    { name: 'Itone Eye Drops', category: 'Eye Care', disease: ['Natural Eye Refresh'], price: 65 },
    { name: 'Ophthacare Drops', category: 'Eye Care', disease: ['Eye Fatigue', 'Redness'], price: 85 },
    { name: 'Ciplox Eye Drop', category: 'Eye Care', disease: ['Eye Infection', 'Stye'], price: 25 },
    { name: 'Tobrex Drops', category: 'Eye Care', disease: ['Bacterial Conjunctivitis'], price: 210 },
    { name: 'Waxolve Ear Drops', category: 'Ear Care', disease: ['Ear Wax Removal'], price: 85 },
    { name: 'Otocin Ear Drop', category: 'Ear Care', disease: ['Ear Pain', 'Infection'], price: 65 },
    { name: 'Candibiotic Ear Drops', category: 'Ear Care', disease: ['Fungal Ear Infection'], price: 105 },
    { name: 'Clearwax Drops', category: 'Ear Care', disease: ['Impacted Wax'], price: 95 },
    { name: 'Gentamicin Drops', category: 'Ear Care', disease: ['Inflammation', 'Pain'], price: 45 }
];

const formattedMedicines = medicines.map((med, index) => ({
    id: `med-${index + 1}`,
    ...med,
    description: `Expert-recommended treatment for ${med.disease[0].toLowerCase()}. High quality and safety tested.`,
    dosage: '1 tablet twice a day or as directed by physician',
    stock: Math.floor(Math.random() * 500) + 100
}));

const content = `export interface Medicine {
    id: string;
    name: string;
    category: string;
    disease: string[];
    price: number;
    description: string;
    dosage: string;
    stock: number;
    image?: string;
}

export const MEDICINES: Medicine[] = ${JSON.stringify(formattedMedicines, null, 4)};
`;

fs.writeFileSync('src/lib/medicineStore.ts', content);
console.log('Successfully generated 100 medicines with accurate mappings.');
