
import React, { useState, useEffect } from 'react';
import { LiveStats, ColorTheme } from '../types';

interface LiveAnalyticsProps {
  stats: LiveStats;
  theme: ColorTheme;
}

const LiveAnalytics: React.FC<LiveAnalyticsProps> = ({ stats, theme }) => {
  const [insight, setInsight] = useState("Global Intel: A 300+ JAMB score is comparable to a 1350+ SAT score in terms of difficulty.");

  useEffect(() => {
    const insights = [
      "Global Intel: A 300+ JAMB score is comparable to a 1350+ SAT score in terms of academic rigor.",
      "SA Benchmark: JAMB Mathematics covers 90% of the same syllabus as the South African Matric (NSC) Maths.",
      "Euro Standard: Top Biology scorers here match the knowledge base of UK A-Level A* candidates.",
      "US Comparison: The speed required for JAMB Use of English is 15% faster than the standard ACT English section.",
      "Matric Pulse: 1,200 South African-based students are also using B&W CBT to prep for local benchmarks.",
      "Logic Check: European Baccalaureate students often struggle with the logic puzzles found in JAMB English."
    ];
    
    const interval = setInterval(() => {
      setInsight(insights[Math.floor(Math.random() * insights.length)]);
    }, 12000); // Rotate every 12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Platform Pulse</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Real-time Global Telemetry</p>
        </div>
        <div className="flex items-center space-x-3 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-[9px] font-black uppercase tracking-widest">System Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Active Scholars</span>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{stats.activeUsers.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Trending Subject</span>
          <div className={`text-2xl font-black text-${theme.primary} transition-colors duration-[2000ms] truncate uppercase`}>{stats.trendingSubject}</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 md:col-span-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Questions Solved Today</span>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{stats.totalQuestionsSolved.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex-grow">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 border-b border-slate-50 pb-4">Recent High Scorers</h4>
        <div className="space-y-4">
          {stats.recentScores.map((score, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl group hover:border-slate-200 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  {score.name[0]}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{score.name}</div>
                  <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{score.subject} Mastery</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">{score.score}</div>
                <div className="text-[8px] text-emerald-500 font-black uppercase">Verified</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-center min-h-[100px] flex items-center justify-center border-t-4 border-amber-400/20">
        <div className="space-y-2">
          <div className="text-[8px] font-black text-amber-400 uppercase tracking-[0.4em]">Global Intelligence Report</div>
          <p className="text-[10px] font-bold text-white leading-relaxed tracking-wide uppercase">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveAnalytics;
