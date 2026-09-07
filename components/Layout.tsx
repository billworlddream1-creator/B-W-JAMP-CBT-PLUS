
import React, { useState, useEffect } from 'react';
import { UserTier, ColorTheme, User } from '../types';
import { UPGRADE_MESSAGES, APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  theme: ColorTheme;
  onNavigateHome: () => void;
  onNavigatePricing: () => void;
  onNavigateAdmin: () => void;
  onNavigateProgress: () => void;
  onNavigateAuth: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  theme, 
  onNavigateHome, 
  onNavigatePricing, 
  onNavigateAdmin, 
  onNavigateProgress,
  onNavigateAuth,
  onLogout
}) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const userTier = user?.tier || 'Free';

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % UPGRADE_MESSAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', onClick: onNavigateHome },
    { label: 'Progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', onClick: onNavigateProgress },
    { label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', onClick: onNavigatePricing },
    { label: 'Admin', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', onClick: onNavigateAdmin }
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-${theme.bg} transition-colors duration-[2000ms] pb-24 lg:pb-0`}>
      {/* Top Header Randomized Upgrade Bar */}
      {userTier === 'Free' && (
        <div className={`bg-${theme.primary} text-white py-1.5 px-4 text-[11px] font-black text-center overflow-hidden h-7 flex items-center justify-center transition-colors duration-[2000ms] safe-area-top`}>
          <div className="animate-pulse tracking-wide uppercase">
            {UPGRADE_MESSAGES[msgIndex]}
          </div>
        </div>
      )}

      <header className={`bg-${theme.primary} text-white py-4 px-6 shadow-xl flex justify-between items-center sticky top-0 z-50 transition-colors duration-[2000ms] ${userTier !== 'Free' ? 'safe-area-top' : ''}`}>
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onNavigateHome}
        >
          <div className="bg-white p-1 rounded-xl transition-transform group-hover:scale-105 shadow-lg overflow-hidden flex items-center justify-center w-10 h-10">
            <img src="/logo.png" alt="JAMB Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase">{APP_NAME}</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6">
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button 
                key={item.label}
                onClick={item.onClick} 
                className="px-4 py-2 hover:bg-white/10 rounded-xl font-extrabold transition-all text-xs uppercase tracking-widest flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-3 border-l border-white/20 pl-4">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] opacity-60 font-black uppercase tracking-[0.2em] leading-none mb-1">{user.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${user.tier === 'Premium' ? 'text-amber-400' : 'text-white'}`}>
                    {user.tier} Access
                  </span>
                </div>
                <div 
                  onClick={onLogout}
                  title="Logout"
                  className={`w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-sm hover:bg-rose-500/40 hover:border-rose-400 transition-all cursor-pointer group`}
                >
                  {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-2xl object-cover" alt="" /> : user.name[0]}
                </div>
              </>
            ) : (
              <button 
                onClick={onNavigateAuth}
                className="px-6 py-2.5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar - Store Ready with Safe Area */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md lg:hidden z-[100] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl p-2 flex justify-around items-center mb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <button 
            key={item.label}
            onClick={item.onClick}
            className="flex flex-col items-center justify-center py-3 px-6 rounded-[2rem] hover:bg-slate-100 transition-all group"
          >
            <svg className={`w-6 h-6 text-slate-400 group-active:text-${theme.primary} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest text-slate-400 group-active:text-slate-900">{item.label}</span>
          </button>
        ))}
        <button 
          onClick={user ? onLogout : onNavigateAuth}
          className="flex flex-col items-center justify-center py-3 px-6 rounded-[2rem] hover:bg-slate-100 transition-all group"
        >
          <svg className={`w-6 h-6 ${user ? 'text-rose-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={user ? "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"} />
          </svg>
          <span className="text-[8px] font-black uppercase mt-1 tracking-widest text-slate-400">{user ? 'Logout' : 'Login'}</span>
        </button>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-10 max-w-6xl relative">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-500 py-12 px-6 mt-auto hidden lg:block">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-3 mb-3 justify-center md:justify-start">
               <img src="/logo.png" alt="JAMB Logo" className="w-8 h-8 object-contain bg-white rounded-lg p-0.5" />
               <span className="text-white font-black tracking-tighter text-lg uppercase">{APP_NAME}</span>
            </div>
            <p className="text-xs font-medium max-w-xs leading-relaxed">The premier choice for serious JAMB candidates seeking academic excellence and high-fidelity testing.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">Practice</button>
            <button onClick={onNavigateProgress} className="hover:text-white transition-colors">Progress</button>
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

      {/* WhatsApp Button - Bottom Right (Hidden on mobile as it's in the nav) */}
      <a 
        href="https://wa.me/2347000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] hover:bg-[#128C7E] text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(37,211,102,0.3)] transition-all hover:scale-110 active:scale-95 group hidden lg:flex items-center"
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
