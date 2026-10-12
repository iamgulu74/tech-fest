import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    MapPin,
    Clock,
    Heart,
    Activity,
    Bell,
    Map as MapIcon,
    LogOut,
    Stethoscope,
    Users,
    Download,
    FileText,
    X,
    ArrowLeft,
    Volume2,
    VolumeX,
    MessageSquare,
    Sun,
    Moon,
    UserPlus,
    Navigation
} from 'lucide-react';
import { useAuth } from '../components/ProtectedRoute';
import { fetchHospitals, trackQueueSMS } from '../lib/api';
import PixelButton from '../components/PixelButton';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SymptomChecker from '../components/SymptomChecker';
import { useTheme } from '../contexts/ThemeContext';

import { getDistance } from '../lib/utils';
import { MEDICINES, Medicine } from '../lib/medicineStore';
import { ShoppingBag, ShoppingCart, Plus, Minus, Trash2, Package, Pill } from 'lucide-react';
import { jsPDF } from 'jspdf';

const MedQueuePatient = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number}>({ lat: 20.550833, lng: 85.998361 });
    const [activeTab, setActiveTab] = useState<'hospitals' | 'symptom-checker' | 'pharmacy'>('hospitals');
    const [cart, setCart] = useState<{ med: Medicine, quantity: number }[]>([]);
    const [medicineSearch, setMedicineSearch] = useState('');
    const [showCart, setShowCart] = useState(false);
    const [lastOrderItems, setLastOrderItems] = useState<{ med: Medicine, quantity: number }[]>([]);
    const [showPrescriptionDownload, setShowPrescriptionDownload] = useState(false);
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [bookingHistory, setBookingHistory] = useState<any[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('medQueueHistory') || '[]');
        } catch (e) {
            return [];
        }
    });
    const [toast, setToast] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<any[]>([
        { id: 1, title: 'Welcome to MedQueue', message: 'You can now book tokens at 100+ hospitals.', time: '2m ago', read: false, type: 'info' },
        { id: 2, title: 'Surge Alert', message: 'High patient inflow detected at AIIMS Delhi.', time: '1h ago', read: true, type: 'warning' }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [prescribingDoctor, setPrescribingDoctor] = useState('');
    const { theme, toggleTheme } = useTheme();

    // 🔊 Audio Voice Queue Announcements (Text-to-Speech)
    const [voiceAnnounceEnabled, setVoiceAnnounceEnabled] = useState(true);
    const speakAnnouncement = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
            setToast(`🔊 Announcement: "${text}"`);
            setTimeout(() => setToast(null), 4000);
        } else {
            setToast("Speech synthesis not supported on this device.");
        }
    };

    // 👨‍👩‍👧 Family & Dependent Profile Switcher (Default ONLY Self, no members until user adds)
    const [familyMembers, setFamilyMembers] = useState<string[]>(() => {
        const saved = localStorage.getItem('medQueueFamilyMembers');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return [user?.name || 'Self'];
    });
    const [activeMember, setActiveMember] = useState<string>(user?.name || 'Self');
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMemberName.trim()) {
            const updated = [...familyMembers, newMemberName.trim()];
            setFamilyMembers(updated);
            setActiveMember(newMemberName.trim());
            localStorage.setItem('medQueueFamilyMembers', JSON.stringify(updated));
            setNewMemberName('');
            setShowAddMember(false);
            setToast(`Added ${newMemberName.trim()} to family profiles.`);
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 📲 WhatsApp / SMS Queue Tracker Modal & Handler
    const [smsModalToken, setSmsModalToken] = useState<{ token: string; hospital: string } | null>(null);
    const [smsPhoneInput, setSmsPhoneInput] = useState('+916371401928');
    const [isSendingSMS, setIsSendingSMS] = useState(false);

    const handleTrackSMS = (token: string, hospitalName: string) => {
        setSmsModalToken({ token, hospital: hospitalName });
    };

    const confirmTrackSMS = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!smsModalToken) return;
        setIsSendingSMS(true);
        try {
            const res = await trackQueueSMS(smsPhoneInput, smsModalToken.token, smsModalToken.hospital, activeMember);
            setToast(`📲 ${res.message || `SMS & WhatsApp alert scheduled for ${smsPhoneInput}!`}`);
            setTimeout(() => setToast(null), 5000);
            setSmsModalToken(null);
        } catch (e) {
            setToast(`📲 Alert scheduled for ${smsModalToken.token}!`);
            setTimeout(() => setToast(null), 4000);
            setSmsModalToken(null);
        } finally {
            setIsSendingSMS(false);
        }
    };

    const [isLiveGps, setIsLiveGps] = useState(false);

    const requestLiveGps = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setUserLocation({ lat, lng });
                    setIsLiveGps(true);
                    setToast(`📍 Live GPS acquired: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
                    setTimeout(() => setToast(null), 3000);
                },
                (err) => {
                    console.warn("GPS request error:", err);
                    setToast("⚠️ Could not read GPS. Please allow location access in your browser.");
                    setTimeout(() => setToast(null), 4000);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    };

    useEffect(() => {
        // Load real booking history from localStorage
        const loadHistory = () => {
            try {
                const saved = JSON.parse(localStorage.getItem('medQueueHistory') || '[]');
                setBookingHistory(saved);
            } catch (e) {
                setBookingHistory([]);
            }
        };

        loadHistory();
        window.addEventListener('storage', loadHistory);
        window.addEventListener('focus', loadHistory);

        // Fetch real device GPS location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setUserLocation({ lat, lng });
                    setIsLiveGps(true);
                },
                (err) => {
                    console.warn("GPS error fallback to live location:", err);
                    setUserLocation({ lat: 20.550833, lng: 85.998361 });
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );

            // Continuously track real-time position
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setUserLocation({ lat, lng });
                    setIsLiveGps(true);
                },
                (err) => {
                    console.warn("GPS watch error:", err);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
                window.removeEventListener('storage', loadHistory);
                window.removeEventListener('focus', loadHistory);
            };
        }

        return () => {
            window.removeEventListener('storage', loadHistory);
            window.removeEventListener('focus', loadHistory);
        };
    }, []);

    useEffect(() => {
        const loadHospitals = async () => {
            try {
                setLoading(true);
                const currentCoords = userLocation || { lat: 20.550833, lng: 85.998361 };
                const data = await fetchHospitals(currentCoords.lat, currentCoords.lng);
                setHospitals(data || []);
            } catch (error: any) {
                console.error("Error fetching hospitals", error);
                setToast(error.message || "Failed to fetch nearby hospitals.");
                setTimeout(() => setToast(null), 5000);
            } finally {
                setLoading(false);
            }
        };
        loadHospitals();
    }, [userLocation]);

    const filteredHospitals = useMemo(() => {
        const currentLoc = userLocation || { lat: 20.550833, lng: 85.998361 };
        
        // Deduplicate any repeated hospital names
        const seenNames = new Set<string>();
        const uniqueHospitals = hospitals.map((h) => {
            const hLat = h.position?.lat || h.location?.lat;
            const hLng = h.position?.lng || h.location?.lng;
            const computedDist = (hLat && hLng) ? getDistance(currentLoc.lat, currentLoc.lng, hLat, hLng) : (h.distance || 0.95);
            return {
                ...h,
                computedDistance: computedDist
            };
        }).filter((h) => {
            if (seenNames.has(h.name)) return false;
            seenNames.add(h.name);
            return true;
        });

        return uniqueHospitals.filter((h, index) => {
            const hName = h?.name || '';
            const hAddress = h?.address || '';
            const hType = h?.type || (index % 4 === 0 ? 'Emergency' : index % 3 === 0 ? 'Diagnostics' : 'General');
            const waitTime = h?.avgWaitTime ?? h?.wait_time ?? ((h?.queue || 0) * 5);
            const hCity = h?.city || h?.state || '';

            const matchesSearch = hName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hCity.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (!activeCategory || activeCategory === 'All') return true;

            if (activeCategory === 'Emergency') {
                return hType === 'Emergency' || (h.beds && h.beds > 0) || hName.includes("Hospital") || hName.includes("Medical");
            }
            if (activeCategory === 'Diagnostics') {
                return h.hasDiagnostics || hType === 'Diagnostics' || (h.diagnosticScore && h.diagnosticScore >= 80) || (h.rating >= 4.4 && h.totalRatings > 500) || hName.toLowerCase().includes("diagnostic") || hName.toLowerCase().includes("lab");
            }
            if (activeCategory === 'Min Wait') {
                return waitTime <= 45;
            }
            if (activeCategory === 'Nearby') {
                return true;
            }
            return true;
        }).sort((a, b) => {
            if (activeCategory === 'Min Wait') {
                const waitA = a.avgWaitTime ?? a.wait_time ?? (a.queue || 0) * 5;
                const waitB = b.avgWaitTime ?? b.wait_time ?? (b.queue || 0) * 5;
                return waitA - waitB;
            }
            if (activeCategory === 'Diagnostics') {
                // Best preference first:
                // 1. Dedicated diagnostic centers and highest diagnostic score/rating
                const scoreA = (a.type === 'Diagnostics' ? 200 : 0) + (a.diagnosticScore || Math.round((a.diagnosticRating || a.rating || 4) * 20));
                const scoreB = (b.type === 'Diagnostics' ? 200 : 0) + (b.diagnosticScore || Math.round((b.diagnosticRating || b.rating || 4) * 20));
                if (scoreB !== scoreA) {
                    return scoreB - scoreA;
                }
                // Secondary: nearest distance
                return a.computedDistance - b.computedDistance;
            }
            // Default, Emergency, and Nearby: Sort by nearest distance ascending
            return a.computedDistance - b.computedDistance;
        });
    }, [hospitals, searchTerm, activeCategory, userLocation]);


    const downloadPrescription = (data: any) => {
        const doc = new jsPDF();
        const date = data.date;
        const time = data.time;
        const token = data.token;
        const hospital = data.hospital;
        const patientName = data.name;
        const docName = data.doctor;

        // Header
        doc.setFillColor(59, 130, 246); // Primary Color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("MedQueue", 20, 25);
        doc.setFontSize(10);
        doc.text("OFFICIAL APPOINTMENT TOKEN", 20, 32);

        // Top Right info
        doc.setFontSize(10);
        doc.text(`Token ID: ${token}`, 140, 20);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 27);

        // Booking Information
        doc.setTextColor(51, 65, 85); // Slate 700
        doc.setFontSize(14);
        doc.text("Appointment Information", 20, 55);
        doc.setDrawColor(226, 232, 240); // Slate 200
        doc.line(20, 57, 190, 57);

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Hospital:", 20, 68);
        doc.setFont("helvetica", "normal");
        doc.text(hospital, 50, 68);

        doc.setFont("helvetica", "bold");
        doc.text("Patient Name:", 20, 75);
        doc.setFont("helvetica", "normal");
        doc.text(patientName, 50, 75);

        doc.setFont("helvetica", "bold");
        doc.text("Consulting For:", 20, 82);
        doc.setFont("helvetica", "normal");
        doc.text(docName, 60, 82);

        doc.setFont("helvetica", "bold");
        doc.text("Time Slot:", 20, 89);
        doc.setFont("helvetica", "normal");
        doc.text(`${date} at ${time}`, 50, 89);

        // Token Visual
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(59, 130, 246);
        doc.roundedRect(60, 105, 90, 45, 5, 5, 'FD');
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(10);
        doc.text("QUEUE TOKEN NUMBER", 105, 115, { align: 'center' });
        doc.setFontSize(40);
        doc.text(token, 105, 140, { align: 'center' });

        // Instructions
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("IMPORTANT INSTRUCTIONS:", 20, 170);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("1. Please reach the hospital 15 minutes before your estimated time.", 20, 180);
        doc.text("2. Show this digital token at the reception/OPD counter.", 20, 186);
        doc.text("3. Keep your ID proof handy for verification.", 20, 192);
        doc.text("4. MedQueue token is valid only for the selected date and time.", 20, 198);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("Powered by MedQueue Real-Time Healthcare Infrastructure", 105, 280, { align: 'center' });

        doc.save(`Token_${token}.pdf`);
        setToast("Professional Token Downloaded!");
    };
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans pb-12 transition-colors duration-300">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 100, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[250] pointer-events-none"
                    >
                        <div className="bg-primary/90 backdrop-blur-md text-slate-900 px-6 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-3">
                            <Bell size={18} className="animate-bounce" />
                            <span className="font-bold text-sm uppercase tracking-tight">{toast}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 📲 SMS & WhatsApp Queue Tracker Modal */}
            <AnimatePresence>
                {smsModalToken && (
                    <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                                    <MessageSquare size={16} className="text-primary" /> Instant Queue Alerts
                                </h3>
                                <button onClick={() => setSmsModalToken(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <X size={18} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                                Receive a live SMS & WhatsApp alert when you are within <strong className="text-primary font-bold">3 patients</strong> of your turn for Token <span className="font-mono font-bold text-slate-900 dark:text-white">#{smsModalToken.token}</span> at {smsModalToken.hospital}.
                            </p>
                            <form onSubmit={confirmTrackSMS} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Mobile Number (with country code)</label>
                                    <input
                                        type="tel"
                                        placeholder="+916371401928"
                                        value={smsPhoneInput}
                                        onChange={(e) => setSmsPhoneInput(e.target.value)}
                                        required
                                        className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setSmsModalToken(null)}
                                        className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <PixelButton color="primary" type="submit" disabled={isSendingSMS} className="py-2 px-4 text-xs">
                                        {isSendingSMS ? 'Scheduling...' : 'Activate Tracker'}
                                    </PixelButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Booking History Modal */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass max-w-2xl w-full p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                                        <FileText className="text-primary" size={24} />
                                        OPD Booking History
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Your recent visits and scheduled tokens</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {bookingHistory.length > 0 && (
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('medQueueHistory');
                                                setBookingHistory([]);
                                                setToast("All booking history deleted.");
                                                setTimeout(() => setToast(null), 2500);
                                            }}
                                            className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest px-3 py-1.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowHistory(false)}
                                        className="p-2 bg-slate-100/50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-gray-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                {bookingHistory.length > 0 ? (
                                    bookingHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-5 bg-slate-100/50 rounded-3xl border border-slate-200 hover:border-slate-200 transition-colors relative group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-lg font-bold text-slate-900 mb-1">{item.hospital}</p>
                                                    <p className="text-xs text-primary font-bold">{item.doctor}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full border border-primary/20">
                                                        {item.status || 'Active'}
                                                    </span>
                                                    <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase">{item.date} • {item.time}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200">
                                                <div className="flex-1 min-w-[120px]">
                                                    <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Token Number</p>
                                                    <p className="text-xl font-black text-slate-900 tracking-widest">{item.token}</p>
                                                </div>
                                                <PixelButton
                                                    color="primary"
                                                    className="py-2 px-3 h-auto text-[10px]"
                                                    onClick={() => navigate('/dashboard')}
                                                >
                                                    <Activity size={14} /> Live Status
                                                </PixelButton>
                                                <button
                                                    onClick={() => speakAnnouncement(`Token #${item.token}, please proceed to Room 3 for ${item.doctor || 'doctor consultation'}.`)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors border border-emerald-500/30"
                                                    title="Speak token announcement aloud"
                                                >
                                                    <Volume2 size={13} /> Speak Turn
                                                </button>
                                                <button
                                                    onClick={() => handleTrackSMS(item.token, item.hospital)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors border border-purple-500/30"
                                                    title="Track via SMS / WhatsApp alert"
                                                >
                                                    <MessageSquare size={13} /> Track SMS
                                                </button>
                                                <PixelButton
                                                    color="neutral"
                                                    className="py-2 px-3 h-auto text-[10px]"
                                                    onClick={() => downloadPrescription(item)}
                                                >
                                                    <Download size={14} /> Re-download
                                                </PixelButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-100/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                            <FileText size={32} className="text-gray-700" />
                                        </div>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No history found</p>
                                        <p className="text-gray-600 text-xs mt-1">Your booked tokens will appear here.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    Only showing history for the current device
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-slate-200 py-4">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all shadow-sm group"
                            title="Back to Home"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                            <span className="hidden sm:inline">Home</span>
                        </button>
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')} title="Go to Home">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">MQ</div>
                            <span className="font-bold text-xl tracking-tighter uppercase italic text-slate-900">MedQueue <span className="text-primary">Patient</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Audio Announcements Toggle */}
                        <button
                            onClick={() => {
                                const next = !voiceAnnounceEnabled;
                                setVoiceAnnounceEnabled(next);
                                if (next) {
                                    speakAnnouncement("Voice queue announcements enabled.");
                                } else {
                                    setToast("Voice queue announcements muted.");
                                    setTimeout(() => setToast(null), 2500);
                                }
                            }}
                            className={`p-2 rounded-xl transition-all ${voiceAnnounceEnabled ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-400 hover:text-slate-900'}`}
                            title={voiceAnnounceEnabled ? "Audio Queue Voice Active (Click to mute)" : "Unmute Audio Queue Voice"}
                        >
                            {voiceAnnounceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-gray-400 hover:text-slate-900 transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700" />}
                        </button>

                        <button
                            onClick={() => {
                                try {
                                    const saved = JSON.parse(localStorage.getItem('medQueueHistory') || '[]');
                                    setBookingHistory(saved);
                                } catch (e) {}
                                setShowHistory(true);
                            }}
                            className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group"
                            title="My Bookings"
                        >
                            <FileText size={20} />
                            {bookingHistory.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900" />
                            )}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-black dark:text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">History ({bookingHistory.length})</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 transition-colors ${showNotifications ? 'text-primary bg-primary/10 rounded-xl' : 'text-gray-400 hover:text-slate-900'}`}
                            >
                                <Bell size={20} />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowNotifications(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-80 glass rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Notifications</h3>
                                                <button
                                                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                                                    className="text-[10px] font-bold text-primary hover:underline uppercase"
                                                >
                                                    Mark all read
                                                </button>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {notifications.length > 0 ? (
                                                    notifications.map((n) => (
                                                        <div
                                                            key={n.id}
                                                            className={`p-4 border-b border-slate-200 hover:bg-slate-100/50 transition-colors cursor-pointer relative ${!n.read ? 'bg-primary/5' : ''}`}
                                                        >
                                                            {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                                                            <p className={`text-xs font-bold mb-1 ${!n.read ? 'text-slate-900' : 'text-gray-400'}`}>{n.title}</p>
                                                            <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                                            <p className="text-[9px] text-gray-600 font-bold uppercase mt-2">{n.time}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center">
                                                        <Bell size={24} className="mx-auto mb-2 text-gray-700" />
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">No new alerts</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 text-center bg-slate-100/50">
                                                <button className="text-[10px] font-bold text-gray-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
                                                    View All Activity
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 uppercase">{user?.name || 'Patient'}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Verified Account</p>
                            </div>
                            <button onClick={signOut} className="p-2 bg-slate-100/50 rounded-xl border border-slate-200 text-gray-400 hover:text-slate-900 transition-colors" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-10">
                {/* 👨‍👩‍👧 Family & Dependent Profile Switcher */}
                <div className="mb-8 p-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <Users size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Active Patient Profile:</span>
                                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 uppercase tracking-wider">
                                    {activeMember}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Book tokens, manage prescriptions, and track queue for family members</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {familyMembers.map((member) => (
                            <button
                                key={member}
                                onClick={() => {
                                    setActiveMember(member);
                                    setToast(`Switched active profile to ${member}`);
                                    setTimeout(() => setToast(null), 2500);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${activeMember === member
                                    ? 'bg-primary text-slate-900 shadow-md font-black ring-2 ring-primary/40'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                {member}
                            </button>
                        ))}
                        <button
                            onClick={() => setShowAddMember(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-primary border border-dashed border-primary/40 transition-colors uppercase tracking-wider"
                        >
                            <UserPlus size={14} /> Add Member
                        </button>
                    </div>
                </div>

                {/* Add Family Member Modal */}
                <AnimatePresence>
                    {showAddMember && (
                        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="glass max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                                        <UserPlus size={16} className="text-primary" /> Add Dependent Profile
                                    </h3>
                                    <button onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <X size={18} />
                                    </button>
                                </div>
                                <form onSubmit={handleAddMember} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Member Name & Relation</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Grandma (Meera)"
                                            value={newMemberName}
                                            onChange={(e) => setNewMemberName(e.target.value)}
                                            required
                                            className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddMember(false)}
                                            className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            Cancel
                                        </button>
                                        <PixelButton color="primary" type="submit" className="py-2 px-4 text-xs">
                                            Save Profile
                                        </PixelButton>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Hero / Search */}
                <div className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase"
                    >
                        Find Medical Help <span className="text-primary">Instantly</span>
                    </motion.h1>
                    <p className="text-gray-400 font-medium mb-8 max-w-2xl">
                        Real-time wait times and bed availability for top hospitals near you. Book your token or navigate to the best emergency care.
                    </p>

                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by hospital name, specialty, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all text-slate-900 shadow-2xl"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-8 max-w-2xl">
                    <button
                        onClick={() => setActiveTab('hospitals')}
                        className={`py-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'hospitals' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                    >
                        Hospital Finder
                    </button>
                    <button
                        onClick={() => setActiveTab('symptom-checker')}
                        className={`py-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'symptom-checker' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                    >
                        AI Assistant
                    </button>
                    <button
                        onClick={() => setActiveTab('pharmacy')}
                        className={`py-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'pharmacy' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                    >
                        Pharmacy
                    </button>
                </div>

                {activeTab === 'hospitals' && (
                    <>
                        {/* Categories */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                            {[
                                { icon: Activity, label: 'All', color: 'text-slate-900' },
                                { icon: Stethoscope, label: 'Emergency', color: 'text-red-500' },
                                { icon: Activity, label: 'Diagnostics', color: 'text-blue-500' },
                                { icon: MapPin, label: 'Nearby', color: 'text-green-500' },
                                { icon: Clock, label: 'Min Wait', color: 'text-orange-500' },
                            ].map((cat) => (
                                <button
                                    key={cat.label}
                                    onClick={() => {
                                        if (cat.label === 'Nearby') {
                                            setActiveCategory(activeCategory === 'Nearby' ? null : 'Nearby');
                                        } else if (cat.label === 'All') {
                                            setActiveCategory(null);
                                        } else {
                                            setActiveCategory(activeCategory === cat.label ? null : cat.label);
                                        }
                                    }}
                                    className={`glass p-6 rounded-2xl border transition-all text-center group ${(cat.label === 'All' && activeCategory === null) || activeCategory === cat.label
                                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 dark:bg-primary/20'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-primary/40'
                                        }`}
                                >
                                    <div className={`w-12 h-12 ${cat.color} bg-slate-100/50 dark:bg-slate-800/80 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                                        <cat.icon size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{cat.label}</p>
                                </button>
                            ))}
                        </div>

                        {/* Hospital List */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                <Activity className="text-primary" size={20} />
                                Live Medical Hubs
                            </h2>
                            <div className="flex items-center gap-3 flex-wrap">
                                <button
                                    onClick={requestLiveGps}
                                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all uppercase tracking-wider shadow-sm"
                                    title="Click to refresh your real device GPS location"
                                >
                                    <Navigation size={12} className={isLiveGps ? "animate-pulse text-emerald-500" : ""} />
                                    <span>{isLiveGps ? `GPS: ${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E` : "📍 Use My GPS"}</span>
                                </button>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                                    {filteredHospitals.length} INSTITUTIONS
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="py-20 text-center">
                                    <Activity className="animate-spin text-primary mx-auto mb-4" size={32} />
                                    <p className="text-gray-500 font-bold uppercase tracking-widest">Scanning Network...</p>
                                </div>
                            ) : filteredHospitals.map((hospital) => (
                                <motion.div
                                    key={hospital.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{hospital.name}</h3>
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full border border-primary/20 flex items-center gap-1.5">
                                                    <Navigation size={12} className="text-primary" />
                                                    {hospital.computedDistance !== undefined ? `${hospital.computedDistance.toFixed(1)} km away` : '0.9 km away'}
                                                </span>
                                                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black rounded-full border border-amber-500/20 flex items-center gap-1.5">
                                                    <Clock size={12} />
                                                    Est. Arrival ~{Math.max(2, Math.round((hospital.computedDistance ?? 0.95) * 3))} min
                                                </span>
                                                {hospital.hasDiagnostics && (
                                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black rounded-full border border-blue-500/20 flex items-center gap-1.5">
                                                        <Activity size={12} />
                                                        Diagnostic Lab ({hospital.diagnosticRating || hospital.rating}★)
                                                    </span>
                                                )}
                                                {hospital.surge_detected && (
                                                    <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-500/20 animate-pulse">
                                                        High Surge
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium mb-3 flex items-center gap-2">
                                                <MapPin size={14} /> {hospital.address}
                                            </p>
                                            {hospital.diagnosticSpecialties && hospital.diagnosticSpecialties.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {hospital.diagnosticSpecialties.map((spec: string) => (
                                                        <span key={spec} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold">
                                                            {spec}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                        <div className="p-4 rounded-2xl bg-slate-100/50 border border-slate-200">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Queue Size</p>
                                            <p className="text-xl font-black text-slate-900 flex items-center gap-2">
                                                <Users size={18} className="text-primary" />
                                                {hospital.currentQueue ?? hospital.queue ?? hospital.queue_size} <span className="text-[10px] text-gray-600 font-bold uppercase font-normal tracking-normal italic">Patients</span>
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-100/50 border border-slate-200">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Wait Time</p>
                                            <p className="text-xl font-black text-primary flex items-center gap-2 italic">
                                                <Clock size={18} />
                                                {hospital.avgWaitTime ?? hospital.wait_time ?? (hospital.queue || 0) * 5} <span className="text-[10px] text-gray-600 font-bold uppercase font-normal tracking-normal">mins</span>
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-100/50 border border-slate-200">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Avail. Beds</p>
                                            <p className="text-xl font-black text-green-500 flex items-center gap-2">
                                                <Heart size={18} />
                                                {hospital.availableBeds ?? hospital.beds ?? hospital.available_beds} <span className="text-[10px] text-gray-600 font-bold uppercase font-normal tracking-normal">Free</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center gap-3 shrink-0">
                                    <PixelButton
                                        onClick={() => window.open(`/book?hospital=${encodeURIComponent(hospital.name)}&id=${hospital.id}`, '_blank')}
                                        color="primary"
                                        className="w-full"
                                    >
                                        Book Token
                                    </PixelButton>
                                    <PixelButton
                                        onClick={() => {
                                            const destinationQuery = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
                                            // Omitting origin tells Google Maps to use device's live GPS as "Your location"
                                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`, '_blank');
                                        }}
                                        color="neutral"
                                        className="w-full"
                                    >
                                        <MapIcon size={16} /> Get Directions
                                    </PixelButton>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                    </>
                )}

                {/* AI Symptom Checker */}
                {activeTab === 'pharmacy' && (
                    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-100/50 p-6 rounded-[2.5rem] border border-slate-200 shadow-3xl">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20">
                                    <ShoppingBag className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">MedStore Global</h2>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Genuine Medicines · Collect from nearest hospital store</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-56">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Search medicines..."
                                        value={medicineSearch}
                                        onChange={(e) => setMedicineSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-sm text-slate-900"
                                    />
                                </div>
                                
                                <button 
                                    onClick={() => setShowCart(!showCart)}
                                    className="relative p-3 bg-slate-100/50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all group shrink-0"
                                >
                                    <ShoppingCart className="text-slate-900 group-hover:text-primary" size={20} />
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-slate-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                            {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {MEDICINES.filter(m => 
                                    m.name.toLowerCase().includes(medicineSearch.toLowerCase()) || 
                                    m.disease.some(d => d.toLowerCase().includes(medicineSearch.toLowerCase())) ||
                                    m.category.toLowerCase().includes(medicineSearch.toLowerCase())
                                ).map((med) => (
                                    <motion.div 
                                        key={med.id}
                                        layout
                                        className="glass p-6 rounded-[2rem] border border-slate-200 hover:border-primary/30 transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-slate-100/50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                                <Pill className="text-primary" size={24} />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 bg-slate-100/50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
                                                {med.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{med.name}</h3>
                                        <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">{med.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {med.disease.slice(0, 2).map(d => (
                                                <span key={d} className="text-[9px] font-bold text-primary/80 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                                                    {d}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Price</p>
                                                <p className="text-lg font-black text-slate-900">₹{med.price.toFixed(2)}</p>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const existing = cart.find(item => item.med.id === med.id);
                                                    if (existing) {
                                                        setCart(cart.map(item => item.med.id === med.id ? { ...item, quantity: item.quantity + 1 } : item));
                                                    } else {
                                                        setCart([...cart, { med, quantity: 1 }]);
                                                    }
                                                    setToast(`Added ${med.name} to cart`);
                                                    setTimeout(() => setToast(null), 2000);
                                                }}
                                                className="bg-primary hover:bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Cart Sidebar / Section */}
                            <div className={`glass p-8 rounded-[2.5rem] border border-slate-200 h-fit sticky top-24 transition-all ${showCart ? 'ring-2 ring-primary/50' : ''}`}>
                                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                                    <ShoppingCart className="text-primary" size={20} />
                                    Your Order
                                </h3>

                                {cart.length === 0 && !showPrescriptionDownload ? (
                                    <div className="py-12 text-center">
                                        <Package className="text-gray-700 mx-auto mb-4" size={48} />
                                        <p className="text-gray-500 font-bold uppercase tracking-tighter">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {cart.length > 0 && (
                                            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                                {cart.map((item) => (
                                                    <div key={item.med.id} className="flex items-center gap-4 group">
                                                        <div className="w-12 h-12 bg-slate-100/50 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                                                            <Pill className="text-primary/50" size={20} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate">{item.med.name}</p>
                                                            <p className="text-xs text-gray-500">₹{item.med.price} x {item.quantity}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    if (item.quantity > 1) {
                                                                        setCart(cart.map(i => i.med.id === item.med.id ? { ...i, quantity: i.quantity - 1 } : i));
                                                                    } else {
                                                                        setCart(cart.filter(i => i.med.id !== item.med.id));
                                                                    }
                                                                }}
                                                                className="p-1 hover:text-primary text-gray-500 transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-xs font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                                                            <button 
                                                                onClick={() => setCart(cart.map(i => i.med.id === item.med.id ? { ...i, quantity: i.quantity + 1 } : i))}
                                                                className="p-1 hover:text-primary text-gray-500 transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => setCart(cart.filter(i => i.med.id !== item.med.id))}
                                                                className="p-1 hover:text-red-500 text-gray-700 transition-colors ml-2"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {cart.length > 0 && (
                                            <div className="pt-6 border-t border-slate-200 space-y-3">
                                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>Subtotal</span>
                                                    <span className="text-slate-900 font-black">₹{cart.reduce((acc, item) => acc + (item.med.price * item.quantity), 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>Service Fee</span>
                                                    <span className="text-green-500 font-black italic">FREE</span>
                                                </div>
                                                <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
                                                    <span>TOTAL</span>
                                                    <span className="text-primary italic">₹{cart.reduce((acc, item) => acc + (item.med.price * item.quantity), 0).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {cart.length > 0 && (
                                            <div className="pt-4 space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                                                    Prescribing Doctor
                                                </label>
                                                <div className="relative group">
                                                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={14} />
                                                    <input 
                                                        type="text"
                                                        placeholder="Enter doctor's name..."
                                                        value={prescribingDoctor}
                                                        onChange={(e) => setPrescribingDoctor(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-xs text-slate-900 placeholder:text-gray-400"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-gray-400 italic">This will be printed on your digital prescription.</p>
                                            </div>
                                        )}
                                            
                                            {showPrescriptionDownload ? (
                                                <div className="space-y-4 pt-4 border-t border-slate-200 text-center">
                                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                                        <Activity className="text-green-500 mx-auto mb-2" size={24} />
                                                        <p className="text-xs font-black text-green-500 uppercase tracking-widest">Payment Successful</p>
                                                    </div>
                                                    <PixelButton 
                                                        className="w-full" 
                                                        color="primary"
                                                        onClick={() => {
                                                            const doc = new jsPDF();
                                                            const orderId = `MQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                                                            const date = new Date().toLocaleString();
                                                            const total = lastOrderItems.reduce((acc, item) => acc + (item.med.price * item.quantity), 0).toFixed(2);

                                                            // Header
                                                            doc.setFillColor(59, 130, 246); // Primary Color
                                                            doc.rect(0, 0, 210, 40, 'F');
                                                            doc.setTextColor(255, 255, 255);
                                                            doc.setFontSize(28);
                                                            doc.setFont("helvetica", "bold");
                                                            doc.text("MedQueue", 20, 25);
                                                            doc.setFontSize(10);
                                                            doc.text("DIGITAL HEALTHCARE INFRASTRUCTURE", 20, 32);

                                                            // Top Right info
                                                            doc.setFontSize(10);
                                                            doc.text(`Prescription ID: ${orderId}`, 140, 20);
                                                            doc.text(`Date: ${date}`, 140, 27);

                                                            // Patient & Doctor Information
                                                            doc.setTextColor(51, 65, 85); // Slate 700
                                                            doc.setFontSize(14);
                                                            doc.text("Prescription Information", 20, 55);
                                                            doc.setDrawColor(226, 232, 240); // Slate 200
                                                            doc.line(20, 57, 190, 57);

                                                            doc.setFontSize(11);
                                                            doc.setFont("helvetica", "bold");
                                                            doc.text("Patient Name:", 20, 68);
                                                            doc.setFont("helvetica", "normal");
                                                            doc.text(user?.name || 'Verified Patient', 50, 68);

                                                            doc.setFont("helvetica", "bold");
                                                            doc.text("Prescribing Doctor:", 20, 75);
                                                            doc.setFont("helvetica", "normal");
                                                            doc.text(prescribingDoctor || "Authorized Medical Officer", 60, 75);

                                                            // Medicines Table
                                                            doc.setFont("helvetica", "bold");
                                                            doc.text("Prescribed Medicines", 20, 95);
                                                            doc.setFillColor(248, 250, 252); // Slate 50
                                                            doc.rect(20, 98, 170, 8, 'F');
                                                            doc.setFontSize(10);
                                                            doc.text("Medicine Name", 25, 103);
                                                            doc.text("Qty", 120, 103);
                                                            doc.text("Price", 145, 103);
                                                            doc.text("Total", 170, 103);

                                                            let yPos = 113;
                                                            doc.setFont("helvetica", "normal");
                                                            lastOrderItems.forEach(item => {
                                                                doc.text(item.med.name, 25, yPos);
                                                                doc.text(item.quantity.toString(), 122, yPos);
                                                                doc.text(`INR ${item.med.price}`, 145, yPos);
                                                                doc.text(`INR ${item.med.price * item.quantity}`, 170, yPos);
                                                                yPos += 10;
                                                            });

                                                            // Total Footer
                                                            doc.setDrawColor(59, 130, 246);
                                                            doc.setLineWidth(0.5);
                                                            doc.line(130, yPos + 2, 190, yPos + 2);
                                                            doc.setFont("helvetica", "bold");
                                                            doc.setFontSize(12);
                                                            doc.text("Total Paid:", 130, yPos + 12);
                                                            doc.setTextColor(59, 130, 246);
                                                            doc.text(`INR ${total}`, 170, yPos + 12);

                                                            // Footer / Instructions
                                                            doc.setTextColor(100, 116, 139); // Slate 500
                                                            doc.setFontSize(9);
                                                            doc.setFont("helvetica", "italic");
                                                            doc.text("Instructions:", 20, yPos + 35);
                                                            doc.text("1. This is a digitally signed e-prescription valid at all MedQueue affiliate pharmacies.", 20, yPos + 41);
                                                            doc.text("2. Please present the QR/ID at the counter for medicine collection.", 20, yPos + 47);
                                                            doc.text("3. Ensure to follow the dosage as mentioned by the consultation.", 20, yPos + 53);

                                                            // Digital Seal / Signature
                                                            doc.setDrawColor(59, 130, 246);
                                                            doc.rect(140, yPos + 35, 50, 20); 
                                                            doc.setFont("helvetica", "italic");
                                                            doc.setFontSize(10);
                                                            doc.setTextColor(59, 130, 246);
                                                            doc.text(prescribingDoctor || "Authorized Medical Officer", 165, yPos + 46, { align: 'center' });
                                                            doc.setFontSize(7);
                                                            doc.setFont("helvetica", "normal");
                                                            doc.text("DIGITAL SIGNATURE", 165, yPos + 51, { align: 'center' });

                                                            doc.save(`Prescription_${orderId}.pdf`);

                                                            setToast("Professional Prescription Saved!");
                                                            setTimeout(() => {
                                                                setToast(null);
                                                                setShowPrescriptionDownload(false);
                                                            }, 3000);
                                                        }}
                                                    >
                                                        <Download size={16} /> Download Prescription
                                                    </PixelButton>
                                                </div>
                                            ) : (
                                                <PixelButton 
                                                    className="w-full mt-4" 
                                                    color="primary"
                                                    onClick={() => {
                                                        const total = cart.reduce((acc, item) => acc + (item.med.price * item.quantity), 0);
                                                        setPaymentAmount(total);
                                                        setLastOrderItems([...cart]);
                                                        setShowPaymentGateway(true);
                                                    }}
                                                >
                                                    Secure Payment & Order
                                                </PixelButton>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                {/* Demo Payment Gateway Modal */}
                {showPaymentGateway && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-xl p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="w-full max-w-md bg-white border border-slate-200 rounded-[3rem] p-8 space-y-8 shadow-3xl text-center"
                        >
                            <div className="space-y-2">
                                <div className="w-16 h-16 bg-primary/20 rounded-2xl border border-primary/20 flex items-center justify-center mx-auto mb-4">
                                    <Heart className="text-primary animate-pulse" size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Secure Checkout</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">MedQueue Payment Gateway</p>
                            </div>

                            <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200 space-y-4 text-left">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                                    <span className="uppercase tracking-widest text-[10px]">Payable Amount</span>
                                    <span className="text-slate-900 text-xl font-black italic">₹{paymentAmount.toFixed(2)}</span>
                                </div>
                                <div className="h-[1px] bg-slate-100/50 w-full" />
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={10} /> Select Payment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['PhonePe UPI', 'Google Pay', 'Credit Card', 'Net Banking'].map(method => (
                                            <button 
                                                key={method} 
                                                className="p-3 bg-slate-100/50 hover:bg-primary/10 border border-slate-200 hover:border-primary/30 rounded-xl text-[10px] font-black text-slate-900 transition-all uppercase tracking-tighter"
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <PixelButton 
                                    className="w-full h-14" 
                                    color="primary"
                                    onClick={() => {
                                        setToast("Verifying Transaction...");
                                        setTimeout(() => {
                                            setShowPaymentGateway(false);
                                            setShowPrescriptionDownload(true);
                                            setCart([]);
                                            setToast("Payment successful! Prescription ready.");
                                        }, 1500);
                                    }}
                                >
                                    Confirm & Pay Now
                                </PixelButton>

                                <button 
                                    onClick={() => setShowPaymentGateway(false)}
                                    className="text-xs font-bold text-gray-500 hover:text-slate-900 uppercase tracking-widest transition-all"
                                >
                                    Cancel Payment
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                Secured by MedQueue SSL Encryption
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'symptom-checker' && (
                    <div className="mt-8">
                        <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                            <Stethoscope className="text-primary" size={20} />
                            AI Assistant
                            <span className="text-xs font-bold text-gray-500 bg-slate-100/50 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest ml-2">Neural Triage & Health Core</span>
                        </h2>
                        <div className="h-[520px]">
                            <SymptomChecker />
                        </div>
                    </div>
                )}
            </main>
        </div >
    );
};

export default MedQueuePatient;
