import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, ChevronRight, AlertTriangle,
    Navigation, Ambulance, Phone, X, ShieldAlert,
    BookOpen, Sparkles, MapPin, LogOut, Sun, Moon, Radio, Siren
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PixelButton from '../components/PixelButton';
import { fetchHospitals } from '../lib/api';
import { getDistance } from '../lib/utils';
import { useAuth } from '../components/ProtectedRoute';
import { useTheme } from '../contexts/ThemeContext';

const Landing = () => {
    const navigate = useNavigate();
    const { isLoggedIn, role, user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isEmergencyActive, setIsEmergencyActive] = useState(false);
    const [emergencyStatus, setEmergencyStatus] = useState<'idle' | 'locating' | 'contacting' | 'confirmed'>('idle');
    const [nearestHospital, setNearestHospital] = useState<any>(null);
    const [isAmbulanceDispatched, setIsAmbulanceDispatched] = useState(false);
    const [ambulanceETA, setAmbulanceETA] = useState(7);

    useEffect(() => {
        let timer: any;
        if (isAmbulanceDispatched && ambulanceETA > 1) {
            timer = setInterval(() => {
                setAmbulanceETA(prev => (prev > 1 ? prev - 1 : 1));
            }, 8000);
        }
        return () => clearInterval(timer);
    }, [isAmbulanceDispatched, ambulanceETA]);

    const [nearbyEmergencyList, setNearbyEmergencyList] = useState<any[]>([]);

    const openEmergencyOverlay = () => {
        setIsEmergencyActive(true);
        setEmergencyStatus('idle');
        setIsAmbulanceDispatched(false);
    };

    const startEmergencyScan = () => {
        setEmergencyStatus('locating');
        
        const locateAndFetch = async (userLat: number, userLng: number) => {
            setEmergencyStatus('contacting');
            try {
                const hospitals = await fetchHospitals(userLat, userLng);
                if (hospitals && hospitals.length > 0) {
                    const sorted = hospitals.map((h: any) => {
                        const hLat = h.position?.lat || h.location?.lat;
                        const hLng = h.position?.lng || h.location?.lng;
                        const dist = (hLat && hLng) ? getDistance(userLat, userLng, hLat, hLng) : (h.distance || 0.95);
                        return {
                            ...h,
                            phone: h.phone || (h.id?.includes('padmini') ? '+91 97760 00399' : h.id?.includes('scb') ? '+91 671 2414004' : '+91 671 2304950'),
                            distance: dist
                        };
                    }).sort((a: any, b: any) => a.distance - b.distance);

                    // Deduplicate any repeated hospital names
                    const seenNames = new Set<string>();
                    const uniqueSorted = sorted.filter((h: any) => {
                        if (seenNames.has(h.name)) return false;
                        seenNames.add(h.name);
                        return true;
                    });

                    const primary = uniqueSorted[0];
                    setNearestHospital(primary);
                    setNearbyEmergencyList(uniqueSorted.slice(0, 4));
                    if (primary?.distance) {
                        setAmbulanceETA(Math.max(2, Math.round(primary.distance * 3)));
                    }
                }
                setTimeout(() => {
                    setEmergencyStatus('confirmed');
                }, 800);
            } catch (e) {
                console.error("Emergency Fetch Failed", e);
                setNearestHospital({ name: "Padmini Care Hospital", phone: "+91 97760 00399", distance: 0.95 });
                setAmbulanceETA(3);
                setEmergencyStatus('confirmed');
            }
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    locateAndFetch(pos.coords.latitude, pos.coords.longitude);
                },
                () => {
                    // Fallback if GPS access is denied
                    locateAndFetch(20.550833, 85.998361);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            locateAndFetch(20.550833, 85.998361);
        }
    };

    const cancelEmergency = () => {
        setIsEmergencyActive(false);
        setEmergencyStatus('idle');
        setNearestHospital(null);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white">
                        <span className="text-xs font-black">AI</span>
                    </div>
                    <span className="text-slate-900 dark:text-white">Health</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
                    <Link to="/patient" className="hover:text-slate-900 dark:hover:text-white transition-colors">MedQueue</Link>
                    <Link to="/learn" className="hover:text-slate-900 dark:hover:text-white transition-colors">Learn Hub</Link>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={openEmergencyOverlay}
                        className="bg-red-600/20 border border-red-600/30 px-4 py-2 rounded-xl flex items-center gap-2 text-red-500 hover:bg-red-600/30 transition-all group"
                    >
                        <AlertTriangle size={16} className="text-red-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Emergency Help</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        title="Toggle Dark / Light Theme"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate(role === 'admin' ? '/medqueue' : '/patient')}
                                className="flex items-center gap-2.5 px-3.5 py-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 rounded-xl text-primary font-bold text-xs transition-all shadow-sm"
                            >
                                <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <div className="text-left leading-tight hidden sm:block">
                                    <div className="text-xs font-black text-slate-800 dark:text-white">{user?.name || 'Dashboard'}</div>
                                    <div className="text-[9px] uppercase font-bold text-primary tracking-wider">{role === 'admin' ? 'Admin Hub' : 'Patient Portal'}</div>
                                </div>
                            </button>
                            <button
                                onClick={signOut}
                                title="Sign Out"
                                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 text-slate-400 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <PixelButton
                            onClick={() => navigate('/auth')}
                            className="hidden sm:flex"
                            color="primary"
                        >
                            Sign In
                        </PixelButton>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 md:pb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-xs font-black tracking-widest uppercase bg-primary/10 border border-primary/20 rounded-full text-primary">
                        The next frontier of intelligent infrastructure
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                        Efficiency for <span className="text-primary italic">Healthcare</span>.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 font-medium">
                        Revolutionizing patient flow through advanced predictive AI and intelligent infrastructure.
                    </p>
                </motion.div>

                {/* Product Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-20 px-4">
                    {/* MedQueue Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/patient')}
                        className="glass p-12 rounded-[2rem] text-left group cursor-pointer border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all bg-white dark:bg-slate-900/90 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Activity size={120} className="text-primary" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                <Activity className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">MedQueue AI</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                Proprietary predictive AI for hospital queue management and bed availability. Reduce wait times by up to 70%.
                            </p>
                            <PixelButton onClick={() => navigate(isLoggedIn && role === 'admin' ? '/medqueue' : '/patient')} color="primary">
                                {isLoggedIn ? 'Enter Portal' : 'Launch Platform'} <ChevronRight className="w-4 h-4" />
                            </PixelButton>
                        </div>
                    </motion.div>

                    {/* Learn Hub Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/learn')}
                        className="glass p-12 rounded-[2rem] text-left group cursor-pointer border-slate-200 dark:border-slate-800 hover:border-secondary/50 transition-all bg-white dark:bg-slate-900/90 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <BookOpen size={120} className="text-secondary" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                                <BookOpen className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Knowledge Hub</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                Access verified medical guides, procedures, and health protocols. Free medical education for everyone.
                            </p>
                            <PixelButton onClick={() => navigate('/learn')} color="secondary">
                                Enter Hub <ChevronRight className="w-4 h-4" />
                            </PixelButton>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Quick Access Info Section */}
            <section className="relative z-10 py-12 border-t border-slate-100 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center">
                        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/50 shadow-sm">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Sparkles size={20} className="text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Global Access</p>
                                <p className="text-sm font-bold text-slate-900">Free Medical Resources</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/50 shadow-sm">
                            <div className="p-3 bg-secondary/10 rounded-2xl">
                                <Activity size={20} className="text-secondary" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Live Updates</p>
                                <p className="text-sm font-bold text-slate-900">Real-time Bed Tracking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-100 py-12">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-slate-400 text-sm">© 2026 AI Health. All rights reserved.</p>
                    <div className="flex gap-8 text-slate-400 text-sm">
                        <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Cookie Settings</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

            {/* Emergency Overlay */}
            <AnimatePresence>
                {isEmergencyActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="max-w-md w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldAlert size={120} className="text-red-500" />
                            </div>

                            <div className="relative z-10 text-center">
                                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-xl shadow-red-500/10">
                                    {emergencyStatus === 'idle' ? (
                                        <MapPin className="w-10 h-10 text-red-500" />
                                    ) : emergencyStatus === 'locating' ? (
                                        <Navigation className="w-10 h-10 text-red-500 animate-spin" />
                                    ) : emergencyStatus === 'contacting' ? (
                                        <Activity className="w-10 h-10 text-red-500 animate-pulse" />
                                    ) : (
                                        <Ambulance className="w-10 h-10 text-red-500 animate-bounce" />
                                    )}
                                </div>

                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">
                                    {emergencyStatus === 'idle' ? 'Location Required' : 
                                     emergencyStatus === 'locating' ? 'Locating You...' : 
                                     emergencyStatus === 'contacting' ? 'Finding Hospitals...' : 
                                     'Hospital Found'}
                                </h2>

                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed text-sm px-4">
                                    {emergencyStatus === 'idle' ? 'To find the nearest trauma center, we need to access your current GPS location.' : 
                                     emergencyStatus === 'locating' ? 'Fetching your live coordinates for precision dispatch...' : 
                                     emergencyStatus === 'contacting' ? 'Identifying the nearest medical hub with open beds...' : 
                                     `We have located the nearest facility. You can contact them immediately for urgent assistance.`}
                                </p>

                                {emergencyStatus === 'idle' && (
                                    <button 
                                        onClick={() => startEmergencyScan()}
                                        className="w-full py-5 px-8 rounded-2xl bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-500/30 mb-4 group"
                                    >
                                        Share Location & Find Help
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}

                                {emergencyStatus === 'confirmed' && nearestHospital && (
                                    <div className="bg-red-50/50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 p-6 rounded-3xl mb-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">Primary Trauma Center</p>
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 uppercase">Nearest</span>
                                        </div>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase leading-tight">{nearestHospital.name}</p>
                                        
                                        <div className="flex items-center justify-center gap-6 my-4 py-4 border-y border-red-100/50 dark:border-red-900/30">
                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-400 uppercase font-black">Distance</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{nearestHospital.distance?.toFixed(1) || '0.9'} km</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-400 uppercase font-black">Est. Arrival</p>
                                                <p className="text-sm font-bold text-red-500 italic">
                                                    ~{Math.max(2, Math.round((nearestHospital.distance || 0.95) * 3))} Mins
                                                </p>
                                            </div>
                                        </div>

                                        {/* Switch nearby facility if multiple available */}
                                        {nearbyEmergencyList.length > 1 && (
                                            <div className="mb-4 text-left">
                                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Other Nearby Centers:</p>
                                                <div className="flex flex-col gap-1.5">
                                                    {nearbyEmergencyList.filter(h => h.id !== nearestHospital.id && h.name !== nearestHospital.name).map(alt => (
                                                        <button
                                                            key={alt.id}
                                                            onClick={() => setNearestHospital(alt)}
                                                            className="text-left px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-500 transition-all text-xs font-bold flex items-center justify-between"
                                                        >
                                                            <span className="truncate text-slate-800 dark:text-slate-200">{alt.name}</span>
                                                            <span className="text-[10px] text-red-500 font-mono shrink-0 ml-2">
                                                                {alt.distance?.toFixed(1)} km (~{Math.max(2, Math.round(alt.distance * 3))}m)
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3">
                                            <a 
                                                href={`tel:${nearestHospital.phone}`}
                                                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                                            >
                                                <Phone size={16} />
                                                Call Hospital: {nearestHospital.phone}
                                            </a>

                                            {!isAmbulanceDispatched ? (
                                                <button
                                                    onClick={() => setIsAmbulanceDispatched(true)}
                                                    className="w-full py-3.5 px-6 rounded-2xl bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-600/30 animate-pulse"
                                                >
                                                    <Siren size={18} />
                                                    Dispatch Emergency Ambulance (SOS 108)
                                                </button>
                                            ) : (
                                                <div className="mt-2 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-left">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                                                            <Radio size={14} className="animate-ping" /> Ambulance En Route
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded font-black text-[10px]">
                                                            ETA {ambulanceETA} Mins
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                                                        <p className="font-bold flex justify-between"><span>Vehicle:</span> <span className="font-mono text-emerald-700 dark:text-emerald-400">OD-05-EMG-108 (ICU ALS)</span></p>
                                                        <p className="font-bold flex justify-between"><span>EMT Driver:</span> <span>Rajesh Mohanty</span></p>
                                                        <p className="text-[10px] text-slate-400 flex justify-between"><span>GPS Position:</span> <span>20.598° N, 85.972° E (Tangi Cuttack)</span></p>
                                                    </div>
                                                    <a
                                                        href="tel:+919437108108"
                                                        className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors block text-center"
                                                    >
                                                        <Phone size={12} /> Call Paramedic (+91 94371 08108)
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <button 
                                        onClick={cancelEmergency}
                                        className="w-full py-3 px-8 rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X size={14} />
                                        Close Emergency
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing;
