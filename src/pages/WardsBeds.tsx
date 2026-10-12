import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bed, Activity, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWardsBeds } from '../lib/api';

const WardsBeds = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchWardsBeds();
                setData(result);
            } catch (error) {
                console.error('Failed to load wards data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

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
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Wards & Beds</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-tight italic">Real-time bed availability and ward occupancy</p>
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
                        <Activity className="animate-pulse text-primary" size={32} />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Syncing Ward Grid...</p>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-primary/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/5 transition-colors" />
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                                <Bed className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">{data?.summary?.total || 0}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Beds</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-red-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-red-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                                <Activity className="text-red-500" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-red-600 tracking-tighter italic mb-1">{data?.summary?.occupied || 0}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Occupied</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-green-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-green-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                                <TrendingUp className="text-green-500" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-green-600 tracking-tighter italic mb-1">{data?.summary?.available || 0}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Available</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-purple-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-purple-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
                                <Users className="text-purple-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">
                                {data?.summary?.total
                                    ? Math.round((data.summary.occupied / data.summary.total) * 100)
                                    : 0}%
                            </h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Occupancy Rate</p>
                        </motion.div>
                    </div>

                    {/* Ward Details */}
                    <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Ward Infrastructure</h2>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <div className="grid lg:grid-cols-2 gap-10">
                            {data?.wards.map((ward: any, i: number) => {
                                const available = ward.total - ward.occupied;
                                const occupancy = (ward.occupied / ward.total) * 100;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-1">{ward.name}</h3>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                    Ward ID: {ward.id || `W-${i+1}`}
                                                </p>
                                            </div>
                                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-colors ${available > 5 ? 'bg-green-50 border-green-100 text-green-600' :
                                                available > 0 ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                    'bg-red-50 border-red-100 text-red-600'
                                                }`}>
                                                {available} Free Beds
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                <span>Occupancy</span>
                                                <span>{Math.round(occupancy)}%</span>
                                            </div>
                                            <div className="w-full h-4 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${occupancy}%` }}
                                                    transition={{ duration: 1.5, type: 'spring' }}
                                                    className={`h-full rounded-full ${available > 5 ? 'bg-green-500' :
                                                        available > 0 ? 'bg-amber-500' :
                                                            'bg-red-500'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8 grid grid-cols-3 gap-6">
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                                <div className="text-xl font-black text-slate-900 italic">{ward.total}</div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase">Capacity</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                                <div className="text-xl font-black text-red-500 italic">{ward.occupied}</div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase">Taken</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                                <div className="text-xl font-black text-green-500 italic">{available}</div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase">Vacant</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardsBeds;
