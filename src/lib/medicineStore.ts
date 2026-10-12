export interface Medicine {
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

export const MEDICINES: Medicine[] = [
    {
        "id": "med-1",
        "name": "Paracetamol 650",
        "category": "Fever",
        "disease": [
            "Fever",
            "Chills",
            "Headache"
        ],
        "price": 30,
        "description": "Expert-recommended treatment for fever. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 268
    },
    {
        "id": "med-2",
        "name": "Dolo 650",
        "category": "Fever",
        "disease": [
            "Fever",
            "Bodyache",
            "Chills"
        ],
        "price": 32,
        "description": "Expert-recommended treatment for fever. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 521
    },
    {
        "id": "med-3",
        "name": "Calpol 500",
        "category": "Fever",
        "disease": [
            "High Fever",
            "Headache"
        ],
        "price": 18,
        "description": "Expert-recommended treatment for high fever. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 260
    },
    {
        "id": "med-4",
        "name": "Crocin Advance",
        "category": "Fever",
        "disease": [
            "Fever",
            "Headache"
        ],
        "price": 25,
        "description": "Expert-recommended treatment for fever. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 307
    },
    {
        "id": "med-5",
        "name": "Panadol 500",
        "category": "Fever",
        "disease": [
            "Mild Fever",
            "Pain"
        ],
        "price": 40,
        "description": "Expert-recommended treatment for mild fever. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 259
    },
    {
        "id": "med-6",
        "name": "Vicks Action 500",
        "category": "Cold",
        "disease": [
            "Cold",
            "Cough",
            "Bodyache"
        ],
        "price": 55,
        "description": "Expert-recommended treatment for cold. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 177
    },
    {
        "id": "med-7",
        "name": "Benadryl Syrup",
        "category": "Cold",
        "disease": [
            "Dry Cough",
            "Sore Throat"
        ],
        "price": 105,
        "description": "Expert-recommended treatment for dry cough. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 147
    },
    {
        "id": "med-8",
        "name": "Alex Syrup",
        "category": "Cold",
        "disease": [
            "Cough",
            "Nasal Congestion"
        ],
        "price": 120,
        "description": "Expert-recommended treatment for cough. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 594
    },
    {
        "id": "med-9",
        "name": "Ascoril LS",
        "category": "Cold",
        "disease": [
            "Cough",
            "Congestion"
        ],
        "price": 115,
        "description": "Expert-recommended treatment for cough. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 124
    },
    {
        "id": "med-10",
        "name": "Honitus Syrup",
        "category": "Cold",
        "disease": [
            "Ayurvedic Cough Relief"
        ],
        "price": 95,
        "description": "Expert-recommended treatment for ayurvedic cough relief. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 545
    },
    {
        "id": "med-11",
        "name": "Koflet Syrup",
        "category": "Cold",
        "disease": [
            "Allergy Cough",
            "Nasal Congestion"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for allergy cough. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 503
    },
    {
        "id": "med-12",
        "name": "Cofsy Syrup",
        "category": "Cold",
        "disease": [
            "Wet Cough",
            "Sore Throat"
        ],
        "price": 75,
        "description": "Expert-recommended treatment for wet cough. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 109
    },
    {
        "id": "med-13",
        "name": "Cheston Cold",
        "category": "Cold",
        "disease": [
            "Nasal Block",
            "Runny Nose"
        ],
        "price": 45,
        "description": "Expert-recommended treatment for nasal block. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 235
    },
    {
        "id": "med-14",
        "name": "Solvin De",
        "category": "Cold",
        "disease": [
            "Chronic Cough",
            "Cold"
        ],
        "price": 65,
        "description": "Expert-recommended treatment for chronic cough. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 311
    },
    {
        "id": "med-15",
        "name": "Zingavita Vitamin C",
        "category": "Cold",
        "disease": [
            "Cold Prevention",
            "Immunity"
        ],
        "price": 350,
        "description": "Expert-recommended treatment for cold prevention. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 133
    },
    {
        "id": "med-16",
        "name": "Combiflam",
        "category": "Pain Relief",
        "disease": [
            "Muscle Pain",
            "Inflammation"
        ],
        "price": 48,
        "description": "Expert-recommended treatment for muscle pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 535
    },
    {
        "id": "med-17",
        "name": "Brufen 400",
        "category": "Pain Relief",
        "disease": [
            "Joint Pain",
            "Back Pain"
        ],
        "price": 15,
        "description": "Expert-recommended treatment for joint pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 579
    },
    {
        "id": "med-18",
        "name": "Saridon",
        "category": "Pain Relief",
        "disease": [
            "Severe Headache",
            "Stress"
        ],
        "price": 12,
        "description": "Expert-recommended treatment for severe headache. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 374
    },
    {
        "id": "med-19",
        "name": "Disprin",
        "category": "Pain Relief",
        "disease": [
            "Headache Relief",
            "Pain"
        ],
        "price": 10,
        "description": "Expert-recommended treatment for headache relief. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 255
    },
    {
        "id": "med-20",
        "name": "Dart Tablets",
        "category": "Pain Relief",
        "disease": [
            "Toothache",
            "Headache"
        ],
        "price": 20,
        "description": "Expert-recommended treatment for toothache. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 191
    },
    {
        "id": "med-21",
        "name": "Ultracet",
        "category": "Pain Relief",
        "disease": [
            "Severe Body Pain",
            "Muscle Aches"
        ],
        "price": 180,
        "description": "Expert-recommended treatment for severe body pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 105
    },
    {
        "id": "med-22",
        "name": "Volini Spray",
        "category": "Pain Relief",
        "disease": [
            "Muscle Spasm",
            "Back ache"
        ],
        "price": 125,
        "description": "Expert-recommended treatment for muscle spasm. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 411
    },
    {
        "id": "med-23",
        "name": "Moov Gel",
        "category": "Pain Relief",
        "disease": [
            "Back Pain",
            "Muscle Pull"
        ],
        "price": 95,
        "description": "Expert-recommended treatment for back pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 342
    },
    {
        "id": "med-24",
        "name": "Fastum Gel",
        "category": "Pain Relief",
        "disease": [
            "Joint Inflammation",
            "Knee Pain"
        ],
        "price": 210,
        "description": "Expert-recommended treatment for joint inflammation. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 419
    },
    {
        "id": "med-25",
        "name": "Naproxen 250",
        "category": "Pain Relief",
        "disease": [
            "Arthritis Pain",
            "Joint Stiffness"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for arthritis pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 438
    },
    {
        "id": "med-26",
        "name": "Tramadol 50",
        "category": "Pain Relief",
        "disease": [
            "Severe Pain Management"
        ],
        "price": 140,
        "description": "Expert-recommended treatment for severe pain management. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 582
    },
    {
        "id": "med-27",
        "name": "Meftal Forte",
        "category": "Pain Relief",
        "disease": [
            "Period Pain",
            "Cramps"
        ],
        "price": 55,
        "description": "Expert-recommended treatment for period pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 597
    },
    {
        "id": "med-28",
        "name": "Nimulid Oral Gel",
        "category": "Pain Relief",
        "disease": [
            "Gingivitis",
            "Mouth Pain"
        ],
        "price": 35,
        "description": "Expert-recommended treatment for gingivitis. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 235
    },
    {
        "id": "med-29",
        "name": "Ibuprofen 200",
        "category": "Pain Relief",
        "disease": [
            "Mild Pain",
            "Swelling"
        ],
        "price": 12,
        "description": "Expert-recommended treatment for mild pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 515
    },
    {
        "id": "med-30",
        "name": "Piroxicam Gel",
        "category": "Pain Relief",
        "disease": [
            "Sports Injury",
            "Sprains"
        ],
        "price": 110,
        "description": "Expert-recommended treatment for sports injury. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 311
    },
    {
        "id": "med-31",
        "name": "Digene Tablets",
        "category": "Digestion",
        "disease": [
            "Acidity",
            "Gas",
            "Bloating"
        ],
        "price": 22,
        "description": "Expert-recommended treatment for acidity. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 107
    },
    {
        "id": "med-32",
        "name": "Eno Lemon Sachet",
        "category": "Digestion",
        "disease": [
            "Instant Acidity Relief"
        ],
        "price": 10,
        "description": "Expert-recommended treatment for instant acidity relief. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 430
    },
    {
        "id": "med-33",
        "name": "Gelusil MPS",
        "category": "Digestion",
        "disease": [
            "Heartburn",
            "Stomach Gas"
        ],
        "price": 115,
        "description": "Expert-recommended treatment for heartburn. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 342
    },
    {
        "id": "med-34",
        "name": "Pantoprazole 40",
        "category": "Digestion",
        "disease": [
            "GERD",
            "Ulcer Prevention"
        ],
        "price": 125,
        "description": "Expert-recommended treatment for gerd. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 403
    },
    {
        "id": "med-35",
        "name": "Rabeprazole 20",
        "category": "Digestion",
        "disease": [
            "Gastric Problems"
        ],
        "price": 140,
        "description": "Expert-recommended treatment for gastric problems. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 332
    },
    {
        "id": "med-36",
        "name": "Omeprazole 20",
        "category": "Digestion",
        "disease": [
            "Acid Reflux",
            "Bloating"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for acid reflux. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 368
    },
    {
        "id": "med-37",
        "name": "Pudin Hara Capsules",
        "category": "Digestion",
        "disease": [
            "Stomach Ache",
            "Bloating"
        ],
        "price": 25,
        "description": "Expert-recommended treatment for stomach ache. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 494
    },
    {
        "id": "med-38",
        "name": "Isabgol Powder",
        "category": "Digestion",
        "disease": [
            "Constipation",
            "Bowel movement"
        ],
        "price": 195,
        "description": "Expert-recommended treatment for constipation. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 517
    },
    {
        "id": "med-39",
        "name": "Pet Saffa Powder",
        "category": "Digestion",
        "disease": [
            "Stomach Cleanse",
            "Gas"
        ],
        "price": 95,
        "description": "Expert-recommended treatment for stomach cleanse. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 457
    },
    {
        "id": "med-40",
        "name": "Kayam Churna",
        "category": "Digestion",
        "disease": [
            "Severe Constipation"
        ],
        "price": 110,
        "description": "Expert-recommended treatment for severe constipation. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 289
    },
    {
        "id": "med-41",
        "name": "Dulcoflex 5mg",
        "category": "Digestion",
        "disease": [
            "Laxative",
            "Stool Softener"
        ],
        "price": 12,
        "description": "Expert-recommended treatment for laxative. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 318
    },
    {
        "id": "med-42",
        "name": "Zantac 150",
        "category": "Digestion",
        "disease": [
            "Heartburn",
            "Indigestion"
        ],
        "price": 45,
        "description": "Expert-recommended treatment for heartburn. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 263
    },
    {
        "id": "med-43",
        "name": "Domstal 10mg",
        "category": "Digestion",
        "disease": [
            "Vomiting",
            "Nausea"
        ],
        "price": 35,
        "description": "Expert-recommended treatment for vomiting. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 299
    },
    {
        "id": "med-44",
        "name": "Ondem MD 4",
        "category": "Digestion",
        "disease": [
            "Nausea Relief",
            "Motion Sickness"
        ],
        "price": 55,
        "description": "Expert-recommended treatment for nausea relief. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 107
    },
    {
        "id": "med-45",
        "name": "Sporolac Sachet",
        "category": "Digestion",
        "disease": [
            "Diarrhea",
            "Probiotic"
        ],
        "price": 48,
        "description": "Expert-recommended treatment for diarrhea. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 330
    },
    {
        "id": "med-46",
        "name": "Cetirizine 10",
        "category": "Allergy",
        "disease": [
            "Itching",
            "Runny Nose"
        ],
        "price": 12,
        "description": "Expert-recommended treatment for itching. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 157
    },
    {
        "id": "med-47",
        "name": "Allegra 120",
        "category": "Allergy",
        "disease": [
            "Hay Fever",
            "Skin Allergy"
        ],
        "price": 185,
        "description": "Expert-recommended treatment for hay fever. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 181
    },
    {
        "id": "med-48",
        "name": "Avil 25",
        "category": "Allergy",
        "disease": [
            "Itching",
            "Cold Allergy"
        ],
        "price": 15,
        "description": "Expert-recommended treatment for itching. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 372
    },
    {
        "id": "med-49",
        "name": "Atarax 25",
        "category": "Allergy",
        "disease": [
            "Skin Hives",
            "Anxiety Itch"
        ],
        "price": 125,
        "description": "Expert-recommended treatment for skin hives. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 215
    },
    {
        "id": "med-50",
        "name": "Montelukast 10",
        "category": "Allergy",
        "disease": [
            "Asthma Allergy",
            "Sneezing"
        ],
        "price": 145,
        "description": "Expert-recommended treatment for asthma allergy. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 441
    },
    {
        "id": "med-51",
        "name": "Loratadine 10",
        "category": "Allergy",
        "disease": [
            "Seasonal Allergy",
            "Dust"
        ],
        "price": 95,
        "description": "Expert-recommended treatment for seasonal allergy. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 377
    },
    {
        "id": "med-52",
        "name": "Otrivin Nasal Drop",
        "category": "Allergy",
        "disease": [
            "Blocked Nose",
            "Sinusitis"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for blocked nose. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 108
    },
    {
        "id": "med-53",
        "name": "Nasivion Adult",
        "category": "Allergy",
        "disease": [
            "Nasal Congestion"
        ],
        "price": 75,
        "description": "Expert-recommended treatment for nasal congestion. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 502
    },
    {
        "id": "med-54",
        "name": "Levocetirizine 5",
        "category": "Allergy",
        "disease": [
            "Persistent Cold",
            "Itching"
        ],
        "price": 45,
        "description": "Expert-recommended treatment for persistent cold. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 428
    },
    {
        "id": "med-55",
        "name": "Bilastine 20",
        "category": "Allergy",
        "disease": [
            "Urticaria",
            "Nasal Allergy"
        ],
        "price": 165,
        "description": "Expert-recommended treatment for urticaria. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 245
    },
    {
        "id": "med-56",
        "name": "Clarinex 5mg",
        "category": "Allergy",
        "disease": [
            "Indoor Allergies"
        ],
        "price": 210,
        "description": "Expert-recommended treatment for indoor allergies. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 338
    },
    {
        "id": "med-57",
        "name": "Fluticasone Spray",
        "category": "Allergy",
        "disease": [
            "Nasal Inflammation"
        ],
        "price": 340,
        "description": "Expert-recommended treatment for nasal inflammation. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 543
    },
    {
        "id": "med-58",
        "name": "Asthalin Inhaler",
        "category": "Allergy",
        "disease": [
            "Breathing Difficulty",
            "Asthma"
        ],
        "price": 155,
        "description": "Expert-recommended treatment for breathing difficulty. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 474
    },
    {
        "id": "med-59",
        "name": "Aerocort Inhaler",
        "category": "Allergy",
        "disease": [
            "Bronchospasm",
            "Wheezing"
        ],
        "price": 195,
        "description": "Expert-recommended treatment for bronchospasm. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 599
    },
    {
        "id": "med-60",
        "name": "Duolin Rotacaps",
        "category": "Allergy",
        "disease": [
            "COPD",
            "Shortness of Breath"
        ],
        "price": 110,
        "description": "Expert-recommended treatment for copd. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 555
    },
    {
        "id": "med-61",
        "name": "Betadine 10%",
        "category": "Skin Care",
        "disease": [
            "Cuts",
            "Minor Wounds"
        ],
        "price": 105,
        "description": "Expert-recommended treatment for cuts. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 199
    },
    {
        "id": "med-62",
        "name": "Soframycin Cream",
        "category": "Skin Care",
        "disease": [
            "Infected Wounds",
            "Burns"
        ],
        "price": 45,
        "description": "Expert-recommended treatment for infected wounds. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 427
    },
    {
        "id": "med-63",
        "name": "Burnol Cream",
        "category": "Skin Care",
        "disease": [
            "Minor Burns",
            "Heat Rash"
        ],
        "price": 65,
        "description": "Expert-recommended treatment for minor burns. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 325
    },
    {
        "id": "med-64",
        "name": "Neosporin Ointment",
        "category": "Skin Care",
        "disease": [
            "Antibacterial",
            "Scratches"
        ],
        "price": 120,
        "description": "Expert-recommended treatment for antibacterial. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 216
    },
    {
        "id": "med-65",
        "name": "Itch Guard Plus",
        "category": "Skin Care",
        "disease": [
            "Fungal Infection",
            "Itch"
        ],
        "price": 95,
        "description": "Expert-recommended treatment for fungal infection. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 210
    },
    {
        "id": "med-66",
        "name": "B-Tex Ointment",
        "category": "Skin Care",
        "disease": [
            "Eczema",
            "Ringworm"
        ],
        "price": 25,
        "description": "Expert-recommended treatment for eczema. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 183
    },
    {
        "id": "med-67",
        "name": "Calamine Lotion",
        "category": "Skin Care",
        "disease": [
            "Sunburn",
            "Prickly Heat"
        ],
        "price": 145,
        "description": "Expert-recommended treatment for sunburn. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 477
    },
    {
        "id": "med-68",
        "name": "Dettol Antiseptic",
        "category": "Skin Care",
        "disease": [
            "Disinfection",
            "Washing"
        ],
        "price": 165,
        "description": "Expert-recommended treatment for disinfection. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 572
    },
    {
        "id": "med-69",
        "name": "Savlon Liquid",
        "category": "Skin Care",
        "disease": [
            "Wound Cleansing"
        ],
        "price": 140,
        "description": "Expert-recommended treatment for wound cleansing. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 235
    },
    {
        "id": "med-70",
        "name": "Zincoderm G",
        "category": "Skin Care",
        "disease": [
            "Dermatitis",
            "Skin Rash"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for dermatitis. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 208
    },
    {
        "id": "med-71",
        "name": "Fourderm Cream",
        "category": "Skin Care",
        "disease": [
            "Skin Infection",
            "Mixed Allergy"
        ],
        "price": 115,
        "description": "Expert-recommended treatment for skin infection. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 121
    },
    {
        "id": "med-72",
        "name": "Elocon Cream",
        "category": "Skin Care",
        "disease": [
            "Psoriasis",
            "Severe Itching"
        ],
        "price": 245,
        "description": "Expert-recommended treatment for psoriasis. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 100
    },
    {
        "id": "med-73",
        "name": "Clotrimazole Dusting Powder",
        "category": "Skin Care",
        "disease": [
            "Sweat Rash",
            "Athletes Foot"
        ],
        "price": 135,
        "description": "Expert-recommended treatment for sweat rash. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 265
    },
    {
        "id": "med-74",
        "name": "Luliconazole Cream",
        "category": "Skin Care",
        "disease": [
            "Ringworm",
            "Skin Fungus"
        ],
        "price": 195,
        "description": "Expert-recommended treatment for ringworm. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 170
    },
    {
        "id": "med-75",
        "name": "Boro Plus Cream",
        "category": "Skin Care",
        "disease": [
            "Dry Skin",
            "Cuts"
        ],
        "price": 65,
        "description": "Expert-recommended treatment for dry skin. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 389
    },
    {
        "id": "med-76",
        "name": "Metformin 500",
        "category": "Diabetes",
        "disease": [
            "Type 2 Diabetes",
            "Sugar"
        ],
        "price": 15,
        "description": "Expert-recommended treatment for type 2 diabetes. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 140
    },
    {
        "id": "med-77",
        "name": "Glycomet GP 1",
        "category": "Diabetes",
        "disease": [
            "High Blood Sugar"
        ],
        "price": 115,
        "description": "Expert-recommended treatment for high blood sugar. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 519
    },
    {
        "id": "med-78",
        "name": "Januvia 50",
        "category": "Diabetes",
        "disease": [
            "Oral Diabetes Care"
        ],
        "price": 450,
        "description": "Expert-recommended treatment for oral diabetes care. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 106
    },
    {
        "id": "med-79",
        "name": "Galvus Met 50/500",
        "category": "Diabetes",
        "disease": [
            "Combined Glucose Control"
        ],
        "price": 380,
        "description": "Expert-recommended treatment for combined glucose control. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 393
    },
    {
        "id": "med-80",
        "name": "Teneligliptin 20",
        "category": "Diabetes",
        "disease": [
            "Post-meal Sugar Control"
        ],
        "price": 95,
        "description": "Expert-recommended treatment for post-meal sugar control. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 459
    },
    {
        "id": "med-81",
        "name": "Amlodipine 5",
        "category": "Heart Care",
        "disease": [
            "High Blood Pressure",
            "BP"
        ],
        "price": 12,
        "description": "Expert-recommended treatment for high blood pressure. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 336
    },
    {
        "id": "med-82",
        "name": "Telmisartan 40",
        "category": "Heart Care",
        "disease": [
            "Hypertension",
            "Cardiac Care"
        ],
        "price": 110,
        "description": "Expert-recommended treatment for hypertension. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 389
    },
    {
        "id": "med-83",
        "name": "Atorvastatin 10",
        "category": "Heart Care",
        "disease": [
            "High Cholesterol"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for high cholesterol. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 263
    },
    {
        "id": "med-84",
        "name": "Rosuvastatin 10",
        "category": "Heart Care",
        "disease": [
            "Lipid Control",
            "Heart Health"
        ],
        "price": 125,
        "description": "Expert-recommended treatment for lipid control. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 527
    },
    {
        "id": "med-85",
        "name": "Ramipril 5mg",
        "category": "Heart Care",
        "disease": [
            "After Cardiac Surgery",
            "BP"
        ],
        "price": 145,
        "description": "Expert-recommended treatment for after cardiac surgery. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 299
    },
    {
        "id": "med-86",
        "name": "Aspirin 75mg",
        "category": "Heart Care",
        "disease": [
            "Blood Thinner",
            "Stroke Prevention"
        ],
        "price": 15,
        "description": "Expert-recommended treatment for blood thinner. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 566
    },
    {
        "id": "med-87",
        "name": "Concor 5mg",
        "category": "Heart Care",
        "disease": [
            "Congestive Heart Failure"
        ],
        "price": 180,
        "description": "Expert-recommended treatment for congestive heart failure. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 420
    },
    {
        "id": "med-88",
        "name": "Metoprolol 25",
        "category": "Heart Care",
        "disease": [
            "Angina",
            "Heart Rate Control"
        ],
        "price": 75,
        "description": "Expert-recommended treatment for angina. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 530
    },
    {
        "id": "med-89",
        "name": "Hydralazine 25",
        "category": "Heart Care",
        "disease": [
            "Severe Hypertension"
        ],
        "price": 210,
        "description": "Expert-recommended treatment for severe hypertension. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 563
    },
    {
        "id": "med-90",
        "name": "Spironolactone 25",
        "category": "Heart Care",
        "disease": [
            "Heart Edema",
            "Fluid Retention"
        ],
        "price": 65,
        "description": "Expert-recommended treatment for heart edema. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 166
    },
    {
        "id": "med-91",
        "name": "Refresh Tears",
        "category": "Eye Care",
        "disease": [
            "Dry Eyes",
            "Irritation"
        ],
        "price": 145,
        "description": "Expert-recommended treatment for dry eyes. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 394
    },
    {
        "id": "med-92",
        "name": "Itone Eye Drops",
        "category": "Eye Care",
        "disease": [
            "Natural Eye Refresh"
        ],
        "price": 65,
        "description": "Expert-recommended treatment for natural eye refresh. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 593
    },
    {
        "id": "med-93",
        "name": "Ophthacare Drops",
        "category": "Eye Care",
        "disease": [
            "Eye Fatigue",
            "Redness"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for eye fatigue. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 517
    },
    {
        "id": "med-94",
        "name": "Ciplox Eye Drop",
        "category": "Eye Care",
        "disease": [
            "Eye Infection",
            "Stye"
        ],
        "price": 25,
        "description": "Expert-recommended treatment for eye infection. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 471
    },
    {
        "id": "med-95",
        "name": "Tobrex Drops",
        "category": "Eye Care",
        "disease": [
            "Bacterial Conjunctivitis"
        ],
        "price": 210,
        "description": "Expert-recommended treatment for bacterial conjunctivitis. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 173
    },
    {
        "id": "med-96",
        "name": "Waxolve Ear Drops",
        "category": "Ear Care",
        "disease": [
            "Ear Wax Removal"
        ],
        "price": 85,
        "description": "Expert-recommended treatment for ear wax removal. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 163
    },
    {
        "id": "med-97",
        "name": "Otocin Ear Drop",
        "category": "Ear Care",
        "disease": [
            "Ear Pain",
            "Infection"
        ],
        "price": 65,
        "description": "Expert-recommended treatment for ear pain. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 503
    },
    {
        "id": "med-98",
        "name": "Candibiotic Ear Drops",
        "category": "Ear Care",
        "disease": [
            "Fungal Ear Infection"
        ],
        "price": 105,
        "description": "Expert-recommended treatment for fungal ear infection. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 229
    },
    {
        "id": "med-99",
        "name": "Clearwax Drops",
        "category": "Ear Care",
        "disease": [
            "Impacted Wax"
        ],
        "price": 95,
        "description": "Expert-recommended treatment for impacted wax. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 360
    },
    {
        "id": "med-100",
        "name": "Gentamicin Drops",
        "category": "Ear Care",
        "disease": [
            "Inflammation",
            "Pain"
        ],
        "price": 45,
        "description": "Expert-recommended treatment for inflammation. High quality and safety tested.",
        "dosage": "1 tablet twice a day or as directed by physician",
        "stock": 559
    }
];
