import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft,
    Heart, 
    Activity, 
    Stethoscope,
    Microscope
} from 'lucide-react';

const TreatmentsModule = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-primary/30">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/learn')}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center">
                            <Heart size={20} />
                        </div>
                        <h1 className="text-xl font-black tracking-tight uppercase italic">Treatment <span className="text-blue-500">Guide</span></h1>
                    </div>
                    <div className="hidden md:block">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-500 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Verified Procedures
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                {/* Hero section */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-none">
                            Advanced <span className="text-blue-500">Therapeutic</span> Protocols
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Explore evidence-based medications, sophisticated diagnostic techniques, and life-shaping surgical interventions.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-24 scroll-mt-32">
                    {/* Medications Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-blue-100 text-blue-500 rounded-2xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Pharmacology</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Medications</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { label: 'Cardiology', emoji: '❤️‍🩹', title: 'Beta-Blockers', desc: 'Used for hypertension, heart failure, and arrhythmias. Block adrenaline effects, reducing heart rate and blood pressure. Examples: metoprolol, atenolol, carvedilol.' },
                                { label: 'Diabetes', emoji: '💉', title: 'Insulin Therapy', desc: 'Types include rapid-acting (lispro), long-acting (glargine), and premixed. Administered via injection or insulin pump. Dosing adjusted based on blood glucose readings.' },
                                { label: 'Antibiotics', emoji: '🧫', title: 'Amoxicillin', desc: 'Broad-spectrum penicillin antibiotic. Used for respiratory, ear, and urinary infections. Take the full course to prevent antibiotic resistance.' },
                                { label: 'Pain', emoji: '💊', title: 'NSAIDs', desc: 'Non-steroidal anti-inflammatory drugs (ibuprofen, naproxen). Relieve pain, fever, and inflammation. Avoid on empty stomach; use cautiously with kidney disease.' },
                                { label: 'Mental Health', emoji: '🧠', title: 'SSRIs', desc: 'Selective serotonin reuptake inhibitors for depression and anxiety. Examples: fluoxetine, sertraline. May take 4–6 weeks to show full effect.' },
                                { label: 'Cholesterol', emoji: '📉', title: 'Statins', desc: 'Lower LDL cholesterol and cardiovascular risk. Examples: atorvastatin, rosuvastatin. Monitor liver function and report muscle pain to your doctor.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-blue-200 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100">{item.label}</span>
                                        <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Diagnostic Procedures Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-emerald-100 text-emerald-500 rounded-2xl">
                                <Microscope size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Diagnostics</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clinical Assessments</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: 'Imaging', emoji: '🩻', title: 'MRI Scan', desc: 'Uses magnetic fields and radio waves. No radiation. Excellent for soft tissue, brain, spinal cord, and joint imaging. Takes 30–60 minutes. Remove all metal objects.' },
                                { label: 'Imaging', emoji: '📡', title: 'CT Scan', desc: 'X-ray based cross-sectional imaging. Fast (seconds to minutes). Used for trauma, chest, abdomen, and cancer staging. Involves low radiation dose.' },
                                { label: 'Lab', emoji: '🧪', title: 'Complete Blood Count (CBC)', desc: 'Measures RBCs, WBCs, platelets, hemoglobin, and hematocrit. Helps diagnose anemia, infections, blood disorders, and immune system issues.' },
                                { label: 'Cardiology', emoji: '📈', title: 'Electrocardiogram (ECG)', desc: 'Records electrical activity of the heart. Non-invasive, takes ~10 minutes. Detects arrhythmias, heart attacks, and conduction abnormalities.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-emerald-200 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100">{item.label}</span>
                                        <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Surgical Procedures Section */}
                    <section className="pb-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-orange-100 text-orange-500 rounded-2xl">
                                <Stethoscope size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Surgery</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Invasive Interventions</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { label: 'Cardiac', emoji: '🫀', title: 'Coronary Bypass (CABG)', desc: 'Grafts a healthy blood vessel to bypass a blocked coronary artery. Improves blood flow to the heart muscle. Recovery takes 6–12 weeks.' },
                                { label: 'Orthopedic', emoji: '🦴', title: 'Knee Replacement (TKR)', desc: 'Removes damaged knee joint and replaces with metal/plastic implant. Highly effective for severe arthritis. Physical therapy begins 24 hours post-surgery.' },
                                { label: 'General', emoji: '🫁', title: 'Laparoscopic Surgery', desc: 'Minimally invasive surgery using small incisions and a camera. Used for appendectomy, gallbladder removal, hernia repair. Faster recovery than open surgery.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-orange-200 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100">{item.label}</span>
                                        <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TreatmentsModule;
