import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Bed,
    TrendingUp,
    Plus,
    BarChart3,
    Activity,
    MoreVertical,
    LogOut,
    Bell,
    CheckCircle2,
    Loader2,
    X,
    Zap,
    MapPin,
    Phone,
    Stethoscope
} from 'lucide-react';
import BedAllocation from '../components/BedAllocation';
import { fetchHospitalDetails, predictWaitTime, sendBookingNotification, admitPatient, callInPatient } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/ProtectedRoute';
import PixelButton from '../components/PixelButton';

const MedQueueAdmin = () => {
    const navigate = useNavigate();
    const { signOut, user } = useAuth();
    const hospitalId = user?.hospitalId || 'apollo-delhi';
    const hospitalName = user?.hospitalName || 'Apollo Hospital';

    const [queue, setQueue] = useState<any[]>([]);
    const [hospitalData, setHospitalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notifyingId, setNotifyingId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([
        { id: 1, title: 'Network Pulse', message: 'System healthy. Syncing with 602 medical hubs.', time: '5m ago', read: false },
        { id: 2, title: 'Surge Warning', message: 'Nearby hospital surge detected. Preparing for overflow.', time: '1h ago', read: true }
    ]);

    // Modal State
    const [admitModalOpen, setAdmitModalOpen] = useState(false);
    const [admitForm, setAdmitForm] = useState({
        name: '',
        phone: '',
        address: '',
        doctorType: 'General Physician'
    });

    const autoFillForm = () => {
        const firstNames = ['Rohan', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anita', 'Raj', 'Meera', 'Suresh', 'Divya'];
        const lastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Reddy', 'Nair', 'Chopra', 'Desai'];
        const localities = ['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'MG Road', 'HSR Layout', 'BTM Layout'];
        const cities = ['Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Hyderabad'];
        const doctorTypes = ['General Physician', 'Cardiologist', 'Pediatrician', 'Orthopedic', 'Dermatologist', 'Neurologist'];

        setAdmitForm({
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            address: `${localities[Math.floor(Math.random() * localities.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`,
            doctorType: doctorTypes[Math.floor(Math.random() * doctorTypes.length)]
        });
    };

    const stats = [
        { label: 'Total OPD Today', value: hospitalData?.analytics?.dailyPatients || 'Data Unavailable', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Available Beds', value: hospitalData?.beds?.available != null ? hospitalData.beds.available : 'Data Unavailable', icon: Bed, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Surge Risk', value: hospitalData?.analytics ? (hospitalData.analytics.currentLoad > 80 ? 'Critical' : 'Normal') : 'Data Unavailable', icon: TrendingUp, color: hospitalData?.analytics?.currentLoad > 80 ? 'text-red-600' : 'text-amber-600', bg: hospitalData?.analytics?.currentLoad > 80 ? 'bg-red-50' : 'bg-amber-50' },
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchHospitalDetails(hospitalId);
                setHospitalData(data);

                // Get ML Prediction for the first person in queue
                const mlPrediction = await predictWaitTime({
                    current_length: data.queue.length,
                    avg_consult_time: 15.0,
                    doctors_available: 3,
                    hour_of_day: new Date().getHours()
                });

                const mapped = data.queue.map((q: any, index: number) => ({
                    name: q.name || 'Patient ' + q.token.split('-')[1],
                    id: '#' + q.token,
                    // Use ML prediction for the first patient, simulated decay for others
                    wait: index === 0 ? mlPrediction.estimated_wait_minutes + ' mins' : (q.wait || (index * 5)) + ' mins',
                    status: 'Waiting',
                    phone: q.phone || "+916371401928",
                    surge: mlPrediction.surge_detected
                }));
                setQueue(mapped);
            } catch (error) {
                console.error("Queue fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();

    }, [hospitalId]);

    const notifyPatient = async (patient: any) => {
        setNotifyingId(patient.id);
        try {
            await sendBookingNotification(patient.phone, hospitalName, "NEXT TURN");
            setSuccessMsg(`Notification sent to ${patient.name}`);
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error) {
            console.error("Notify error", error);
        } finally {
            setNotifyingId(null);
        }
    };

    const handleAdmitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await admitPatient(hospitalId, {
                name: admitForm.name,
                phone: admitForm.phone,
                address: admitForm.address,
                doctorType: admitForm.doctorType
            });
            setSuccessMsg(`New Patient Admitted: ${result.patient.token}`);

            // Add notification
            const newNotif = {
                id: Date.now(),
                title: 'New Admittance',
                message: `Patient ${result.patient.name} admitted with token ${result.patient.token}.`,
                time: 'Just now',
                read: false
            };
            setNotifications([newNotif, ...notifications]);

            setTimeout(() => setSuccessMsg(null), 3000);

            // Close modal and reset form
            setAdmitModalOpen(false);
            setAdmitForm({ name: '', phone: '', address: '', doctorType: 'General Physician' });

            // Refresh data
            const data = await fetchHospitalDetails(hospitalId);
            setHospitalData(data);
            setQueue(data.queue.map((q: any, index: number) => ({
                name: q.name || 'Patient ' + q.token.split('-')[1],
                id: '#' + q.token,
                wait: (q.wait || index * 5) + ' mins',
                status: 'Waiting',
                phone: q.phone || "+916371401928"
            })));
        } catch (error) {
            console.error("Admit error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCallIn = async (patient: any) => {
        setNotifyingId(patient.id);
        try {
            await callInPatient(hospitalId, patient.id);
            setSuccessMsg(`${patient.name} has been called in.`);
            setTimeout(() => setSuccessMsg(null), 3000);
            // Update local state by removing the patient
            setQueue(prev => prev.filter(p => p.id !== patient.id));
        } catch (error) {
            console.error("Call in error", error);
        } finally {
            setNotifyingId(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-primary/20 transition-colors duration-500">
            {/* Notification Toast */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-10 right-10 bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 z-[100] border border-white/10 backdrop-blur-xl"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                            <CheckCircle2 size={24} className="text-green-400" />
                        </div>
                        <span className="font-black uppercase tracking-tighter italic text-sm">{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admittance Modal */}
            <AnimatePresence>
                {admitModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
                        onClick={() => setAdmitModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white max-w-lg w-full p-10 rounded-[3.5rem] border border-slate-200 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setAdmitModalOpen(false)}
                                className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-inner">
                                    <Plus className="text-primary" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Admit Patient</h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Manual Institution Entry</p>
                                </div>
                            </div>

                            <form onSubmit={handleAdmitSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Patient Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={admitForm.name}
                                        onChange={(e) => setAdmitForm({ ...admitForm, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-primary focus:bg-white focus:outline-none transition-all font-bold placeholder:text-slate-300"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="tel"
                                                required
                                                value={admitForm.phone}
                                                onChange={(e) => setAdmitForm({ ...admitForm, phone: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-slate-900 focus:border-primary focus:bg-white focus:outline-none transition-all font-bold placeholder:text-slate-300"
                                                placeholder="+91..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Department</label>
                                        <div className="relative">
                                            <Stethoscope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <select
                                                value={admitForm.doctorType}
                                                onChange={(e) => setAdmitForm({ ...admitForm, doctorType: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-slate-900 focus:border-primary focus:bg-white focus:outline-none transition-all font-bold appearance-none"
                                            >
                                                <option className="bg-white">General Physician</option>
                                                <option className="bg-white">Cardiologist</option>
                                                <option className="bg-white">Pediatrician</option>
                                                <option className="bg-white">Orthopedic</option>
                                                <option className="bg-white">Neurologist</option>
                                                <option className="bg-white">Emergency</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-5 top-5 text-slate-400" size={16} />
                                        <textarea
                                            rows={2}
                                            value={admitForm.address}
                                            onChange={(e) => setAdmitForm({ ...admitForm, address: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-slate-900 focus:border-primary focus:bg-white focus:outline-none transition-all font-bold resize-none text-sm placeholder:text-slate-300"
                                            placeholder="Residential Address"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={autoFillForm}
                                        className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-black flex items-center gap-3 transition-all text-[10px] uppercase tracking-widest"
                                    >
                                        <Zap size={18} /> Auto-Fill
                                    </button>
                                    <PixelButton type="submit" color="primary" className="flex-1 py-4">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Admit Patient
                                    </PixelButton>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Header Toggle */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-primary/20">MQ</div>
                    <span className="font-black uppercase italic text-slate-900 tracking-tighter">MedQueue</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-3 text-slate-900 bg-slate-50 rounded-2xl border border-slate-100"
                >
                    <MoreVertical size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-100 bg-white transition-transform duration-500 lg:relative lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } flex flex-col p-8 shrink-0`}>
                <div className="flex items-center gap-4 mb-14 px-2 text-primary font-black cursor-pointer hidden lg:flex" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-primary/20">MQ</div>
                    <span className="font-black text-2xl tracking-tighter uppercase italic text-slate-900">MedQueue</span>
                </div>

                <nav className="flex-1 space-y-3">
                    <button
                        onClick={() => navigate('/medqueue')}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black transition-all bg-primary/10 text-primary border border-primary/10 shadow-lg shadow-primary/5"
                    >
                        <Activity size={20} />
                        Live Queue
                    </button>
                    <button
                        onClick={() => navigate('/wards-beds')}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black transition-all text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
                    >
                        <Bed size={20} />
                        Wards & Beds
                    </button>
                    <button
                        onClick={() => navigate('/staffing')}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black transition-all text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
                    >
                        <Users size={20} />
                        Staffing
                    </button>
                    <button
                        onClick={() => navigate('/analytics')}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black transition-all text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
                    >
                        <BarChart3 size={20} />
                        Analytics
                    </button>
                </nav>

                <div className="mt-auto border-t border-slate-100 pt-8">
                    <button
                        onClick={signOut}
                        className="flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-[0.2em] w-full"
                    >
                        <LogOut size={20} />
                        Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-14">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Command Center</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-tight">{hospitalName} • <span className="text-primary font-black uppercase tracking-widest text-[10px]">Active Infrastructure</span></p>
                    </motion.div>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-4 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:shadow-xl transition-all relative group ${showNotifications ? 'text-primary border-primary/30 ring-4 ring-primary/5' : ''}`}
                            >
                                <Bell size={24} />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-white" />
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            className="absolute right-0 mt-6 w-[360px] bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 italic">System Alerts</h3>
                                                <button
                                                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                                                    className="text-[9px] font-black text-primary hover:underline uppercase tracking-widest"
                                                >
                                                    Mark all read
                                                </button>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {notifications.length > 0 ? (
                                                    notifications.map((n) => (
                                                        <div
                                                            key={n.id}
                                                            className={`p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-primary/[0.03]' : ''}`}
                                                        >
                                                            {!n.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-r-full" />}
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className={`text-xs font-black uppercase tracking-tight ${!n.read ? 'text-slate-900' : 'text-slate-400'}`}>{n.title}</p>
                                                                <p className="text-[9px] text-slate-300 font-bold uppercase italic">{n.time}</p>
                                                            </div>
                                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-16 text-center">
                                                        <Activity size={32} className="mx-auto mb-4 opacity-10 text-slate-900" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">No Active Alerts</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 text-center bg-slate-50 border-t border-slate-100">
                                                <button className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors">
                                                    Full Infrastructure Audit Log
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => {
                                setAdmitModalOpen(true);
                                autoFillForm();
                            }}
                            disabled={loading}
                            className="bg-primary text-white flex items-center gap-3 font-black py-5 px-10 rounded-[1.5rem] shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all border-none relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            {loading ? <Loader2 size={20} className="animate-spin relative z-10" /> : <Plus size={20} className="relative z-10" />} 
                            <span className="relative z-10">Admittance Protocol</span>
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-primary/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />
                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-5 rounded-3xl ${stat.bg} ${stat.color} shadow-inner`}>
                                    <stat.icon size={28} />
                                </div>
                                <MoreVertical className="text-slate-200" size={20} />
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">{stat.value}</h2>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Queue Management */}
                    <div className="lg:col-span-8 space-y-10">
                        <section className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3 italic">
                                        <Users className="text-primary" size={24} />
                                        Live OPD Queue
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1 ml-9">Real-time Patient Flow</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[10px] px-6 py-2 rounded-xl bg-slate-50 text-slate-900 font-black ring-1 ring-slate-100 uppercase tracking-widest">Today Only</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loading && queue.length === 0 ? (
                                    <div className="flex flex-col items-center py-20 gap-6">
                                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                                            <Loader2 className="animate-spin text-primary" size={32} />
                                        </div>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Neural Grid Syncing...</p>
                                    </div>
                                ) : queue.map((patient, _i) => (
                                    <motion.div
                                        key={patient.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex flex-col sm:flex-row items-center justify-between p-7 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all group gap-6 relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-6 w-full sm:w-auto z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary font-black text-xl shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform border border-slate-100">
                                                {patient.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-base text-slate-900 tracking-tight italic">{patient.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{patient.id}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-12 w-full sm:w-auto z-10">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[9px] text-slate-300 mb-1 font-black uppercase tracking-[0.2em]">Wait Prediction</p>
                                                <p className="text-base font-black text-primary italic underline underline-offset-4 decoration-primary/20">{patient.wait}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => notifyPatient(patient)}
                                                    disabled={notifyingId === patient.id}
                                                    className="p-4 bg-white text-slate-400 rounded-2xl hover:text-primary hover:shadow-lg transition-all border border-slate-100 disabled:opacity-50 active:scale-95 group/btn"
                                                    title="Notify Patient via SMS"
                                                >
                                                    {notifyingId === patient.id && !successMsg?.includes('called') ? <Loader2 size={18} className="animate-spin" /> : <Bell size={18} className="group-hover/btn:animate-ring" />}
                                                </button>
                                                <PixelButton
                                                    onClick={() => handleCallIn(patient)}
                                                    color="primary"
                                                    className="py-3 px-8"
                                                >
                                                    Call In
                                                </PixelButton>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {queue.length === 0 && !loading && (
                                    <div className="py-20 text-center">
                                        <p className="text-slate-400 text-sm font-bold italic">No patients in queue</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <BedAllocation wards={hospitalData?.wards || []} />
                    </div>

                    {/* Widgets Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="bg-white border border-slate-100 rounded-[3rem] p-10 relative overflow-hidden group shadow-xl shadow-slate-200/50">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.03] rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                            <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                                <TrendingUp size={18} />
                                Intelligence Hub
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tighter italic">Surge Warning</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-bold">
                                OPD influx predicted to increase by <span className="text-primary font-black underline underline-offset-4 decoration-primary/30">15.4%</span> between 8 PM and 10 PM.
                            </p>
                            <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Recommendation</p>
                                <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                                    Activate Ward D overflow protocol and stagger nursing shifts for peak performance.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MedQueueAdmin;
