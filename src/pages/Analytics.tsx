import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Clock, ArrowLeft, Star, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchHospitalDetails } from '../lib/api';

const Analytics = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fullHospital = await fetchHospitalDetails('apollo-delhi');

                // Transform API data to UI format
                const transformedData = {
                    metrics: {
                        avgWaitTime: fullHospital.analytics.avgWaitTime,
                        dailyPatients: fullHospital.analytics.dailyPatients,
                        // Bed Utilization based on Occupied / Total
                        bedUtilization: Math.round((fullHospital.beds.occupied / fullHospital.beds.total) * 100),
                        // Satisfaction Rate (0-100) to 5-star scale
                        patientSatisfaction: (fullHospital.analytics.satisfactionRate / 20).toFixed(1),
                        // Extract array of numbers/strings
                        weeklyTrend: fullHospital.analytics.weeklyTrend.map((d: any) => d.patients),
                        peakHours: fullHospital.analytics.peakHours.map((h: any) => h.hour)
                    },
                    currentQueue: fullHospital.queue.length
                };

                setData(transformedData);
            } catch (error) {
                console.error('Failed to load analytics data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-8 md:p-12 font-sans selection:bg-primary/20">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-14">
                <button
                    onClick={() => navigate('/medqueue')}
                    className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all mb-8 text-[10px] font-black uppercase tracking-widest py-2 px-4 border border-slate-200 rounded-full bg-white/50 backdrop-blur-md shadow-sm w-fit"
                >
                    <ArrowLeft size={16} />
                    Back to Queue
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Hospital Analytics</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-tight italic">Performance metrics and patient insights</p>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-primary/20">MQ</div>
                        <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900">MedQueue</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-96 gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-inner">
                        <Activity size={32} className="animate-pulse text-primary" />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Processing Metadata...</p>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-blue-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                                <Clock className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">{data?.metrics.avgWaitTime}m</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Avg Wait Time</p>
                            <div className="mt-4 flex items-center gap-1 text-[10px] text-green-600 font-black">
                                <TrendingUp size={12} />
                                <span className="uppercase tracking-widest">15% improvement</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-green-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-green-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                                <Users className="text-green-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">{data?.metrics.dailyPatients}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Daily Patients</p>
                            <div className="mt-4 flex items-center gap-1 text-[10px] text-green-600 font-black">
                                <TrendingUp size={12} />
                                <span className="uppercase tracking-widest">8% growth</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-purple-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-purple-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
                                <BarChart3 className="text-purple-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">{data?.metrics.bedUtilization}%</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Efficiency</p>
                            <div className="mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">Optimal range</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-yellow-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-yellow-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 border border-yellow-100">
                                <Star className="text-yellow-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">{data?.metrics.patientSatisfaction}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">CSAT Score</p>
                            <div className="mt-4 text-[10px] text-yellow-600 font-black uppercase tracking-widest">High Trust</div>
                        </motion.div>
                    </div>

                    {/* Weekly Trend Chart */}
                    <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
                        <div className="flex items-center gap-4 mb-14">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Weekly Patient Trend</h2>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <div className="flex items-end justify-between gap-4 h-72 pb-8">
                            {data?.metrics.weeklyTrend.map((count: number, i: number) => {
                                const maxCount = Math.max(...data.metrics.weeklyTrend);
                                const height = (count / maxCount) * 100;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{count}</div>
                                        <div className="flex-1 w-full flex items-end">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                                                className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-2xl shadow-lg shadow-primary/10 group-hover:from-primary group-hover:scale-105 transition-all"
                                            />
                                        </div>
                                        <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{days[i]}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Peak Hours & Status */}
                    <div className="grid lg:grid-cols-2 gap-10">
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic mb-10">Traffic Density</h2>
                            <div className="space-y-6">
                                {data?.metrics.peakHours.map((hour: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:border-primary/30 transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                <Clock size={20} />
                                            </div>
                                            <span className="text-xl font-black italic">{hour}</span>
                                        </div>
                                        <div className="px-5 py-2 rounded-2xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">Peak Period</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic mb-10">Live Load Balance</h2>
                            <div className="space-y-10 flex-1 flex flex-col justify-center">
                                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-all">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Live Queue Length</span>
                                        <span className="text-4xl font-black text-primary italic leading-none">{data?.currentQueue}</span>
                                    </div>
                                    <div className="w-full h-5 bg-slate-200/50 rounded-full overflow-hidden p-1 border border-slate-200">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(data?.currentQueue / 40) * 100}%` }}
                                            transition={{ duration: 1.5, type: 'spring' }}
                                            className="h-full bg-primary rounded-full shadow-lg shadow-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-all">
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic mb-6">System Snapshot</div>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div>
                                            <div className="text-2xl font-black text-slate-900 italic mb-2">{data?.metrics.dailyPatients}</div>
                                            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-tight">Total Daily<br />Patients</div>
                                        </div>
                                        <div className="border-l border-slate-200 pl-10">
                                            <div className="text-2xl font-black text-secondary italic mb-2">{data?.metrics.avgWaitTime}m</div>
                                            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-tight">Average Response<br />Latency</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
