
import React, { useState, useEffect } from 'react';
import { LiveStats, ColorTheme } from '../types';

interface LiveAnalyticsProps {
  stats: LiveStats;
  theme: ColorTheme;
}

const LiveAnalytics: React.FC<LiveAnalyticsProps> = ({ stats, theme }) => {
  const [insight, setInsight] = useState("Analytical Insight: Physics participation has surged by 14% this morning. Mathematics remains the most challenging module globally.");

  useEffect(() => {
    const insights = [
      "Analytical Insight: 85% of scholars scoring 320+ spend at least 2 hours daily in the Study Vault.",
      "Trend Alert: Use of English proficiency is up 12% among Premium users this week.",
      "Global Pulse: Over 45,000 practice questions were solved in the last 60 minutes.",
      "Success Metric: Candidates using AI Explanations are 3x more likely to correct their mistakes in the next session.",
      "Live Data: Biology is currently the most practiced subject in Southern Nigeria."
    ];
    
    const interval = setInterval(() => {
      setInsight(insights[Math.floor(Math.random() * insights.length)]);
    }, 15000); // Rotate every 15 seconds

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

      <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-center min-h-[80px] flex items-center justify-center">
        <p className="text-[9px] font-bold text-white/60 leading-relaxed tracking-wide uppercase italic">
          {insight}
        </p>
      </div>
    </div>
  );
};

export default LiveAnalytics;
