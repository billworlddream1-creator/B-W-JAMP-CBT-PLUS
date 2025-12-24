
import React, { useState, useEffect } from 'react';
import { UserTier, ColorTheme } from '../types';
import { UPGRADE_MESSAGES, APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  userTier: UserTier;
  theme: ColorTheme;
  onNavigateHome: () => void;
  onNavigatePricing: () => void;
  onNavigateAdmin: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userTier, theme, onNavigateHome, onNavigatePricing, onNavigateAdmin }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % UPGRADE_MESSAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const tierColor = {
    Free: 'bg-slate-400',
    Basic: 'bg-indigo-600',
    Premium: 'bg-amber-500'
  }[userTier];

  return (
    <div className={`min-h-screen flex flex-col bg-${theme.bg} transition-colors duration-[2000ms]`}>
      {/* Top Header Randomized Upgrade Bar */}
      {userTier === 'Free' && (
        <div className={`bg-${theme.primary} text-white py-1.5 px-4 text-[11px] font-black text-center overflow-hidden h-7 flex items-center justify-center transition-colors duration-[2000ms]`}>
          <div className="animate-pulse tracking-wide uppercase">
            {UPGRADE_MESSAGES[msgIndex]}
          </div>
        </div>
      )}

      <header className={`bg-${theme.primary} text-white py-4 px-6 shadow-xl flex justify-between items-center sticky top-0 z-50 transition-colors duration-[2000ms]`}>
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onNavigateHome}
        >
          <div className={`bg-white p-1.5 rounded-xl transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg`}>
            <svg className={`w-6 h-6 text-${theme.primary} transition-colors duration-[2000ms]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase">{APP_NAME}</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6">
          <nav className="hidden lg:flex items-center space-x-1">
            <button onClick={onNavigateHome} className="px-4 py-2 hover:bg-white/10 rounded-xl font-extrabold transition-all text-xs uppercase tracking-widest">Practice Hub</button>
            <button onClick={onNavigatePricing} className="px-4 py-2 hover:bg-white/10 rounded-xl font-extrabold transition-all text-xs uppercase tracking-widest">Subscription</button>
            <button onClick={onNavigateAdmin} className="px-4 py-2 hover:bg-white/10 rounded-xl font-extrabold transition-all text-xs uppercase tracking-widest flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Admin
            </button>
          </nav>
          
          <div className="flex items-center space-x-3 border-l border-white/20 pl-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] opacity-60 font-black uppercase tracking-[0.2em] leading-none mb-1">Status</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${userTier === 'Premium' ? 'text-amber-400' : 'text-white'}`}>
                {userTier} Access
              </span>
            </div>
            <div className={`w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-sm hover:bg-white/30 transition-all cursor-pointer`}>
              {userTier[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10 max-w-6xl relative">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-500 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 mb-3 justify-center md:justify-start">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-white font-black tracking-tighter text-lg uppercase">{APP_NAME}</span>
            </div>
            <p className="text-xs font-medium max-w-xs leading-relaxed">The premier choice for serious JAMB candidates seeking academic excellence and high-fidelity testing.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">Practice</button>
            <button onClick={onNavigatePricing} className="hover:text-white transition-colors">Pricing</button>
            <button className="hover:text-white transition-colors">Support</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Privacy</button>
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            &copy; {new Date().getFullYear()} B&W CBT GROUP
          </p>
        </div>
      </footer>

      {/* WhatsApp Button - Bottom Right */}
      <a 
        href="https://wa.me/2347000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] hover:bg-[#128C7E] text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(37,211,102,0.3)] transition-all hover:scale-110 active:scale-95 group flex items-center"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="ml-3 font-black text-xs uppercase tracking-widest hidden md:inline">Contact Support</span>
      </a>
    </div>
  );
};

export default Layout;
