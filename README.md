# MedQueue & EduMatch AI — Intelligent Healthcare & Learning Infrastructure

[![GitHub](https://img.shields.io/badge/GitHub-iamgulu74-blue?style=for-the-badge&logo=github)](https://github.com/iamgulu74/tech-fest)
[![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

A modern, full-stack predictive healthcare queue management, hospital bed availability tracker, and interactive AI health triage platform built for high-throughput clinical environments and seamless patient care.

---

## 📌 Project Overview

**MedQueue** solves hospital overcrowding, long patient wait times, and emergency navigation delays by bridging real-time hospital infrastructure data with patient-facing mobile portals.

- **Author & Maintainer**: [iamgulu74](https://github.com/iamgulu74)
- **Repository**: [https://github.com/iamgulu74/tech-fest](https://github.com/iamgulu74/tech-fest)

---

## 🚀 Working Features

### 1. 🏥 Real-Time Hospital Finder & Bed Availability
- **Live Institutional Index**: Tracks **98+ medical centers** with dynamic live metrics updated via periodic sync and WebSockets.
- **Ward-Level Breakdown**: Real-time availability for **ICU**, **Emergency**, **General**, and **Ventilator** beds.
- **OPD Queue Tracking**: Live current token numbers, average doctor consultation times, and expected wait times.

### 2. 📍 GPS Real-Time Geolocation & Proximity Sorting
- **High-Accuracy Geolocation**: Uses browser GPS with fallback coordinates to detect the user's live position.
- **Dynamic Haversine Sorting**: Calculates and sorts all healthcare centers by distance in ascending order.
- **Regional Prioritization**: Nearest hospitals (e.g., **SCB Medical College & Hospital**, **Padmini Care Hospital**) appear at the very top with live distance badges (e.g., `1.5 km away`).

### 3. 🚑 Emergency SOS & Instant Trauma Center Finder
- **One-Click SOS**: Instant modal identifying the nearest primary trauma center with estimated arrival time.
- **Direct Dispatch**: One-tap trigger for emergency ambulance dispatch (108 SOS) and direct facility phone calling.
- **Facility Switcher**: Allows quick toggling between all nearby trauma facilities.

### 4. 🔊 Live Audio Queue Announcements (Text-to-Speech)
- **Voice Token Calls**: Integrated browser SpeechSynthesis API that calls tokens aloud (e.g., *"Token A-104, please proceed to Room 3, Dr. Sharma"*).
- **Hands-Free Convenience**: Patients can listen to live announcements without continuously staring at their screen.
- **Toggle Control**: One-click mute/unmute audio button in the top navigation bar.

### 5. 📲 SMS & WhatsApp Queue Tracker (Twilio Integration)
- **Automated Tracking Alert**: Patients enter their mobile number to activate SMS/WhatsApp queue updates.
- **Smart Notification Threshold**: Sends alerts when the patient is within 3 spots of consultation.
- **Unified Backend**: Auto-normalizes Indian phone numbers (`+91`) and handles carrier routing gracefully.

### 6. 👨‍👩‍👧 Multi-Dependent Family Profile Switcher
- **Clean Default**: Starts with **`Self`** (no mock family members pre-filled).
- **On-Demand Addition**: Click `+ Add Member` to add dependents (parents, children, spouse) with age and relation.
- **Persistent Storage**: Saved securely in local storage for quick selection during token booking.

### 7. 🤖 AI Assistant (Neural Health Core & Clinical Triage)
- **Interactive Health Chatbot**: Natural language conversation for symptom assessment and clinical triage.
- **Severity Classification**: Categorizes symptoms into *EMERGENCY*, *URGENT*, or *NON-URGENT*.
- **Clinical First-Aid & Home Guidance**: Provides actionable home care steps and recommends specific hospital departments.

### 8. 💊 MedStore Global (In-App Pharmacy)
- **Verified Medications**: Browse and search essential OTC and prescription medicines by category.
- **Real-Time Stock**: Check availability at affiliated hospital pharmacy counters.
- **Instant Cart Management**: Add medicines directly to cart with live quantity adjustment and order calculation.

### 9. 🌙 Seamless Dark & Light Mode
- **Custom Theme Engine**: Tailored dark theme (`#0b0f19`) with high-contrast text rendering.
- **Glassmorphism Aesthetics**: Modern glass-card styling with responsive layouts.

### 10. 📚 Knowledge & Learn Hub
- Verified medical reference guides, emergency first-aid protocols, disease overviews, and preventive wellness advice.

### 11. 🛡️ Hospital Admin & Operations Portal
- Comprehensive administrative dashboard for managing ward capacity, doctor staffing rosters, patient check-ins, and queue triage.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, WebSockets (`ws`), CORS, dotenv |
| **AI / NLP** | Google Gemini API (`@google/genai`), Custom Neural Intent Classification |
| **Communications** | Twilio API (SMS / WhatsApp), Web SpeechSynthesis API |
| **Mapping & Location** | Leaflet / React-Leaflet, Haversine Geolocation Formulas |
| **State & Persistence** | React Hooks, Context API, LocalStorage |

---

## 📁 Repository Structure

```
├── backend/
│   ├── server.js              # Express server, WebSocket, Twilio SMS & Gemini AI routes
│   ├── ai_engine/             # NLP models and intent classifiers
│   └── package.json           # Backend dependencies
├── src/
│   ├── components/            # Reusable UI (PixelButton, SymptomChecker, ProtectedRoute, etc.)
│   ├── contexts/              # AuthContext, ThemeContext, SubscriptionContext
│   ├── pages/
│   │   ├── Landing.tsx        # Main entry point with Emergency SOS & Portal selector
│   │   ├── MedQueuePatient.tsx# Patient portal: Finder, AI Assistant, Pharmacy, Family switcher
│   │   ├── MedQueueAdmin.tsx  # Hospital administration dashboard
│   │   ├── BookingPage.tsx    # OPD token booking workflow
│   │   ├── LearnHub.tsx       # Medical education & knowledge hub
│   │   ├── WardsBeds.tsx      # Live bed & ward management
│   │   └── Analytics.tsx      # Hospital predictive analytics
│   ├── lib/
│   │   ├── api.ts             # API client methods
│   │   └── utils.ts           # Haversine distance & formatting helpers
│   ├── App.tsx                # Client-side router configuration
│   └── index.css              # Global styles & dark mode definitions
├── .env                       # Environment variables configuration
└── README.md                  # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/iamgulu74/tech-fest.git
cd tech-fest
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Frontend Config
VITE_API_URL=http://localhost:5001

# Backend Services
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 3. Install Dependencies
```bash
# Install frontend packages
npm install

# Install backend packages
cd backend
npm install
cd ..
```

### 4. Run the Development Servers

**Start Backend API Service**:
```bash
cd backend
node server.js
```
*(Runs on `http://localhost:5001`)*

**Start Frontend Application**:
```bash
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 🧪 Testing & Validation
Verify TypeScript types and build integrity:
```bash
npx tsc --noEmit
npm run build
```

---

## 👤 Author & Maintainer

- **Developer**: **iamgulu74**
- **GitHub**: [@iamgulu74](https://github.com/iamgulu74)
- **Repository**: [iamgulu74/tech-fest](https://github.com/iamgulu74/tech-fest)

---

## 📄 License
This project is licensed under the MIT License.
