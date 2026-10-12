import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, ArrowLeft, ChevronRight, UserCircle, Building } from 'lucide-react';
import PixelButton from '../components/PixelButton';

const Auth = () => {
    const navigate = useNavigate();

    const portals = [
        {
            id: 'patient',
            title: 'Patient Portal',
            subtitle: 'Healthcare Access',
            description: 'Book beds, check symptoms, and view real-time hospital wait times with AI.',
            icon: Activity,
            color: 'primary',
            path: '/auth/patient',
            features: ['AI Assistant', 'Bed Reservations', 'Wait Time Tracking']
        },
        {
            id: 'admin',
            title: 'Hospital Admin',
            subtitle: 'Critical Operations',
            description: 'Manage institutional queues, bed allocations, staffing, and predictive analytics.',
            icon: Shield,
            color: 'orange-500',
            path: '/auth/admin',
            features: ['Queue Analytics', 'Bed Management', 'Surge Predictions']
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 selection:bg-primary/20">
            {/* Split Background Glow */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/30 blur-[150px]" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/20 blur-[150px]" />
            </div>

            <button
                onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
                className="absolute top-10 left-10 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-widest z-50 py-2 px-4 border border-slate-200 rounded-full bg-white/50 backdrop-blur-md shadow-sm"
            >
                <ArrowLeft size={16} />
                Back to Home
            </button>

            <div className="max-w-5xl w-full relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic leading-tight">
                            Select Your <span className="text-primary italic">Gateway</span>
                        </h1>
                        <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg leading-relaxed">
                            Choose the specialized portal to continue. Each interface is optimized for your unique healthcare role and requirements.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {portals.map((portal, idx) => {
                        const Icon = portal.icon;
                        const isPrimary = portal.color === 'primary';
                        
                        return (
                            <motion.div
                                key={portal.id}
                                initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                onClick={() => navigate(portal.path)}
                                className={`glass group relative p-12 rounded-[3.5rem] border bg-white transition-all cursor-pointer hover:shadow-2xl hover:scale-[1.02] ${
                                    isPrimary 
                                    ? 'border-slate-200 hover:border-primary/50' 
                                    : 'border-slate-200 hover:border-orange-500/50'
                                }`}
                            >
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 border transition-all duration-500 ${
                                    isPrimary
                                    ? 'bg-primary/5 border-primary/10 group-hover:bg-primary/10'
                                    : 'bg-orange-500/5 border-orange-500/10 group-hover:bg-orange-500/10'
                                } shadow-inner shadow-white`}>
                                    <Icon className={isPrimary ? 'text-primary' : 'text-orange-500'} size={40} />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${
                                            isPrimary ? 'text-primary' : 'text-orange-500'
                                        }`}>
                                            {portal.subtitle}
                                        </p>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{portal.title}</h2>
                                    </div>
                                    
                                    <p className="text-slate-500 leading-relaxed font-bold text-sm">
                                        {portal.description}
                                    </p>

                                    <div className="flex flex-wrap gap-3 py-4">
                                        {portal.features.map(f => (
                                            <span key={f} className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-slate-400">
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-6">
                                        <PixelButton 
                                            onClick={() => navigate(portal.path)}
                                            color={isPrimary ? "primary" : "secondary"} 
                                            className="w-full"
                                        >
                                            Enter Portal <ChevronRight size={18} />
                                        </PixelButton>
                                    </div>
                                </div>

                                {/* Background Pattern Overlay */}
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    {isPrimary ? <UserCircle size={150} className="text-primary" /> : <Building size={150} className="text-orange-500" />}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        End-to-end encrypted infrastructure for healthcare entities
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
