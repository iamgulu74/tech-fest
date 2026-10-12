import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Phone, Search, Filter, CheckCircle2, Loader2, Calendar, X, ArrowLeft } from 'lucide-react';
import { sendBookingNotification, fetchHospitals } from '../lib/api';
import { useNavigate } from 'react-router-dom';

// Create custom icons for beds available (green) and no beds (red)
const createIcon = (color: string, isSelected: boolean) => {
    const size = isSelected ? 20 : 14;
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.2); transition: all 0.2s ease;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
    });
};

const center = { lat: 20.5937, lng: 78.9629 }; // Center of India

// Component to handle map view updates
function MapController({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true, duration: 1.5 });
    }, [center, zoom, map]);
    return null;
}

const HospitalFinder = () => {
    const navigate = useNavigate();
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
    const [bookingState, setBookingState] = useState<'idle' | 'booking' | 'confirmed'>('idle');
    const [showFilter, setShowFilter] = useState(false);
    
    // Dynamic hospital data
    const [allHospitals, setAllHospitals] = useState<any[]>([]);
    const [hospitals, setHospitals] = useState<any[]>([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState(center);
    const [mapZoom, setMapZoom] = useState(5);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Initial geolocation to center map on user
    useEffect(() => {
        const loadInitialData = async () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
                        setMapCenter(userPos);
                        setMapZoom(11);
                        
                        try {
                            const data = await fetchHospitals(userPos.lat, userPos.lng);
                            if (data && data.length > 0) {
                                setAllHospitals(data);
                                setHospitals(data);
                            }
                        } catch (err: any) {
                            console.error(err);
                            setErrorMsg(err.message);
                        }
                    },
                    async (error) => {
                        console.log("Geolocation error or denied:", error);
                        try {
                            const data = await fetchHospitals(center.lat, center.lng);
                            setAllHospitals(data || []);
                            setHospitals(data || []);
                        } catch (err: any) {
                            setErrorMsg(err.message);
                        }
                    }
                );
            } else {
                try {
                    const data = await fetchHospitals(center.lat, center.lng);
                    setAllHospitals(data || []);
                    setHospitals(data || []);
                } catch (err: any) {
                    setErrorMsg(err.message);
                }
            }
        };
        
        loadInitialData();
    }, []);

    // Filter hospitals based on search
    useEffect(() => {
        if (!searchQuery) {
            setHospitals(allHospitals);
            return;
        }
        const lower = searchQuery.toLowerCase();
        const filtered = allHospitals.filter(h => 
            (h.name && h.name.toLowerCase().includes(lower)) || 
            (h.city && h.city.toLowerCase().includes(lower)) || 
            (h.state && h.state.toLowerCase().includes(lower)) || 
            (h.address && h.address.toLowerCase().includes(lower))
        );
        setHospitals(filtered);
    }, [searchQuery, allHospitals]);

    const handleBooking = async (hospital: any) => {
        setBookingState('booking');
        try {
            // In a real app, this would be the user's phone from context
            const userPhone = "+916371401928";
            await sendBookingNotification(userPhone, hospital.name, "15 minutes");
            setBookingState('confirmed');
            setTimeout(() => setBookingState('idle'), 5000);
        } catch (error) {
            console.error("Booking error", error);
            setBookingState('idle');
        }
    };

    const handleMapNavigation = (hospital: any) => {
        setMapCenter(hospital.position);
        setMapZoom(16);
        setSelectedHospital(hospital);
    };

    const handlePhoneCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    return (
        <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
            {/* Confirmation Overlay */}
            <AnimatePresence>
                {bookingState === 'confirmed' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[1001] bg-secondary px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 text-white"
                    >
                        <CheckCircle2 className="text-white" size={24} />
                        <span className="font-bold">Bed Reserved! Confirmation sent to your phone.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            {errorMsg && (
                <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-semibold sticky top-0 z-[2000]">
                    {errorMsg}
                </div>
            )}
            <header className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-white/70 backdrop-blur-xl shrink-0 z-10 relative">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/patient')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:border-slate-300"
                        title="Go back"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">MQ</div>
                        <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900">MedQueue / <span className="text-slate-400">Find a Bed</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search state, city or hospital..."
                            className="bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-5 text-sm focus:border-primary focus:bg-white outline-none min-w-[320px] transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="p-2.5 bg-slate-100 border border-slate-200 rounded-full hover:bg-slate-200 transition-colors text-slate-600 shadow-sm"
                    >
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            {/* Filter Modal */}
            <AnimatePresence>
                {showFilter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[1000] flex items-center justify-center p-6"
                        onClick={() => setShowFilter(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border border-slate-200 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setShowFilter(false)} 
                                className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="mb-10 text-center">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Filter Hospitals</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Refine your search results</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Availability</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm text-slate-900 font-bold outline-none appearance-none focus:border-primary focus:bg-white transition-all">
                                        <option value="all">All Hospitals</option>
                                        <option value="available">Only Available Beds</option>
                                        <option value="full">No Beds Available</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm text-slate-900 font-bold outline-none appearance-none focus:border-primary focus:bg-white transition-all"
                                        onChange={(e) => setSearchQuery(e.target.value === 'All' ? '' : e.target.value)}
                                    >
                                        <option value="All">All States</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Kerala">Kerala</option>
                                    </select>
                                </div>
                                <button onClick={() => setShowFilter(false)} className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Apply Filters</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <aside className="w-[450px] overflow-y-auto p-8 border-r border-slate-200 custom-scrollbar shrink-0 z-10 relative bg-white/50 backdrop-blur-xl">
                    <div className="space-y-6 pb-20">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-black italic tracking-tighter uppercase text-slate-900">Medical Hubs</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Node Status</p>
                            </div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">{hospitals.length} Result{hospitals.length !== 1 ? 's' : ''}</span>
                        </div>
                        
                        {hospitals.length === 0 && (
                            <div className="text-center py-20 text-slate-300">
                                <Search className="mx-auto mb-4 opacity-20" size={64} />
                                <p className="font-black uppercase text-[10px] tracking-[0.2em] italic">No institutions found</p>
                            </div>
                        )}

                        {hospitals.map((h) => (
                            <motion.div
                                key={h.id}
                                whileHover={{ y: -4 }}
                                onClick={() => handleMapNavigation(h)}
                                className={`p-8 rounded-[2.5rem] cursor-pointer transition-all border ${selectedHospital?.id === h.id
                                    ? 'bg-white border-primary shadow-2xl shadow-primary/5'
                                    : 'bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl leading-tight text-slate-900 italic tracking-tight">{h.name}</h3>
                                        <p className="text-[10px] text-primary font-black mt-1 uppercase tracking-[0.2em]">{h.city || h.state}</p>
                                        <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-3 font-medium leading-relaxed">
                                            <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" /> {h.address}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0 ml-4 border ${h.beds > 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                        {h.beds > 0 ? 'Protocol Open' : 'Full Capacity'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-center shadow-inner">
                                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Queue</span>
                                        <span className="text-xl font-black text-slate-900 italic leading-none">
                                            {h.queue} 
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-center shadow-inner">
                                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Wait</span>
                                        <span className="text-xl font-black text-orange-500 italic leading-none">
                                            {h.queue * 5}<span className="text-[10px] font-bold">m</span>
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-center shadow-inner">
                                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Beds</span>
                                        <span className={`text-xl font-black leading-none italic ${h.beds > 15 ? 'text-primary' : h.beds > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                                            {h.beds} 
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        disabled={h.beds === 0 || bookingState === 'booking'}
                                        onClick={(e) => { e.stopPropagation(); handleBooking(h); }}
                                        className="flex-[2.5] py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                                    >
                                        {bookingState === 'booking' && selectedHospital?.id === h.id ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Calendar size={16} />
                                        )}
                                        Reserve Protocol
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${h.name}, ${h.address}`)}`, '_blank'); }}
                                        className="flex-1 p-3 bg-slate-100 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-200 hover:text-slate-900 transition-all flex flex-col justify-center items-center shadow-sm"
                                        title="Get Directions"
                                    >
                                        <Navigation size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePhoneCall(h.phone); }}
                                        className="flex-1 p-3 bg-slate-100 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-200 hover:text-slate-900 transition-all flex flex-col justify-center items-center shadow-sm"
                                        title={h.phone}
                                    >
                                        <Phone size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative bg-slate-200">
                    <MapContainer 
                        center={center} 
                        zoom={5} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <MapController center={mapCenter} zoom={mapZoom} />
                        
                        <TileLayer
                            attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=sHz8fsn05SOI0cKbHK6g"
                        />
                        
                        {allHospitals.map(h => (
                            <Marker 
                                key={h.id} 
                                position={h.position}
                                icon={createIcon(h.beds > 0 ? '#3b82f6' : '#ef4444', selectedHospital?.id === h.id)}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedHospital(h);
                                        setMapCenter(h.position);
                                        setMapZoom(16);
                                    }
                                }}
                            >
                                <Popup className="custom-popup" closeButton={false}>
                                    <div className="p-2 font-sans text-center">
                                        <h4 className="font-black text-slate-900 m-0 uppercase italic tracking-tight">{h.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 mt-1 mb-3 uppercase tracking-widest">{h.city}</p>
                                        <div className={`text-[10px] font-black px-4 py-1.5 rounded-full border shadow-sm ${h.beds > 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                            {h.beds > 0 ? `${h.beds} BEDS OPEN` : 'NO CAPACITY'}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                    
                    {/* Legend */}
                    <div className="absolute top-8 right-8 z-[400] bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 shadow-2xl">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Status Protocol</h4>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm"></span>
                                Capacity Available
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></span>
                                Critical Load
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Global CSS overrides for Leaflet in a light theme */}
            <style dangerouslySetInnerHTML={{__html: `
                .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    border-radius: 20px;
                    padding: 8px;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
                .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.9);
                }
                .leaflet-container {
                    background: #f1f5f9;
                    font-family: inherit;
                }
                .leaflet-div-icon {
                    background: transparent;
                    border: none;
                }
            `}} />
        </div>
    );
};

export default HospitalFinder;
