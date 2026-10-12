import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    Leaf, 
    Zap, 
    Apple, 
    Droplet, 
    Wind,
    CheckCircle2,
    XCircle,
    Activity,
    Dumbbell,
    Brain,
    Moon,
    Users as SocialIcon
} from 'lucide-react';

const WellnessModule = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald/30">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/learn')}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-colors group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Leaf size={20} />
                        </div>
                        <h1 className="text-xl font-black tracking-tight uppercase italic">Wellness <span className="text-emerald-500">Module</span></h1>
                    </div>
                    <div className="hidden md:block">
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Personalized Protocols
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
                            Holistic <span className="text-emerald-500">Wellness</span> & Vitality
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Nutrition, physical exercise, mental health protocols, and personalized diet plans for a balanced lifestyle.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-24 scroll-mt-32">
                    {/* Nutrition Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                <Apple size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Nutrition & Diet</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Fueling Your Biology</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Zap, label: 'Macros', emoji: '⚖️', title: 'Balanced Macronutrients', desc: 'General guideline: 45–65% carbs, 20–35% fats, 10–35% protein. Adjust based on age, activity level, and health goals. Track with a nutrition app for 2 weeks to find your baseline.' },
                                { icon: Droplet, label: 'Hydration', emoji: '💧', title: 'Daily Water Intake', desc: 'Recommended: 2.7 L/day (women), 3.7 L/day (men) total fluids. Increase with exercise or heat. Signs of dehydration: dark urine, headache, fatigue.' },
                                { icon: Wind, label: 'Gut Health', emoji: '🦠', title: 'Probiotics & Fiber', desc: 'Eat 25–38 g fiber daily. Include probiotic foods (yogurt, kefir, kimchi). A healthy gut microbiome reduces inflammation and supports immunity.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 hover:border-emerald-200 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100 mb-4 inline-block">{item.label}</span>
                                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Diet Plan Table */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">7-Day Diet Plan</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">2000 kcal / Day Baseline</p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Day</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Breakfast</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lunch</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dinner</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Snack</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium">
                                        {[
                                            { d: 'Mon', b: 'Oats + banana + almonds', l: 'Grilled chicken salad + whole-grain wrap', dn: 'Dal + brown rice + sabzi', s: 'Apple + peanut butter' },
                                            { d: 'Tue', b: 'Moong dal chilla + mint chutney', l: 'Rajma + roti + cucumber raita', dn: 'Baked fish + quinoa + broccoli', s: 'Handful of mixed nuts' },
                                            { d: 'Wed', b: 'Boiled eggs + whole wheat toast', l: 'Paneer stir-fry + chapati', dn: 'Vegetable soup + multigrain bread', s: 'Greek yogurt + berries' },
                                            { d: 'Thu', b: 'Smoothie (spinach, banana, flax)', l: 'Chickpea curry + jeera rice', dn: 'Grilled tofu + stir-fry + brown rice', s: 'Roasted makhana' },
                                            { d: 'Fri', b: 'Upma + coconut chutney', l: 'Mixed dal + bajra roti + salad', dn: 'Chicken curry + roti + dal soup', s: 'Fruit salad' },
                                            { d: 'Sat', b: 'Idli + sambar', l: 'Palak paneer + paratha', dn: 'Baked salmon + sweet potato', s: 'Pumpkin seeds + dates' },
                                            { d: 'Sun', b: 'Poha + herbal tea', l: 'Chole + puri (1–2) + raita', dn: 'Khichdi + curd + papad', s: 'Coconut water + 1 banana' }
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
                                                <td className="px-8 py-6 font-black text-slate-900 border-r border-slate-50 uppercase tracking-tighter italic">{row.d}</td>
                                                <td className="px-8 py-6 text-sm text-slate-600">{row.b}</td>
                                                <td className="px-8 py-6 text-sm text-slate-600">{row.l}</td>
                                                <td className="px-8 py-6 text-sm text-slate-600">{row.dn}</td>
                                                <td className="px-8 py-6 text-sm text-slate-600">{row.s}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Foods to Eat/Avoid Section */}
                    <section>
                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Pro-Metabolic */}
                            <div className="bg-emerald-50/50 p-10 rounded-[3rem] border border-emerald-100">
                                <div className="flex items-center gap-4 mb-8 text-emerald-600">
                                    <CheckCircle2 size={32} />
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic">Foods to Prioritize</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { cat: 'Whole Grains', items: ['Brown rice', 'Oats', 'Quinoa', 'Bajra/Jowar'] },
                                        { cat: 'Proteins', items: ['Lentils', 'Eggs', 'Grilled Chicken', 'Paneer/Tofu'] },
                                        { cat: 'Vegetables', items: ['Spinach/Kale', 'Broccoli', 'Carrots', 'Drumstick'] },
                                        { cat: 'Healthy Fats', items: ['Almonds/Walnuts', 'Flaxseeds', 'Avocado', 'Olive Oil'] }
                                    ].map((c, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{c.cat}</h5>
                                            <ul className="text-sm text-slate-600 font-bold space-y-1">
                                                {c.items.map((it, i) => <li key={i} className="flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-emerald-400 rounded-full" /> {it}
                                                </li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Avoid */}
                            <div className="bg-rose-50/50 p-10 rounded-[3rem] border border-rose-100">
                                <div className="flex items-center gap-4 mb-8 text-rose-600">
                                    <XCircle size={32} />
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic">Foods to Avoid</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Processed Foods</h5>
                                        <ul className="text-sm text-slate-600 font-bold space-y-2">
                                            <li className="flex items-center gap-2">🚫 Chips & Biscuits</li>
                                            <li className="flex items-center gap-2">🚫 Instant Noodles</li>
                                            <li className="flex items-center gap-2">🚫 White Bread</li>
                                            <li className="flex items-center gap-2">🚫 Frozen Meals</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Excess Sugars</h5>
                                        <ul className="text-sm text-slate-600 font-bold space-y-2">
                                            <li className="flex items-center gap-2">🚫 Soft Drinks / Cola</li>
                                            <li className="flex items-center gap-2">🚫 Sweets & Mithai</li>
                                            <li className="flex items-center gap-2">🚫 Energy Drinks</li>
                                            <li className="flex items-center gap-2">🚫 Sugary Cereals</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Physical Exercise Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                <Dumbbell size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Physical Protocols</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Structural Strength</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { emoji: '🏃', title: 'Cardio', category: 'Aerobic Exercise', desc: '150 min moderate (brisk walk) or 75 min vigorous (jogging) per week. Lowers blood pressure, improves heart health, burns fat.' },
                                { emoji: '🏋️', title: 'Strength', category: 'Resistance Training', desc: '2–3 sessions/week targeting major muscle groups. Increases lean muscle mass, improves insulin sensitivity, strengthens bones.' },
                                { emoji: '🧘', title: 'Flexibility', category: 'Yoga & Stretching', desc: 'Daily 15–20 min stretching or yoga reduces cortisol, improves posture, prevents injury, and enhances sleep quality.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-8 rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-500/20 flex flex-col items-center text-center"
                                >
                                    <div className="text-5xl mb-6">{item.emoji}</div>
                                    <h4 className="text-2xl font-black uppercase italic mb-1 tracking-tighter">{item.title}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">{item.category}</p>
                                    <p className="font-bold leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Mental Health Section */}
                    <section className="pb-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Mental Health Protocols</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Neurological Restoration</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Moon, emoji: '😴', title: 'Sleep Hygiene', desc: '7–9 hours/night. Consistent schedule, dark room, no screens 1 hour before bed. Poor sleep raises cortisol and inflammation.' },
                                { icon: Activity, emoji: '🧘‍♀️', title: 'Meditation', desc: '10 minutes daily of mindfulness or breath-focused meditation reduces anxiety, lowers blood pressure, and improves emotional regulation.' },
                                { icon: SocialIcon, emoji: '🤝', title: 'Social Wellness', desc: 'Strong social ties are linked to 50% higher survival rates. Connection reduces risk of depression and cognitive decline.' }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] bg-white border border-indigo-100 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                                            <item.icon size={24} />
                                        </div>
                                        <span className="text-3xl">{item.emoji}</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">{item.title}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default WellnessModule;
