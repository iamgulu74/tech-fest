import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowLeft, Loader2, Building, Server } from 'lucide-react';
import PixelButton from '../components/PixelButton';
import { adminAuth, adminDb } from '../lib/adminFirebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthAdmin = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hospitals, setHospitals] = useState<{ id: string, name: string }[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        hospitalId: '',
        adminCode: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/hospitals`);
                if (response.ok) {
                    const data = await response.json();
                    setHospitals(data.map((h: any) => ({ id: h.id, name: h.name })));
                } else {
                    // Fallback for demo
                    setHospitals([
                        { id: 'hosp1', name: 'Apollo Hospitals Central' },
                        { id: 'hosp2', name: 'City Care General' },
                        { id: 'hosp3', name: 'Max Super Speciality' }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch hospitals");
                setHospitals([
                    { id: 'hosp1', name: 'Apollo Hospitals Central' },
                    { id: 'hosp2', name: 'City Care General' }
                ]);
            }
        };
        fetchHospitals();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (isSignUp && !formData.hospitalId) {
            setError('Please select your hospital institution');
            setLoading(false);
            return;
        }

        try {
            let userCredential;
            if (isSignUp) {
                // Register
                userCredential = await createUserWithEmailAndPassword(adminAuth, formData.email, formData.password);
                
                // Update profile
                await updateProfile(userCredential.user, {
                    displayName: formData.name
                });

                // Store additional admin data in Firestore
                await setDoc(doc(adminDb, 'admins', userCredential.user.uid), {
                    name: formData.name,
                    email: formData.email,
                    hospitalId: formData.hospitalId,
                    role: 'admin',
                    createdAt: new Date().toISOString()
                });
            } else {
                // Login
                userCredential = await signInWithEmailAndPassword(adminAuth, formData.email, formData.password);
            }

            const user = userCredential.user;
            
            // Fetch hospital info if logging in
            let hospitalId = formData.hospitalId;
            let hospitalName = 'Admin Institution';

            if (!isSignUp) {
                const adminDoc = await getDoc(doc(adminDb, 'admins', user.uid));
                if (adminDoc.exists()) {
                    const data = adminDoc.data();
                    hospitalId = data.hospitalId;
                    hospitalName = hospitals.find(h => h.id === hospitalId)?.name || 'Admin Institution';
                }
            } else {
                hospitalName = hospitals.find(h => h.id === formData.hospitalId)?.name || 'Admin Institution';
            }

            const authState = {
                isLoggedIn: true,
                role: 'admin',
                uid: user.uid,
                email: user.email,
                name: user.displayName || formData.name || user.email?.split('@')[0],
                hospitalId: hospitalId || 'hosp1',
                hospitalName: hospitalName
            };

            localStorage.setItem('authState', JSON.stringify(authState));
            navigate('/medqueue');
        } catch (err: any) {
            console.error("Auth error:", err);
            let friendlyError = err.message || 'Authentication failed';
            
            if (err.code === 'auth/invalid-credential') {
                friendlyError = "Invalid email or password. If you haven't requested admin access yet, please click 'Request Access' below.";
            } else if (err.code === 'auth/user-not-found') {
                friendlyError = "Admin account not found. Please register first.";
            } else if (err.code === 'auth/wrong-password') {
                friendlyError = "Incorrect password. Please try again.";
            } else if (err.code === 'auth/email-already-in-use') {
                friendlyError = "This admin email is already registered. Please sign in instead.";
            } else if (err.code === 'auth/network-request-failed') {
                friendlyError = "Network error. Please check your internet connection.";
            }
            
            setError(friendlyError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden selection:bg-orange-500/20">
            {/* Bold Admin Theme Background (Orange/Amber) */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-200 rounded-full blur-[120px]" />
            </div>

            <button
                onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
                className="absolute top-10 left-10 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-widest z-50 py-2 px-4 border border-slate-200 rounded-full bg-white/50 backdrop-blur-md shadow-sm"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-[3.5rem] p-12 max-w-md w-full relative z-10 border-slate-200 bg-white shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-orange-500/20 shadow-inner">
                        <Shield className="text-orange-600" size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">
                        Admin <span className="text-orange-600 italic underline underline-offset-4 decoration-orange-500/30">Command</span>
                    </h1>
                    <p className="text-slate-400 font-black font-mono text-[9px] uppercase tracking-[0.3em]">
                        {isSignUp ? 'System Registration' : 'Operational Access'}
                    </p>
                </div>

                {error && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-600 p-5 rounded-2xl text-[10px] mb-8 font-black font-mono uppercase tracking-widest animate-pulse">
                        [ERROR]: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Admin Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                                        placeholder="Administrator Name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Hospital Institution</label>
                                <div className="relative group">
                                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <select
                                        required
                                        value={formData.hospitalId}
                                        onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-900 appearance-none cursor-pointer font-bold"
                                    >
                                        <option value="" disabled className="bg-white">Select Your Institution</option>
                                        {hospitals.map(h => (
                                            <option key={h.id} value={h.id} className="bg-white">{h.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                                placeholder="name@hospital.org"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Secure Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <PixelButton
                        type="submit"
                        className="w-full mt-6 py-4"
                        color="secondary"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Initiate Admin Account' : 'Authenticate Access')}
                    </PixelButton>
                </form>

                <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-sm font-bold">
                        {isSignUp ? 'Already have credentials?' : "Need an admin account?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-orange-600 font-black hover:underline underline-offset-8 transition-all"
                        >
                            {isSignUp ? 'Login Here' : 'Request Access'}
                        </button>
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                    <Server size={14} className="text-slate-400" />
                    Secure Enterprise Infrastructure
                </div>
            </motion.div>
        </div>
    );
};

export default AuthAdmin;
