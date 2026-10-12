import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import MedQueueAdmin from './pages/MedQueueAdmin';
import MedQueuePatient from './pages/MedQueuePatient';
import PatientDashboard from './pages/PatientDashboard';
import BookingPage from './pages/BookingPage';
import Auth from './pages/Auth';
import AuthPatient from './pages/AuthPatient';
import AuthAdmin from './pages/AuthAdmin';
import HospitalFinder from './pages/HospitalFinder';
import WardsBeds from './pages/WardsBeds';
import Staffing from './pages/Staffing';
import Analytics from './pages/Analytics';
import { ProtectedRoute } from './components/ProtectedRoute';
import LearnHub from './pages/LearnHub';
import DiseasesModule from './pages/DiseasesModule';
import TreatmentsModule from './pages/TreatmentsModule';
import WellnessModule from './pages/WellnessModule';
import FirstAidModule from './pages/FirstAidModule';
import Pricing from './pages/Pricing';
import SymptomChecker from './components/SymptomChecker';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
    return (
        <ThemeProvider>
        <LanguageProvider>
        <SubscriptionProvider>
            <Router>
                <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/patient" element={<AuthPatient />} />
                <Route path="/auth/admin" element={<AuthAdmin />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/learn" element={<LearnHub />} />
                <Route path="/learn/diseases" element={<DiseasesModule />} />
                <Route path="/learn/treatments" element={<TreatmentsModule />} />
                <Route path="/learn/wellness" element={<WellnessModule />} />
                <Route path="/learn/firstaid" element={<FirstAidModule />} />
                
                {/* Publicly Accessible AI Assistant */}
                <Route path="/symptoms" element={
                    <div className="min-h-screen bg-[#f8fafc] p-8">
                        <div className="max-w-4xl mx-auto h-[600px]">
                            <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">
                                Neural <span className="text-primary">Triage</span> System
                            </h1>
                            <SymptomChecker />
                        </div>
                    </div>
                } />

                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <MedQueuePatient />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/book"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <BookingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Admin Routes (MedQueue Admin Dashboard) */}
                <Route
                    path="/medqueue"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <MedQueueAdmin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wards-beds"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <WardsBeds />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staffing"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Staffing />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                {/* Hospital Finder (All logged-in users) */}
                <Route
                    path="/hospitals"
                    element={
                        <ProtectedRoute allowedRoles={['patient', 'admin']}>
                            <HospitalFinder />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
        </SubscriptionProvider>
        </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
