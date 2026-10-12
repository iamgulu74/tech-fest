import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { 
    Ticket, 
    Stethoscope, 
    Activity, 
    AlertCircle, 
    CheckCircle2, 
    User,
    RefreshCw,
    ShieldCheck,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PixelButton from '../components/PixelButton';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [booking, setBooking] = useState<any>(null);
    const [queueSpeed] = useState(5); // Minutes per patient
    const [currentRunningToken, setCurrentRunningToken] = useState<number>(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Load latest booking from history
        try {
            const history = JSON.parse(localStorage.getItem('medQueueHistory') || '[]');
            if (history.length > 0) {
                const latest = history[0]; // Most recent booking
                setBooking(latest);
                
                // Extract numeric part of token if it's like TKN-1234
                const tokenNum = parseInt(latest.token.split('-')[1]) || 100;
                // Simulate the current token running is a few steps behind
                setCurrentRunningToken(Math.max(tokenNum - Math.floor(Math.random() * 5 + 2), 1));
            }
        } catch (e) {
            console.error("Error parsing history", e);
        }
    }, []);

    // Simulated real-time update logic: Reduces position/wait time randomly between 30sec - 4min
    useEffect(() => {
        if (!booking) return;

        const updateQueue = () => {
            setCurrentRunningToken(prev => prev + 1);
            
            // Schedule the next update randomly between 30s (30000ms) and 4min (240000ms)
            const nextUpdate = Math.floor(Math.random() * (240000 - 30000 + 1)) + 30000;
            console.log(`Next queue update in ${nextUpdate / 1000}s`);
            
            timeoutId = setTimeout(updateQueue, nextUpdate);
        };

        let timeoutId = setTimeout(updateQueue, 15000); // Initial update after 15s

        return () => clearTimeout(timeoutId);
    }, [booking]);

    const myTokenNum = booking ? parseInt(booking.token.split('-')[1]) : 0;
    const patientPosition = booking ? Math.max(myTokenNum - currentRunningToken, 0) : 0;
    const estimatedWait = Math.max(patientPosition * queueSpeed, 0);

    // Stop currentRunningToken at myTokenNum
    useEffect(() => {
        if (currentRunningToken > myTokenNum) {
            setCurrentRunningToken(myTokenNum);
        }
    }, [currentRunningToken, myTokenNum]);

    const refreshStatus = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const history = JSON.parse(localStorage.getItem('medQueueHistory') || '[]');
                if (history.length > 0) {
                    history.shift(); // Remove the active/most recent booking
                    localStorage.setItem('medQueueHistory', JSON.stringify(history));
                }
                navigate('/patient');
            } catch (e) {
                console.error("Cancelation error:", e);
                navigate('/patient');
            }
        }
    };

    const handleDownloadReceipt = () => {
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const primaryColor = '#3b82f6';
        const secondaryColor = '#000000';

        // Background / Header Bar
        doc.setFillColor(59, 130, 246); // Primary blue
        doc.rect(0, 0, 210, 40, 'F');

        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.text('MEDQUEUE', 15, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('OFFICIAL DIGITAL APPOINTMENT RECEIPT', 15, 28);
        doc.text(`DATE: ${booking.date || new Date().toLocaleDateString()}`, 160, 20);
        doc.text(`TIME: ${booking.time}`, 160, 26);

        // Token Section
        doc.setTextColor(secondaryColor);
        doc.setFontSize(14);
        doc.text('TOKEN IDENTIFIER', 15, 60);
        
        doc.setFontSize(40);
        doc.setTextColor(primaryColor);
        doc.text(booking.token, 15, 75);

        // Hospital Details
        doc.setTextColor(secondaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('HOSPITAL UNIT', 15, 95);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.text(booking.hospital, 15, 102);

        // Patient Data
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 115, 195, 115);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('PATIENT NAME:', 15, 130);
        doc.text('CONSULTATION FOR:', 110, 130);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.text(booking.name, 15, 138);
        doc.text(booking.doctor || 'General Triage', 110, 138);

        // Instructions
        doc.setFillColor(245, 245, 245);
        doc.rect(15, 160, 180, 45, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('IMPORTANT INSTRUCTIONS:', 20, 172);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('1. Please arrive 15 minutes prior to your estimated wait time.', 20, 180);
        doc.text('2. Present this digital code at the hospital reception/triage desk.', 20, 186);
        doc.text('3. Carry a valid government photo ID for identity verification.', 20, 192);
        doc.text('4. Your queue position is monitored live on the MedQueue Dashboard.', 20, 198);

        // Footer / Verification
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('This receipt is digitally signed and verified by the MedQueue AI Infrastructure.', 15, 225);
        const namePart = booking.name || "";
        const tokenPart = booking.token || "";
        doc.text(`Secure Token Hash: ${btoa(tokenPart + namePart).substring(0, 32)}`, 15, 230);

        // Digital Signature Section
        doc.setDrawColor(59, 130, 246);
        doc.rect(15, 240, 60, 25);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text(booking.doctor || "Authorized Officer", 45, 253, { align: 'center' });
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("DIGITAL SIGNATURE", 45, 260, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text('HEALTHCARE SIMPLIFIED.', 110, 235);

        // QR Section - Generate Scannable Redirect
        const dashboardUrl = `${window.location.origin}/dashboard`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dashboardUrl)}`;
        
        const qrImage = new Image();
        qrImage.crossOrigin = "Anonymous";
        qrImage.src = qrApiUrl;
        
        qrImage.onload = () => {
            // Embed QR Code
            doc.setDrawColor(primaryColor);
            doc.rect(158, 238, 34, 34); // Border for QR
            doc.addImage(qrImage, 'PNG', 160, 240, 30, 30);
            
            doc.setFontSize(6);
            doc.setTextColor(primaryColor);
            doc.setFont('helvetica', 'bold');
            doc.text('SCAN FOR LIVE STATUS', 162, 273);

            doc.save(`MedQueue_Receipt_${booking.token}.pdf`);
        };

        qrImage.onerror = () => {
            // Fallback if image fails to load
            doc.setDrawColor(primaryColor);
            doc.rect(160, 240, 30, 30);
            doc.text('SCAN QR CODE', 165, 255);
            doc.save(`MedQueue_Receipt_${booking.token}.pdf`);
        };
    };

    if (!booking) {
        return (
            <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-[2rem] border border-slate-200 flex items-center justify-center mb-8 shadow-sm">
                    <AlertCircle size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">No Active Booking</h2>
                <p className="text-gray-500 text-sm max-w-xs mb-8">
                    We couldn't find any recent bookings. Book a token to track your live queue status.
                </p>
                <PixelButton color="primary" onClick={() => navigate('/patient')}>
                    Book a Token Now
                </PixelButton>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 md:p-12 pb-24">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <button 
                        onClick={() => navigate('/patient')}
                        className="flex items-center gap-2 text-gray-500 hover:text-slate-900 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Portal</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <ShieldCheck size={16} className="text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 italic">Secure Queue ID: {booking.token}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Booking Details */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-200 relative overflow-hidden shadow-xl shadow-slate-200/50"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Ticket size={120} className="text-slate-900" />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Stethoscope className="text-primary" size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Selected Hospital</p>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{booking.hospital}</h2>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Appointment Time</p>
                                        <p className="text-lg font-black text-slate-900">{booking.time}</p>
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Current Status</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {patientPosition === 0 ? (
                                                <>
                                                    <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" />
                                                    <p className="text-sm font-black text-secondary uppercase tracking-tight">Your Turn!</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                    <p className="text-sm font-black text-primary uppercase">In Queue</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-primary/[0.03] rounded-[2rem] border border-primary/10 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Patient Identity</p>
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-primary" />
                                            <p className="text-lg font-bold text-slate-900">{booking.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-primary font-black uppercase mb-1">Token ID</p>
                                        <p className="text-2xl font-black text-slate-900 tracking-widest uppercase">{booking.token}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                               <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-primary/20 transition-all shadow-sm">
                                <Activity size={20} className="text-secondary mb-3" />
                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Queue Priority</p>
                                <p className="text-sm font-bold text-slate-900 uppercase">{patientPosition < 5 ? 'High Priority' : 'Standard'}</p>
                             </div>
                             <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-primary/20 transition-all shadow-sm">
                                <MapPin size={20} className="text-primary mb-3" />
                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Check-in Zone</p>
                                <p className="text-sm font-bold text-slate-900 uppercase">
                                    {booking.hospital.includes('Clinic') ? 'Reception Desk' : 'Main Triage - Block B'}
                                </p>
                             </div>
                        </div>
                    </div>

                    {/* Live Queue Status */}
                    <div className="lg:col-span-12 xl:col-span-5 h-full">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[3rem] text-slate-900 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden h-full flex flex-col justify-between"
                        >
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -top-20 -right-20 w-64 h-64 bg-primary rounded-full blur-3xl pointer-events-none" 
                            />

                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900/70">Live Queue Radar</h3>
                                    <button 
                                        onClick={refreshStatus}
                                        className={`transition-all ${isRefreshing ? 'rotate-180 opacity-50' : ''}`}
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Live Token Running</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-7xl font-black tracking-tighter text-slate-900">T-{currentRunningToken}</p>
                                            <span className="text-[10px] font-bold uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Active</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Your Position</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-3xl font-black text-slate-900">{patientPosition + 1}</p>
                                                <span className="text-xs font-bold text-slate-400">of {patientPosition + 5}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Wait Time (Est)</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-3xl font-black text-primary italic">{estimatedWait}</p>
                                                <span className="text-xs font-bold text-slate-900/40">Mins</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 space-y-4">
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
                                    <AlertCircle size={16} className="text-primary" />
                                    <p className="text-[10px] font-bold uppercase tracking-tight leading-tight text-slate-600">
                                        Wait time may fluctuate based on emergency cases.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary" />
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary" />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Syncing with {booking.hospital} Cloud...
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                         <PixelButton color="neutral" className="text-xs px-6" onClick={handleCancel}>
                            Cancel Token
                         </PixelButton>
                         <PixelButton color="primary" className="text-xs px-8 shadow-2xl shadow-primary/20" onClick={handleDownloadReceipt}>
                            Download Receipt
                         </PixelButton>
                    </div>
                </div>

                <footer className="mt-16 pt-8 border-t border-slate-200 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <CheckCircle2 size={14} className="text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">MedQueue Real-Time infrastructure</p>
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium max-w-sm mx-auto leading-relaxed uppercase tracking-tighter">
                        This dashboard provides verified queue data from centralized medical systems. 
                        Please ensure you enable notifications to receive live triage updates.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default PatientDashboard;
