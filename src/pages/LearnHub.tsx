import { useState, useEffect } from 'react';
import {
    Newspaper,
    Activity, Heart, Users, Shield, Video, Globe, PlayCircle,
    ChevronRight,
    Sun, Moon, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Language } from '../i18n/translations';

const LearnHub = () => {
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiKey = "47dc470251018ebe129f69649dcba066";
                const response = await fetch(`https://gnews.io/api/v4/top-headlines?country=in&category=health&apikey=${apiKey}`);
                const data = await response.json();
                if (data.articles) {
                    const filtered = data.articles.filter((a: any) => 
                        !a.title.toLowerCase().includes('condom') && 
                        !a.title.toLowerCase().includes('sex')
                    );
                    setNewsItems(filtered);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoadingNews(false);
            }
        };
        fetchNews();
    }, []);

    const categories = [
        { icon: Activity, titleKey: 'cat.diseases', descKey: 'cat.diseases.desc', color: 'text-red-400', premium: false, type: 'basic' },
        { icon: Heart, titleKey: 'cat.treatments', descKey: 'cat.treatments.desc', color: 'text-blue-400', premium: false, type: 'basic' },
        { icon: Users, titleKey: 'cat.wellness', descKey: 'cat.wellness.desc', color: 'text-green-400', premium: false, type: 'basic' },
        { icon: Shield, titleKey: 'cat.firstaid', descKey: 'cat.firstaid.desc', color: 'text-orange-400', premium: false, type: 'basic' },
    ];

    const handleModuleAction = (moduleKey?: string) => {
        if (moduleKey === 'cat.diseases') navigate('/learn/diseases');
        if (moduleKey === 'cat.treatments') navigate('/learn/treatments');
        if (moduleKey === 'cat.wellness') navigate('/learn/wellness');
        if (moduleKey === 'cat.firstaid') navigate('/learn/firstaid');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden text-slate-900 pb-20 selection:bg-primary/30 transition-colors duration-500">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[150px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary rounded-full blur-[150px] animate-float" style={{ animationDelay: '-3s' }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-md">
                <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xs font-black">AI</span>
                    </div>
                    <span className="text-slate-900 uppercase tracking-tight italic font-black">Health<span className="text-primary italic">Hub</span></span>
                </Link>
                <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest">
                    <Link to="/patient" className="text-slate-500 hover:text-slate-900 transition-colors">{t('nav.medqueue')}</Link>
                    <Link to="/learn" className="text-primary border-b-2 border-primary pb-1">{t('nav.learn')}</Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                            <Globe className="w-4 h-4 text-slate-500" />
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="bg-transparent border-none text-[10px] uppercase font-black text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
                            >
                                <option value="en" className="dark:bg-slate-800">English</option>
                                <option value="hi" className="dark:bg-slate-800">हिन्दी</option>
                            </select>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            title="Toggle Dark / Light Theme"
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-20">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] uppercase bg-green-500/10 border border-green-500/20 rounded-full text-green-600">
                            Free & Open Access Healthcare Hub
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none text-slate-900 dark:text-white">
                            {t('hero.title_1')}<span className="text-primary italic">{t('hero.title_highlight')}</span>{t('hero.title_2')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-8 font-medium max-w-2xl mx-auto leading-relaxed">
                            {t('hero.subtitle')}
                        </p>
                    </motion.div>
                </div>

                {/* Free Access Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass p-8 md:p-10 rounded-[2.5rem] border-primary/30 mb-16 bg-gradient-to-br from-primary/10 via-white to-secondary/10 relative overflow-hidden shadow-2xl dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-primary/30 border border-white/20">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                <span className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 text-[10px] font-black uppercase rounded-full tracking-widest flex items-center gap-1.5">
                                    <CheckCircle2 size={12} /> 100% Free Medical Intelligence
                                </span>
                                <span className="text-xs font-black text-slate-500 tracking-widest uppercase">No Subscription Required</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tighter text-slate-900 dark:text-white">
                                All Learning Modules & Clinical Protocols are Completely Free
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                Access full disease directories, clinical treatments, emergency first aid protocols, and wellness guides without any paywall.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Categories Grid Header */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black tracking-tight uppercase italic text-slate-900 dark:text-white">
                        Specialized Medical Modules
                    </h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase rounded-full tracking-widest">
                        4 Free Guides
                    </span>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    <AnimatePresence mode='popLayout'>
                        {categories.map((cat, i) => (
                            <motion.div 
                                key={t(cat.titleKey)}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                onClick={() => handleModuleAction(cat.titleKey)}
                                className="glass-card group relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-8 relative z-20">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                        <cat.icon className={`w-8 h-8 ${cat.color} group-hover:scale-110 transition-transform`} />
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                                        Free
                                    </span>
                                </div>
                                
                                <div className="relative z-20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t(cat.titleKey)}</h4>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{t(cat.descKey)}</p>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                            {t('cat.explore')} <ChevronRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Video Library & News */}
                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="glass p-10 rounded-[2.5rem] border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-3xl font-black flex items-center gap-4 tracking-tighter uppercase italic text-slate-900">
                                <Video className="w-8 h-8 text-primary" /> Healthcare Feed
                            </h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors">View All Feed</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'Frozen Shoulder? Can’t Lift Your Arm?', time: '11:20', color: 'from-blue-600', premium: false, level: 'Physiotherapy', url: 'https://youtu.be/x9WL2r3B9hg' },
                                { title: 'Stop Taking Antibiotics for Sinus! 🚫', time: '14:45', color: 'from-green-600', premium: false, level: 'Medical Cure', url: 'https://youtu.be/HvurgotUshE' },
                                { title: 'Kidney Disease Warning Signs 🩸', time: '0:58', color: 'from-red-600', premium: false, level: 'Critical Health', url: 'https://youtube.com/shorts/t9lNonmqmOY' },
                                { title: 'How Watermelon Moves Inside You 🍉', time: '0:45', color: 'from-pink-600', premium: false, level: 'Animation', url: 'https://youtube.com/shorts/ipZd8oAaj4A' }
                            ].map((video, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => window.open(video.url, '_blank')}
                                    className="flex gap-6 items-center p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer transition-all group"
                                >
                                    <div className={`w-40 h-24 bg-gradient-to-br ${video.color} to-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-xl`}>
                                        <div className="w-10 h-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                                            <PlayCircle className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black text-slate-900 dark:text-white uppercase border border-slate-100 dark:border-slate-700">{video.time}</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors truncate">{video.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{video.level}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                                <Users size={10} /> {t('video.enrolled')}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-10 rounded-[2.5rem] border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-3xl font-black flex items-center gap-4 tracking-tighter uppercase italic text-slate-900">
                                <Newspaper className="w-8 h-8 text-primary" /> {t('news.title')}
                            </h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors">{t('news.feed')}</button>
                        </div>
                        <div className="space-y-8">
                            {loadingNews ? (
                                <div className="py-12 text-center">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Latest Intelligence...</p>
                                </div>
                            ) : newsItems.length > 0 ? (
                                <>
                                    <div 
                                        onClick={() => window.open(newsItems[0].url, '_blank')}
                                        className="pb-8 border-b border-slate-100 group cursor-pointer relative"
                                    >
                                        <div className="absolute -left-2 top-0 w-1 h-full bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded-full border border-red-500/20 uppercase tracking-widest animate-pulse">{t('news.alert')}</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{newsItems[0].source.name}</span>
                                        </div>
                                        <h4 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight text-slate-900">{newsItems[0].title}</h4>
                                        <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed">{newsItems[0].description}</p>
                                    </div>
                                    
                                    {newsItems.slice(1, 4).map((news, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => window.open(news.url, '_blank')}
                                            className="group cursor-pointer flex justify-between items-center gap-4"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">{news.source.name}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                </div>
                                                <h4 className="font-bold text-slate-700 group-hover:text-primary transition-colors truncate">{news.title}</h4>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase shrink-0">Now</span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="py-12 text-center text-slate-400 italic text-sm">
                                    No recent news items found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-32 border-t border-slate-100 pt-12 text-center relative z-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('footer.copyright')}</p>
                    <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-slate-900 transition-colors">{t('footer.governance')}</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">{t('footer.ethics')}</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">{t('footer.sources')}</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">{t('footer.privacy')}</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LearnHub;
