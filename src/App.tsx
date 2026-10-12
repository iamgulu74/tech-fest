import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import { ProtectedRoute } from './components/ProtectedRoute';
import SymptomChecker from './components/SymptomChecker';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

const MedQueueAdmin = lazy(() => import('./pages/MedQueueAdmin'));
const MedQueuePatient = lazy(() => import('./pages/MedQueuePatient'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const Auth = lazy(() => import('./pages/Auth'));
const AuthPatient = lazy(() => import('./pages/AuthPatient'));
const AuthAdmin = lazy(() => import('./pages/AuthAdmin'));
const HospitalFinder = lazy(() => import('./pages/HospitalFinder'));
const WardsBeds = lazy(() => import('./pages/WardsBeds'));
const Staffing = lazy(() => import('./pages/Staffing'));
const Analytics = lazy(() => import('./pages/Analytics'));
const LearnHub = lazy(() => import('./pages/LearnHub'));
const DiseasesModule = lazy(() => import('./pages/DiseasesModule'));
const TreatmentsModule = lazy(() => import('./pages/TreatmentsModule'));
const WellnessModule = lazy(() => import('./pages/WellnessModule'));
const FirstAidModule = lazy(() => import('./pages/FirstAidModule'));
const Pricing = lazy(() => import('./pages/Pricing'));

const RouteLoader = () => (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

function App() {
    return (
        <ThemeProvider>
        <LanguageProvider>
        <SubscriptionProvider>
            <Router>
                <Suspense fallback={<RouteLoader />}>
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
            </Suspense>
        </Router>
        </SubscriptionProvider>
        </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
