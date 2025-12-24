
import React from 'react';
import { StudentTestimonial, ColorTheme, UserTier } from '../types';

interface HallOfFameProps {
  students: StudentTestimonial[];
  theme: ColorTheme;
  userTier: UserTier;
  onShuffle: () => void;
  shufflesRemaining: number;
}

const HallOfFame: React.FC<HallOfFameProps> = ({ students, theme, userTier, onShuffle, shufflesRemaining }) => {
  const isShuffleDisabled = userTier === 'Free' && shufflesRemaining <= 0;

  return (
    <section className="mt-32 animate-fadeIn relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">The Hall of Fame</h2>
          <div className={`w-24 h-2 bg-${theme.primary} mx-auto md:mx-0 mb-6 rounded-full transition-colors duration-[2000ms]`}></div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Top Performers &bull; Powered by B&W CBT PLUS</p>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <button 
            onClick={onShuffle}
            disabled={isShuffleDisabled}
            className={`flex items-center space-x-3 px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl
              ${isShuffleDisabled 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300' 
                : `bg-slate-900 text-white hover:scale-105 active:scale-95 shadow-${theme.primary}/20`}`}
          >
            <svg className={`w-5 h-5 ${isShuffleDisabled ? '' : 'animate-spin-slow'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Shuffle Success stories</span>
          </button>
          
          {userTier === 'Free' && (
            <span className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {shufflesRemaining > 0 ? `${shufflesRemaining} shuffles left` : 'Daily shuffle limit reached'} 
              <span className="mx-2">&bull;</span>
              <button className="text-indigo-600 hover:underline">Upgrade for Unlimited</button>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {students.map((student) => (
          <div 
            key={student.id} 
            className="group relative bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden"
          >
            {/* Institution Badge */}
            <div className={`absolute top-0 right-0 bg-${theme.primary} text-white text-[8px] font-black px-3 py-1 rounded-bl-xl transition-colors duration-[2000ms] z-10`}>
              {student.institution}
            </div>

            <div className="relative mb-4">
              <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-slate-50 transition-all group-hover:border-indigo-100">
                <img 
                  src={student.image} 
                  alt={student.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" 
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg border border-slate-100 flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-900">{student.score}</span>
                <span className="text-[8px] font-black text-slate-300 uppercase">UTME</span>
              </div>
            </div>

            <div className="text-center mt-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tighter truncate px-2">{student.name}</h4>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{student.year}</p>
            </div>

            {/* Hover Victory Shout */}
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center">
               <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-2">Success Story</span>
               <span className="text-amber-400 font-black text-lg">{student.score}</span>
               <div className="w-8 h-1 bg-white/20 my-2 rounded-full"></div>
               <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest">{student.institution} Bound</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-3 bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                <img src={`https://i.pravatar.cc/50?u=avat${i}`} alt="user" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Join 5,000+ Students Scoring 300+</span>
        </div>
      </div>
    </section>
  );
};

export default HallOfFame;
