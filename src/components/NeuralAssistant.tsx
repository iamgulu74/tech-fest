import { useState, useRef, useEffect } from 'react';
import { Send, Brain, User, Bot, Loader2, Sparkles } from 'lucide-react';

const NeuralAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your Neural Health Assistant. I can explain complex medical concepts, disease pathologies, latest health studies, and biology. What would you like to learn today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
            // Simulated AI Brain processing
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 1500));
            
            let answer = `That's a fascinating topic! Based on the latest clinical literature and neural data, the key mechanisms involve complex biochemical pathways. (This is a mock AI response classifying the topic of: "${userMessage.content}")`;
            const lowerInput = userMessage.content.toLowerCase();
            
            if (lowerInput.includes('type 2 diabetes') || lowerInput.includes('indicators of')) {
                answer = "Early indicators of type 2 diabetes often develop gradually. They include: \n\n• Frequent urination (polyuria)\n• Excessive thirst (polydipsia)\n• Increased hunger (polyphagia)\n• Unexplained weight loss\n• Fatigue and blurred vision\n• Slow-healing sores and frequent infections\n• Acanthosis nigricans (darkened skin areas, usually in the neck or armpits, signaling insulin resistance).";
            } else if (lowerInput.includes('metformin')) {
                answer = "Metformin's most common side effects are gastrointestinal. These include:\n\n• Nausea, vomiting, and diarrhea\n• Abdominal discomfort and bloating\n• A persistent metallic taste in the mouth\n\nThese symptoms usually subside within a few weeks as the body adjusts. A rare but severe complication is 'lactic acidosis'. Additionally, prolonged use can lower Vitamin B12 levels over time.";
            } else if (lowerInput.includes('rem sleep')) {
                answer = "To improve REM (Rapid Eye Movement) sleep naturally:\n\n1. Reduce alcohol and cannabis consumption before bed, as both are heavy REM-suppressants.\n2. Maintain a strict, consistent sleep schedule to anchor your circadian rhythm.\n3. Ensure you sleep a full 7-9 hours, because the longest REM stages occur in the final third of your sleep cycle.\n4. Avoid bright screens and blue light 90 minutes prior to falling asleep.";
            } else if (lowerInput.includes('heart attack') && lowerInput.includes('heartburn')) {
                answer = "Key differences between a Heart Attack and Heartburn:\n\n• HEARTBURN is caused by acid reflux in the esophagus. It feels like a burning sensation moving up to the throat and usually worsens when lying down after eating.\n• A HEART ATTACK involves ischemic heart pressure. It typically manifests as a crushing, squeezing tightness in the center of the chest that radiates to the left arm, neck, or jaw. It's often accompanied by shortness of breath, cold sweat, and dizziness.\n\n*If you are unsure, always assume the worst and seek emergency care.*";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "My neural pathways are temporarily crossed. Please try asking again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="bg-secondary/10 p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-secondary/20">
                        <div className="w-full h-full bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Brain size={18} className="text-secondary" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            Neural Assistant <Sparkles size={12} className="text-secondary" />
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medical Education AI</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ${
                                m.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 border border-secondary/30 text-secondary'
                            }`}>
                                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed tracking-wide whitespace-pre-wrap ${m.role === 'user'
                                ? 'bg-primary text-white rounded-tr-sm font-bold shadow-xl'
                                : 'bg-white text-slate-600 rounded-tl-sm border border-slate-100 font-medium shadow-sm'
                                }`}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start items-center gap-3 text-secondary italic text-xs font-bold animate-pulse px-2">
                        <div className="w-8 h-8 flex items-center justify-center"><Loader2 size={16} className="animate-spin" /></div> Processing educational database...
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-white border-t border-slate-100 backdrop-blur-md">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-secondary/50 to-blue-500/50 rounded-[1.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about human anatomy, disease mechanisms..."
                        className="relative w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-sm focus:border-secondary outline-none transition-all placeholder:text-slate-300 font-black text-slate-900 shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center hover:bg-secondary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NeuralAssistant;
