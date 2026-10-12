import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, ArrowLeft, Loader2, Heart } from 'lucide-react';
import PixelButton from '../components/PixelButton';

const AuthPatient = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // In a real app, you'd use Firebase Auth client SDK here
            const authState = {
                isLoggedIn: true,
                role: 'patient',
                email: formData.email,
                name: isSignUp ? formData.name : formData.email.split('@')[0],
            };

            localStorage.setItem('authState', JSON.stringify(authState));
            navigate('/patient');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/20">
            {/* Soft Healthcare Theme Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]" />
            </div>

            <button
                onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
                className="absolute top-10 left-10 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-widest z-50 py-2 px-4 border border-slate-200 rounded-full bg-white/50 backdrop-blur-md shadow-sm"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[3.5rem] p-12 max-w-md w-full relative z-10 border-slate-200 bg-white shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-primary/20 shadow-inner">
                        <Activity className="text-primary" size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">
                        Patient <span className="text-primary italic underline underline-offset-4 decoration-primary/30">Portal</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">
                        {isSignUp ? 'Join MedQueue AI today' : 'Welcome back to your health hub'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50/50 border border-red-200 text-red-600 p-5 rounded-2xl text-sm mb-8 font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                                placeholder="name@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <PixelButton
                        type="submit"
                        className="w-full mt-6 py-4"
                        color="primary"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Create Patient Account' : 'Sign In')}
                    </PixelButton>
                </form>

                <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-sm font-bold">
                        {isSignUp ? 'Already matching with doctors?' : "New to MedQueue AI?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-primary font-black hover:underline underline-offset-8 transition-all"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                    <Heart size={14} className="text-red-400 fill-red-400" />
                    Trusted by 2.5m+ patients
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPatient;
