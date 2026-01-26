
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { SessionHistory, Subject, ColorTheme, PaymentLog, User } from '../types';
import { SUBJECTS } from '../constants';

interface ProgressTrackerProps {
  history: SessionHistory[];
  theme: ColorTheme;
  user: User | null;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ history, theme, user }) => {
  const [userPayments, setUserPayments] = useState<PaymentLog[]>([]);
  const [activeTab, setActiveTab] = useState<'performance' | 'billing'>('performance');

  const totalQuestions = history.reduce((acc, h) => acc + h.total, 0);
  const totalCorrect = history.reduce((acc, h) => acc + h.score, 0);
  const avgAccuracy = history.length > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const totalTime = history.reduce((acc, h) => acc + h.timeSpentSeconds, 0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "payments"),
      where("userId", "==", user.id),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentLog[];
      setUserPayments(payments);
    });

    return () => unsubscribe();
  }, [user]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const subjectPerformance = SUBJECTS.map(sub => {
    const subHistory = history.filter(h => h.subject === sub);
    const subTotal = subHistory.reduce((acc, h) => acc + h.total, 0);
    const subCorrect = subHistory.reduce((acc, h) => acc + h.score, 0);
    return {
      subject: sub,
      accuracy: subTotal > 0 ? (subCorrect / subTotal) * 100 : 0,
      totalSessions: subHistory.length
    };
  }).filter(s => s.totalSessions > 0);

  const lastSevenSessions = history.slice(-7);
  const chartHeight = 120;
  const chartWidth = 600;
  const points = lastSevenSessions.map((s, i) => ({
    x: (i / (lastSevenSessions.length - 1 || 1)) * chartWidth,
    y: chartHeight - (s.score / s.total) * chartHeight
  }));

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="animate-fadeIn space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Student Intelligence</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Personnel ID: {user?.id.substring(0, 8)} &bull; B&W HQ</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-xl border border-slate-100">
          <button 
            onClick={() => setActiveTab('performance')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Performance
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Billing & Access
          </button>
        </div>
      </div>

      {activeTab === 'performance' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Total Questions', val: totalQuestions.toLocaleString(), icon: '📚', color: 'indigo' },
              { label: 'Avg. Accuracy', val: `${Math.round(avgAccuracy)}%`, icon: '🎯', color: 'emerald' },
              { label: 'Study Volume', val: formatTime(totalTime), icon: '⏱️', color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-bl-full group-hover:scale-125 transition-transform`}></div>
                <div className="text-4xl mb-6">{stat.icon}</div>
                <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.val}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10 flex justify-between items-center">
                 Score Trajectory
                 <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full tracking-widest uppercase">Last 7 Sessions</span>
               </h3>
               
               {history.length > 1 ? (
                 <div className="w-full h-[200px] flex items-end justify-center">
                   <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible drop-shadow-lg">
                     <polyline
                       fill="none"
                       stroke={`var(--tw-stroke-opacity, currentColor)`}
                       className={`text-${theme.primary} transition-colors duration-[2000ms]`}
                       strokeWidth="8"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       points={polylinePoints}
                     />
                     {points.map((p, i) => (
                       <circle key={i} cx={p.x} cy={p.y} r="8" className={`fill-white stroke-${theme.primary} transition-colors duration-[2000ms]`} strokeWidth="4" />
                     ))}
                   </svg>
                 </div>
               ) : (
                 <div className="h-[200px] flex items-center justify-center text-slate-300 font-black uppercase text-xs tracking-widest text-center px-10">
                   Practice more sessions to visualize your trajectory.
                 </div>
               )}
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10">Subject Command</h3>
               <div className="space-y-8">
                 {subjectPerformance.length > 0 ? subjectPerformance.map((s, i) => (
                   <div key={i}>
                     <div className="flex justify-between items-end mb-3">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{s.subject}</span>
                        <span className="text-xs font-black text-slate-900">{Math.round(s.accuracy)}%</span>
                     </div>
                     <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-slate-900 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.accuracy}%` }}></div>
                     </div>
                   </div>
                 )) : (
                   <div className="text-center py-10 text-slate-300 font-black uppercase text-xs">No subject data yet.</div>
                 )}
               </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-10 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Current Status</span>
               <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">{user?.tier} Member</h3>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                 Your account is currently {user?.tier === 'Free' ? 'limited to trial questions.' : 'fully unlocked for all exam modules.'}
               </p>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Invested</span>
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                 ₦{userPayments.filter(p => p.status === 'Successful').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
               </h3>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Verified through Stripe Terminal</p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Billing reflection</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-600 text-[9px] font-black uppercase tracking-widest">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0z"/></svg>
                 Stripe Linked
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-6">Date</th>
                    <th className="px-10 py-6">Reference</th>
                    <th className="px-10 py-6">Tier</th>
                    <th className="px-10 py-6">Amount</th>
                    <th className="px-10 py-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {userPayments.length > 0 ? userPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6 text-[10px] font-black text-slate-900 uppercase">{p.date.split('T')[0]}</td>
                      <td className="px-10 py-6 text-[10px] font-black text-slate-400 font-mono uppercase">{p.transactionRef}</td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase">{p.plan}</span>
                      </td>
                      <td className="px-10 py-6 text-[10px] font-black text-slate-900">₦{p.amount.toLocaleString()}</td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'Successful' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-10 py-12 text-center text-slate-300 font-black uppercase text-xs tracking-widest">
                        No transactions reflect on this account yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
