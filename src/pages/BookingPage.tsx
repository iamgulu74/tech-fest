import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Star, 
    CheckCircle2, 
    ShieldCheck, 
    ArrowRight, 
    Users,
    ArrowLeft,
    Loader2,
    CreditCard,
    Smartphone,
    Shield
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PixelButton from '../components/PixelButton';
import { admitPatient } from '../lib/api';
import { useAuth } from '../components/ProtectedRoute';

// Expanded Mock doctors with experience and ratings
const doctorsData: Record<string, any[]> = {
    "General Physician": [
        { id: 1, name: "Dr. Arvind Sharma", exp: "12 Years", rating: 4.8, specialization: "Primary Care", patients: "1500+", fee: "₹500", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arvind" },
        { id: 2, name: "Dr. Meera Iyer", exp: "8 Years", rating: 4.7, specialization: "Family Medicine", patients: "900+", fee: "₹450", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera" },
        { id: 201, name: "Dr. Sunil Varma", exp: "15 Years", rating: 4.9, specialization: "Internal Medicine", patients: "2100+", fee: "₹600", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunil" },
        { id: 202, name: "Dr. Kavita Rao", exp: "10 Years", rating: 4.6, specialization: "General Medicine", patients: "1100+", fee: "₹500", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita" },
        { id: 203, name: "Dr. Rahul Malhotra", exp: "7 Years", rating: 4.5, specialization: "Primary Care", patients: "750+", fee: "₹400", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
        { id: 204, name: "Dr. Shweta Singh", exp: "14 Years", rating: 4.8, specialization: "Family Health", patients: "1900+", fee: "₹550", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shweta" },
    ],
    "Cardiologist": [
        { id: 3, name: "Dr. Rajesh Gupta", exp: "20 Years", rating: 4.9, specialization: "Interventional Cardiology", patients: "2500+", fee: "₹1200", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" },
        { id: 4, name: "Dr. Sneha Patil", exp: "15 Years", rating: 4.8, specialization: "Heart Surgeon", patients: "1800+", fee: "₹1500", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
        { id: 301, name: "Dr. Amit Bhardwaj", exp: "22 Years", rating: 5.0, specialization: "Cardiovascular Surgery", patients: "3000+", fee: "₹2000", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" },
        { id: 302, name: "Dr. Deepa Nair", exp: "12 Years", rating: 4.7, specialization: "Clinical Cardiology", patients: "1400+", fee: "₹1000", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa" },
        { id: 303, name: "Dr. Rohan Das", exp: "18 Years", rating: 4.9, specialization: "Electrophysiology", patients: "2200+", fee: "₹1800", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
        { id: 304, name: "Dr. Neha Kapoor", exp: "9 Years", rating: 4.6, specialization: "Pediatric Cardiology", patients: "600+", fee: "₹1200", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha" },
    ],
    "Dermatologist": [
        { id: 5, name: "Dr. Vikram Sethi", exp: "10 Years", rating: 4.6, specialization: "Skin & Laser", patients: "1200+", fee: "₹800", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
        { id: 6, name: "Dr. Anjali Verma", exp: "14 Years", rating: 4.9, specialization: "Cosmetic Dermatology", patients: "2000+", fee: "₹1000", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali" },
        { id: 401, name: "Dr. Preeti Jain", exp: "11 Years", rating: 4.7, specialization: "Dermatopathology", patients: "1300+", fee: "₹900", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Preeti" },
        { id: 402, name: "Dr. Siddharth Roy", exp: "16 Years", rating: 4.8, specialization: "Trichology", patients: "2400+", fee: "₹1200", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth" },
        { id: 403, name: "Dr. Tanvi Shah", exp: "6 Years", rating: 4.5, specialization: "Clinical Dermatology", patients: "500+", fee: "₹700", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvi" },
        { id: 404, name: "Dr. Manish Pandey", exp: "19 Years", rating: 4.9, specialization: "Surgical Dermatology", patients: "2800+", fee: "₹1100", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manish" },
    ],
    "Neurologist": [
        { id: 7, name: "Dr. Sameer Deshmukh", exp: "18 Years", rating: 4.9, specialization: "Neurosurgeon", patients: "1100+", fee: "₹2000", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sameer" },
        { id: 8, name: "Dr. Pooja Reddy", exp: "11 Years", rating: 4.7, specialization: "Neurology", patients: "850+", fee: "₹1500", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja" },
        { id: 501, name: "Dr. Kiran More", exp: "25 Years", rating: 5.0, specialization: "Epilepsy Expert", patients: "3500+", fee: "₹2500", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran" },
        { id: 502, name: "Dr. Aarti Kulkarni", exp: "14 Years", rating: 4.8, specialization: "Neuromuscular", patients: "1600+", fee: "₹1800", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarti" },
        { id: 503, name: "Dr. Vivek Chawla", exp: "12 Years", rating: 4.6, specialization: "Stroke Specialist", patients: "1200+", fee: "₹1600", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vivek" },
        { id: 504, name: "Dr. Ritu Saxena", exp: "9 Years", rating: 4.7, specialization: "Pediatric Neurology", patients: "700+", fee: "₹1400", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritu" },
    ]
};

const BookingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    
    // Get hospital from URL params
    const hospitalName = searchParams.get('hospital') || 'Selected Hospital';
    const hospitalId = searchParams.get('id') || '';

    const [bookingStep, setBookingStep] = useState(1); // 1: Select Doctor, 2: Final Details, 3: Payment
    const [selectedDept, setSelectedDept] = useState("General Physician");
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

    const [patientData, setPatientData] = useState({
        name: user?.name || '',
        phone: '+91 ',
        address: '',
        age: '',
        gender: 'Male'
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingStep(3); // Move to Payment Step
    };

    const handleFinalBooking = async () => {
        setIsSubmitting(true);
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const bookingData = {
                ...patientData,
                doctorType: selectedDept,
                doctorName: selectedDoctor.name,
                hospitalId: hospitalId
            };
            
            const result = await admitPatient(hospitalId, bookingData);
            
            if (result.success) {
                // Save to history
                const newBooking = {
                    id: Date.now(),
                    token: result.patient.token,
                    hospital: hospitalName,
                    doctor: `${selectedDoctor.name} (${selectedDept})`,
                    name: patientData.name,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    status: 'Scheduled',
                    feePaid: selectedDoctor.fee
                };
                
                const history = JSON.parse(localStorage.getItem('medQueueHistory') || '[]');
                localStorage.setItem('medQueueHistory', JSON.stringify([newBooking, ...history]));
                
                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Booking error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden">
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />

            <div className="max-w-6xl mx-auto p-6 md:p-12">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <button 
                                onClick={() => {
                                    if (bookingStep > 1) setBookingStep(bookingStep - 1);
                                    else if (window.history.length > 1) navigate(-1);
                                    else navigate('/patient');
                                }} 
                                className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Step {bookingStep} of 3</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic line-clamp-1">
                            {bookingStep === 1 ? "Choose Expert" : bookingStep === 2 ? "Patient Details" : "Secure Payment"}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                           <MapPin size={12} className="text-primary" /> Booking at {hospitalName}
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/10">
                            <ShieldCheck className="text-primary" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Verified Booking</p>
                            <p className="text-xs font-bold text-slate-900 uppercase">Secure Session Active</p>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {bookingStep === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* Department Selection */}
                            <div className="flex flex-wrap gap-3">
                                {Object.keys(doctorsData).map((dept) => (
                                    <button
                                        key={dept}
                                        onClick={() => setSelectedDept(dept)}
                                        className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                                            selectedDept === dept 
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                            : 'bg-white border-slate-200 text-slate-400 hover:border-primary/30'
                                        }`}
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </div>

                            {/* Doctor Selection Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctorsData[selectedDept]?.map((doctor) => (
                                    <motion.div
                                        key={doctor.id}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedDoctor(doctor)}
                                        className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden bg-white shadow-sm ${
                                            selectedDoctor?.id === doctor.id ? 'border-primary ring-1 ring-primary/20' : 'border-slate-100 hover:border-primary/20'
                                        }`}
                                    >
                                        {selectedDoctor?.id === doctor.id && (
                                            <div className="absolute top-4 right-4 text-primary">
                                                <CheckCircle2 size={24} />
                                            </div>
                                        )}

                                        <div className="flex gap-4 items-start mb-6">
                                            <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-slate-100 p-1 group-hover:border-primary/50 transition-colors bg-slate-50">
                                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover rounded-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{doctor.name}</h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star size={12} className="text-secondary fill-secondary" />
                                                    <span className="text-[10px] font-black text-secondary">{doctor.rating}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Reviewed</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Experience</p>
                                                <p className="text-sm font-bold text-slate-900">{doctor.exp}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Consult Fee</p>
                                                <p className="text-sm font-bold text-slate-900">{doctor.fee}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doctor.patients} Served</span>
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-primary tracking-widest">Available Today</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {selectedDoctor && (
                                <motion.div 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6"
                                >
                                    <PixelButton 
                                        color="primary" 
                                        className="w-full py-6 text-lg tracking-[0.2em] shadow-2xl shadow-primary/30"
                                        onClick={() => setBookingStep(2)}
                                    >
                                        Proceed with {selectedDoctor.name.split(' ')[1]} <ArrowRight size={20} className="ml-2" />
                                    </PixelButton>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {bookingStep === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-xl mx-auto"
                        >
                            <form onSubmit={handleFormSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-[2rem] border border-primary/10 mb-4">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-primary/20 bg-slate-50">
                                        <img src={selectedDoctor.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Selected Expert</p>
                                        <p className="font-bold text-lg text-slate-900 leading-tight">{selectedDoctor.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Patient Name</label>
                                        <input 
                                            required
                                            type="text"
                                            value={patientData.name}
                                            onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 font-bold"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Age</label>
                                            <input 
                                                required
                                                type="number"
                                                value={patientData.age}
                                                onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 font-bold"
                                                placeholder="24"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Gender</label>
                                            <select 
                                                value={patientData.gender}
                                                onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 font-bold appearance-none cursor-pointer"
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Phone Number</label>
                                        <input 
                                            required
                                            type="tel"
                                            value={patientData.phone}
                                            onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Problem Description</label>
                                        <textarea 
                                            required
                                            value={patientData.address}
                                            onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                                            rows={3}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 font-bold resize-none"
                                            placeholder="Describe your health concern..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <PixelButton 
                                        type="button"
                                        color="neutral" 
                                        className="flex-1 py-4 uppercase font-black tracking-widest text-[10px]"
                                        onClick={() => setBookingStep(1)}
                                    >
                                        Go Back
                                    </PixelButton>
                                    <PixelButton 
                                        type="submit"
                                        color="primary" 
                                        className="flex-[2] py-4"
                                    >
                                        Proceed to Payment
                                    </PixelButton>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {bookingStep === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-xl mx-auto"
                        >
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                                <div className="text-center mb-8">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2">Checkout Details</p>
                                    <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase mb-4">Total: {selectedDoctor?.fee}</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Inclusive of all medical taxes</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${
                                            paymentMethod === 'upi' ? 'bg-primary/5 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                    >
                                        <Smartphone size={32} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">UPI Payment</span>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${
                                            paymentMethod === 'card' ? 'bg-primary/5 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                    >
                                        <CreditCard size={32} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Credit/Debit</span>
                                    </button>
                                </div>

                                {paymentMethod === 'upi' ? (
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Scan QR or Enter VPA</p>
                                            <div className="w-32 h-32 bg-white mx-auto rounded-2xl border border-slate-200 mb-4 flex items-center justify-center shadow-inner">
                                                <div className="text-[8px] text-slate-300 font-black uppercase">Secure QR Area</div>
                                            </div>
                                            <input 
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-center text-sm font-bold uppercase tracking-widest focus:border-primary outline-none"
                                                placeholder="user@upi-service"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 font-bold"
                                            placeholder="Card Number"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none text-slate-900 font-bold" placeholder="MM/YY" />
                                            <input className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none text-slate-900 font-bold" placeholder="CVV" />
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-3">
                                    <Shield size={16} className="text-green-600" />
                                    <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
                                        PCI-DSS COMPLIANT ENCRYPTION ENABLED
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <PixelButton 
                                        color="neutral" 
                                        className="flex-1 py-4 uppercase font-black tracking-widest text-[10px]"
                                        onClick={() => setBookingStep(2)}
                                    >
                                        Details
                                    </PixelButton>
                                    <PixelButton 
                                        onClick={handleFinalBooking}
                                        color="primary" 
                                        className="flex-[2] py-4"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : `Pay ${selectedDoctor.fee}`}
                                    </PixelButton>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <footer className="mt-24 text-center pb-12">
                     <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] mb-4">MedQueue Secure Gateway</p>
                     <div className="flex items-center justify-center gap-6 opacity-30 grayscale contrast-125">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/640px-UPI-Logo.png" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Visa_Logo.png/640px-Visa_Logo.png" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Mastercard_logo.svg/1200px-Mastercard_logo.svg.png" className="h-4" />
                     </div>
                </footer>
            </div>
        </div>
    );
};

export default BookingPage;
