import { useState, useRef, useEffect } from 'react';
import { Send, Activity, User, Bot, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { checkSymptoms, sendEmergencyAlert } from '../lib/api';

const SymptomChecker = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your MedQueue AI Assistant. Please describe your symptoms or ask any health queries, and I'll identify possible conditions and recommend next steps." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [alertState, setAlertState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await checkSymptoms(input);
            // Simulate 2 to 3 seconds of AI "thinking" time
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 2000));
            setMessages(prev => [...prev, response.message]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my neural core. Please try again or consult a doctor directly." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const triggerEmergency = async () => {
        setAlertState('sending');
        try {
            await sendEmergencyAlert("+916371401928", "Current User Location", "Severe Symptom Escalation");
            setAlertState('sent');
            setTimeout(() => setAlertState('idle'), 4000);
            setMessages(prev => [...prev, { role: 'assistant', content: "EMERGENCY ALERT TRIGGERED. Dispatch units have been notified of your location. Please stay where you are and try to remain calm." }]);
        } catch (error) {
            setAlertState('idle');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="bg-primary/10 p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Activity size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">AI Assistant</h3>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">Neural Health Core v2.0</p>
                    </div>
                </div>

                <button
                    onClick={triggerEmergency}
                    disabled={alertState !== 'idle'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${alertState === 'sent' ? 'bg-secondary text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30'
                        }`}
                >
                    {alertState === 'sending' ? <Loader2 size={12} className="animate-spin" /> :
                        alertState === 'sent' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {alertState === 'sending' ? 'Dispatching...' : alertState === 'sent' ? 'Alert Sent' : 'Emergency'}
                </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${m.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'
                                }`}>
                                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                            </div>
                            <div className={`p-3 rounded-2xl text-[11px] leading-relaxed ${m.role === 'user'
                                ? 'bg-primary text-white rounded-tr-none shadow-lg font-bold'
                                : m.content.includes('EMERGENCY')
                                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none font-black italic shadow-sm'
                                    : 'bg-white text-slate-600 rounded-tl-none border border-slate-100 font-medium shadow-sm'
                                }`}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start items-center gap-2 text-primary italic text-[10px] font-bold animate-pulse">
                        <Loader2 size={12} className="animate-spin" /> Analyzing neurological data patterns...
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Describe your symptoms..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-xs focus:border-primary outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900 shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SymptomChecker;
