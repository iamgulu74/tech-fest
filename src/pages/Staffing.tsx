import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Calendar, ArrowLeft, UserCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchStaffing } from '../lib/api';

const Staffing = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchStaffing();

                // Transform API object to UI array format
                const transformedData = {
                    shiftChange: result.currentShift === 'Morning' ? '16:00' : result.currentShift === 'Evening' ? '00:00' : '08:00',
                    staff: [
                        { role: 'Doctors', total: Math.round(result.doctors * 2.5), onDuty: result.doctors, shift: result.currentShift },
                        { role: 'Nurses', total: Math.round(result.nurses * 2.5), onDuty: result.nurses, shift: result.currentShift },
                        { role: 'Support Staff', total: Math.round(result.support * 2.5), onDuty: result.support, shift: result.currentShift },
                    ]
                };

                setData(transformedData);
            } catch (error) {
                console.error('Failed to load staffing data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getTotalOnDuty = () => {
        return data?.staff?.reduce((sum: number, s: any) => sum + s.onDuty, 0) || 0;
    };

    const getTotalStaff = () => {
        return data?.staff?.reduce((sum: number, s: any) => sum + s.total, 0) || 0;
    };

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
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Staff Management</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-tight italic">Shift monitoring and active personnel status</p>
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
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Querying Active Staff...</p>
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
                                <Users className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">{getTotalStaff()}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Staff</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-green-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-green-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                                <UserCheck className="text-green-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-green-600 tracking-tighter italic mb-1">{getTotalOnDuty()}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">On Duty</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-purple-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-purple-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
                                <Calendar className="text-purple-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">Day</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Current Shift</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-orange-500/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-orange-500/5 transition-colors" />
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100">
                                <Clock className="text-orange-600" size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">{data?.shiftChange || '18:00'}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Shift Change</p>
                        </motion.div>
                    </div>

                    {/* Staff Distribution */}
                    <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Staff Distribution</h2>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <div className="grid lg:grid-cols-2 gap-10">
                            {data?.staff.map((member: any, i: number) => {
                                const percentage = Math.round((member.onDuty / member.total) * 100);
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Users size={28} className="group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-1">{member.role}</h3>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Shift: {member.shift}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-black text-primary italic">{member.onDuty}</span>
                                                    <span className="text-slate-300 font-black text-xl italic">/ {member.total}</span>
                                                </div>
                                                <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">
                                                    {percentage}% Active
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full h-4 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1.5, type: 'spring' }}
                                                className="h-full rounded-full bg-primary shadow-lg shadow-primary/20"
                                            />
                                        </div>

                                        <div className="mt-8 grid grid-cols-3 gap-6">
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                                <div className="text-xl font-black text-slate-900 italic">{member.total}</div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase">Total</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                                <div className="text-xl font-black text-green-500 italic">{member.onDuty}</div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase">On Duty</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                                <div className="text-xl font-black text-slate-300 italic">{member.total - member.onDuty}</div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase">Off Duty</div>
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

export default Staffing;
