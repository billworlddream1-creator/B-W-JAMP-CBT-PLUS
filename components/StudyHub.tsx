
import React, { useState } from 'react';
import { StudyMaterial, UserTier, ColorTheme, StudyModule } from '../types';

interface StudyHubProps {
  material: StudyMaterial;
  userTier: UserTier;
  theme: ColorTheme;
  onExit: () => void;
  onShowPricing: () => void;
}

const StudyHub: React.FC<StudyHubProps> = ({ material, userTier, theme, onExit, onShowPricing }) => {
  const [activeModule, setActiveModule] = useState<StudyModule>(material.modules[0]);

  const canAccess = (module: StudyModule) => {
    return !module.isPremium || userTier !== 'Free';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
      {/* Sidebar - Topic Navigation */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 sticky top-28">
          <div className="mb-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Curriculum Hub</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{material.subject}</h3>
          </div>

          <nav className="space-y-3">
            {material.modules.map((mod) => {
              const locked = !canAccess(mod);
              const active = activeModule.id === mod.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => !locked && setActiveModule(mod)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-left transition-all border-2
                    ${active ? `bg-slate-900 border-slate-900 text-white shadow-xl` : 
                      locked ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed opacity-60' : 
                      'bg-white border-slate-50 text-slate-600 hover:border-slate-200'}`}
                >
                  <span className="text-xs font-black uppercase tracking-tight">{mod.title}</span>
                  {locked && (
                    <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-12 pt-8 border-t border-slate-50">
            <button 
              onClick={onExit}
              className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Close Vault
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Reading Area */}
      <div className="flex-grow bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-10">
            <div className={`w-3 h-10 bg-${theme.primary} rounded-full`}></div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{activeModule.title}</h2>
          </div>

          <div className="prose prose-slate lg:prose-xl max-w-none">
            <p className="text-xl leading-relaxed text-slate-600 font-medium">
              {activeModule.content}
            </p>
            
            <div className="mt-12 p-10 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 italic font-bold text-slate-500">
              "Mastery of {material.subject} isn't about memorizing every detail, but understanding the underlying patterns JAMB tests every year. Focus on the 'why' more than the 'what'."
            </div>
            
            <div className="mt-12 space-y-8">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Key Takeaways</h4>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Principle Identification', 'Time-Saving Shortcuts', 'Common Exam Pitfalls', 'Advanced Logical Links'].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>

          {!canAccess(material.modules[2]) && (
             <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Advanced Modules Locked</h3>
                <p className="text-slate-400 font-bold mb-8 uppercase text-[10px] tracking-widest">Upgrade to Standard or Pro to unlock the full {material.subject} curriculum.</p>
                <button 
                  onClick={onShowPricing}
                  className={`bg-${theme.primary} text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all`}
                >
                  Unlock Mastery Mode
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyHub;
