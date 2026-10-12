import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    ShieldAlert, 
    Phone, 
    Heart, 
    Droplets, 
    Wind, 
    Flame, 
    Brain, 
    Zap, 
    Skull, 
    Stethoscope, 
    AlertCircle
} from 'lucide-react';

const FirstAidModule = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-red/30 uppercase">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/learn')}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                            <ShieldAlert size={20} />
                        </div>
                        <h1 className="text-xl font-black tracking-tight uppercase italic">First Aid <span className="text-red-500">Module</span></h1>
                    </div>
                    <div className="hidden md:block">
                        <span className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Emergency Protocols
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                {/* Emergency Alert Banner */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-16 p-8 rounded-[3rem] bg-gradient-to-r from-red-600 to-red-800 text-white shadow-2xl shadow-red-500/30 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Phone size={120} />
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-xl">
                        <Phone className="w-10 h-10 animate-pulse" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-black mb-2 tracking-tighter italic uppercase">Immediate Action Required</h2>
                        <p className="font-bold opacity-90 leading-relaxed text-sm">
                            Always call emergency services first <span className="underline decoration-2 underline-offset-4 decoration-white/50 cursor-pointer hover:text-white transition-all">112</span> before or while providing first aid. These steps are for immediate response only.
                        </p>
                    </div>
                    <a href="tel:112" className="px-10 py-5 bg-white text-red-600 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-black/20 shrink-0">
                        Call Emergency: 112
                    </a>
                </motion.div>

                <div className="space-y-24">
                    {/* CPR Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">❤️ CPR Protocols</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cardiopulmonary Resuscitation</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {[
                                { step: '1', title: 'Check Safety', desc: 'Ensure the area is safe. Tap shoulders and shout "Are you okay?". Call 112 if no response.' },
                                { step: '2', title: 'Check Breath', desc: 'Look for chest rise, listen/feel for breath (max 10s). If absent, begin CPR.' },
                                { step: '3', title: 'Compressions', desc: 'Center of chest. Push hard (5cm) and fast (100-120bpm). Allow full recoil.' },
                                { step: '4', title: 'Rescue Breaths', desc: 'Tilt head, lift chin, pinch nose. Give 2 breaths (1s each). Watch for chest rise.' },
                                { step: '5', title: 'Use AED', desc: 'Turn on AED, follow prompts. Attach pads. Clear before shock. Resume CPR.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-red-200 transition-all"
                                >
                                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-xs mb-6 border border-red-100">{item.step}</div>
                                    <h4 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Bleeding Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <Droplets size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">🩸 Bleeding Control</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hemorrhage Management</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { step: '1', title: 'Protect Yourself', desc: 'Wear gloves if available. Avoid direct contact with bloodborne pathogens.' },
                                { step: '2', title: 'Direct Pressure', desc: 'Press clean cloth firmly on wound. Maintain pressure for at least 10 minutes.' },
                                { step: '3', title: 'Elevate Area', desc: 'Raise the injured body part above the heart to reduce blood flow.' },
                                { step: '4', title: 'Tourniquet', desc: 'Apply 5-7cm above wound. Tighten until bleeding stops. Note application time.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Droplets size={120} />
                                    </div>
                                    <div className="text-3xl font-black mb-6 italic opacity-50">0{item.step}</div>
                                    <h4 className="text-xl font-black mb-4 tracking-tighter uppercase">{item.title}</h4>
                                    <p className="text-sm font-medium leading-relaxed opacity-70">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Choking Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                                <Wind size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">🫁 Choking/Heimlich</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Airway Obstruction</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { step: '1', label: 'Confirm Choking', desc: 'If unable to speak/cough/breathe, act. A silent cough means severe blockage.' },
                                { step: '2', label: '5 Back Blows', desc: 'Lean person forward. Give 5 firm blows between blades using heel of hand.' },
                                { step: '3', label: 'Abdominal Thrusts', desc: 'Fist above navel. Pull sharply inward/upward. Repeat 5 times. Alternate.' },
                                { step: '4', label: 'If Unconscious', desc: 'Lower to floor. Call 112. Begin CPR. Look for/remove visible object.' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-8 rounded-[2.5rem] bg-orange-50 border border-orange-100">
                                    <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Phase 0{item.step}</h4>
                                    <h5 className="text-lg font-black text-slate-900 mb-2 leading-none">{item.label}</h5>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Other Scenarios */}
                    <section className="pb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">⚡ Emergency Matrix</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Rapid Intervention Scenarios</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { icon: Flame, emoji: '🔥', title: 'Burns', label: 'Burn First Aid', desc: 'Cool with running water for 20 mins. No ice/butter/toothpaste. Cover loosely with cling wrap.' },
                                { icon: Stethoscope, emoji: '🦴', title: 'Fracture', label: 'Suspected Fracture', desc: 'Immobilize injured area. Do not realign. Apply ice pack. Keep person still and calm.' },
                                { icon: Brain, emoji: '🧠', title: 'Stroke', label: 'FAST Test', desc: 'Face drooping · Arm weakness · Speech difficulty · Time to call 112. Every minute matters.' },
                                { icon: Zap, emoji: '⚡', title: 'Seizure', label: 'Response Unit', desc: 'Clear area of objects. Do NOT restrain. recovery position after. Call 112 if >5 mins.' },
                                { icon: Skull, emoji: '☠️', title: 'Poisoning', label: 'Toxicology', desc: 'Call Poison Control (1800-116-117). Note substance/amount. Do NOT induce vomiting.' },
                                { icon: Zap, emoji: '🐝', title: 'Anaphylaxis', label: 'Allergic Reaction', desc: 'Use EpiPen if available in outer thigh. Call 112. Lay flat, raise legs. Re-dose after 5-15m.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                                            <item.icon size={24} />
                                        </div>
                                        <span className="text-3xl">{item.emoji}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-2">{item.title}</h4>
                                        <h5 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic leading-none">{item.label}</h5>
                                        <p className="text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default FirstAidModule;
