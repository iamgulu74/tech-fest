import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    Activity, 
    Globe, 
    Heart, 
    Zap,
    Scale
} from 'lucide-react';
const DiseasesModule = () => {
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
                        <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <h1 className="text-xl font-black tracking-tight uppercase italic">Disease <span className="text-red-500">Directory</span></h1>
                    </div>
                    <div className="hidden md:block">
                        <span className="px-4 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Verified Intelligence
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
                            Comprehensive <span className="text-red-500">Disease</span> Analysis
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Deep-dive into clinical information, risk factors, and diagnostic criteria for the most prevalent medical conditions worldwide.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-24 scroll-mt-32">
                    {/* Cardiovascular Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-red-100 text-red-500 rounded-2xl">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Cardiovascular</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hearts & Vascular Systems</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { label: 'Heart', emoji: '❤️', title: 'Coronary Artery Disease', desc: 'Plaque buildup in arteries reduces blood flow to the heart. Leads to chest pain (angina) or heart attack. Risk factors include high cholesterol, hypertension, smoking, and obesity.' },
                                { label: 'Heart', emoji: '💔', title: 'Heart Failure', desc: 'The heart muscle cannot pump blood efficiently. Classified as HFrEF (reduced ejection fraction) or HFpEF. Symptoms: breathlessness, leg swelling, fatigue.' },
                                { label: 'Vascular', emoji: '🩸', title: 'Hypertension', desc: 'Blood pressure ≥130/80 mmHg consistently. Often asymptomatic — known as the "silent killer." Increases risk of stroke, kidney failure, and vision loss.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-red-200 transition-all group"
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

                    {/* Metabolic Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-blue-100 text-blue-500 rounded-2xl">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Metabolic</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Endocrine & Systems</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { label: 'Metabolic', emoji: '🍬', title: 'Diabetes Type 1', desc: 'Autoimmune destruction of insulin-producing beta cells. Requires daily insulin therapy. Onset typically in childhood or adolescence.' },
                                { label: 'Metabolic', emoji: '📊', title: 'Diabetes Type 2', desc: 'Insulin resistance and progressive beta-cell dysfunction. Most common type — strongly linked to lifestyle. Managed with diet, exercise, oral medications, and/or insulin.' },
                                { label: 'Thyroid', emoji: '🦋', title: 'Hypothyroidism', desc: 'Underactive thyroid causes fatigue, weight gain, cold intolerance, and depression. Treated with daily levothyroxine. Very common in women over 40.' }
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

                    {/* Oncology Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-purple-100 text-purple-500 rounded-2xl">
                                <Scale size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Oncology</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clinical Cancer Care</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { label: 'Cancer', emoji: '🫁', title: 'Lung Cancer', desc: 'Leading cause of cancer death worldwide. Two types: NSCLC (80%) and SCLC (20%). Early screening via low-dose CT for high-risk individuals.' },
                                { label: 'Cancer', emoji: '🎀', title: 'Breast Cancer', desc: 'Most common cancer in women. Hormone receptor status (ER/PR/HER2) guides treatment. Mammography screening from age 40 is widely recommended.' },
                                { label: 'Cancer', emoji: '🫀', title: 'Colorectal Cancer', desc: 'Third most common cancer. Often begins as polyps. Colonoscopy screening from age 45 can detect and remove pre-cancerous lesions early.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-purple-200 transition-all group"
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

                    {/* Symptom Lookup Table */}
                    <section className="pb-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-slate-900 text-white rounded-2xl">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Triage Table</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Rapid Diagnostic Reference</p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Symptom Profile</th>
                                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Probable Diagnostics</th>
                                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Urgency</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { symptom: 'Chest pain + shortness of breath', condition: 'Heart attack, Pulmonary embolism', urgency: 'Emergency', color: 'text-red-500 bg-red-50' },
                                            { symptom: 'Excessive thirst + frequent urination', condition: 'Diabetes Type 1 or 2', urgency: 'See doctor soon', color: 'text-orange-500 bg-orange-50' },
                                            { symptom: 'Sudden severe headache', condition: 'Subarachnoid hemorrhage, Hypertension', urgency: 'Emergency', color: 'text-red-500 bg-red-50' },
                                            { symptom: 'Persistent fatigue + weight gain', condition: 'Hypothyroidism, Anemia', urgency: 'Routine check', color: 'text-green-500 bg-green-50' },
                                            { symptom: 'Unexplained weight loss', condition: 'Cancer, Diabetes, Hyperthyroidism', urgency: 'See doctor soon', color: 'text-orange-500 bg-orange-50' }
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-10 py-8 font-black text-slate-900 text-lg tracking-tight">{row.symptom}</td>
                                                <td className="px-10 py-8 text-sm text-slate-500 font-bold leading-relaxed">{row.condition}</td>
                                                <td className="px-10 py-8">
                                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${row.color}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${row.urgency === 'Emergency' ? 'bg-red-500 animate-pulse' : row.urgency === 'See doctor soon' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                                        {row.urgency}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DiseasesModule;
