import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Globe, ArrowRight } from 'lucide-react';

const LanguageModal = () => {
    const { showLanguageModal, changeLanguage } = useContext(LanguageContext);

    if (!showLanguageModal) return null;

    const languages = [
        { 
            code: 'te', 
            name: 'Telugu', 
            native: 'తెలుగు', 
            desc: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రైతులకు.', 
            color: 'from-orange-500 to-red-600' 
        },
        { 
            code: 'hi', 
            name: 'Hindi', 
            native: 'हिन्दी', 
            desc: 'मुख्य रूप से उत्तर भारत के किसानों के लिए।', 
            color: 'from-green-500 to-emerald-700' 
        },
        { 
            code: 'en', 
            name: 'English', 
            native: 'English', 
            desc: 'For global standards and technical accuracy.', 
            color: 'from-blue-500 to-indigo-700' 
        }
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
            {/* Backdrop with animated gradient */}
            <div className="absolute inset-0 bg-[#0a0f0a] animate-in fade-in duration-700">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,#16a34a_0%,transparent_50%)] animate-pulse"></div>
            </div>

            <div className="relative w-full h-full flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side: Branding & Welcome */}
                    <div className="space-y-8 text-white text-center lg:text-left animate-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <Globe size={18} className="text-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Language Selection</span>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-tight">
                                Choose Your <br/>
                                <span className="text-green-500 italic">Preferred Voice.</span>
                            </h1>
                            <p className="text-lg text-white/50 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                                Experience Kissan Mithar in the language you speak. Our expert advisory and marketplace are now available in your native tongue.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 justify-center lg:justify-start">
                             <div className="flex -space-x-3">
                                 {[1,2,3].map(i => (
                                     <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0f0a] bg-slate-800 overflow-hidden">
                                         <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                     </div>
                                 ))}
                             </div>
                             <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Joined by 10k+ Farmers</p>
                        </div>
                    </div>

                    {/* Right Side: Language Options */}
                    <div className="grid gap-6 animate-in slide-in-from-bottom duration-700 delay-300">
                        {languages.map((lang, idx) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className="group relative overflow-hidden p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all text-left text-white border-b-4 hover:border-b-green-500"
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-black">{lang.native}</span>
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${lang.color} shadow-lg shadow-green-900/40 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                        </div>
                                        <p className="text-white/40 text-sm font-medium">{lang.name} — {lang.desc}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-green-600 group-hover:scale-110 transition-all">
                                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                
                                {/* Hover background effect */}
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            <style jsx="true">{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default LanguageModal;
