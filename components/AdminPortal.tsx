
import React, { useState } from 'react';
import { MOCK_ACTIVITIES, MOCK_PAYMENTS, APP_NAME } from '../constants';

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'payments'>('overview');

  const stats = [
    { label: 'Platform Revenue', value: '₦1.42M', icon: '💎', color: 'text-indigo-600', trend: '+12%' },
    { label: 'Total Enrolled', value: '4,520', icon: '🎓', color: 'text-slate-900', trend: '+8%' },
    { label: 'Active Sessions', value: '1,284', icon: '⚡', color: 'text-amber-600', trend: '+4.5%' },
    { label: 'Conversion Rate', value: '26%', icon: '📈', color: 'text-emerald-600', trend: '+1.2%' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-10 animate-fadeIn">
      {/* Admin Sidebar */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 sticky top-28">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">BW</div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">HQ Command</h4>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active System</span>
            </div>
          </div>
          
          <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6 px-4">Core Controls</h3>
          <nav className="space-y-3">
            {[
              { id: 'overview', label: 'Dashboard', icon: '📊' },
              { id: 'activities', label: 'Activity Feed', icon: '📝' },
              { id: 'payments', label: 'Treasury', icon: '💰' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all
                  ${activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span className="mr-4 text-xl opacity-70">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-16 pt-8 border-t border-slate-50">
             <div className="bg-slate-50 p-6 rounded-3xl">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Infrastructure</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[9px] font-black text-slate-500 mb-2">
                      <span>API LATENCY</span>
                      <span className="text-emerald-500">OPTIMAL</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 w-[95%] h-full"></div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-grow space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Platform Intel</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Master Dashboard &bull; {APP_NAME}</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">Export PDF</button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:scale-[1.03] transition-all">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-6">{stat.icon}</div>
                    <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                    <div className="flex items-end justify-between">
                      <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                      <span className="text-emerald-500 text-[10px] font-black bg-emerald-50 px-2.5 py-1 rounded-xl">{stat.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Usage Volatility</h3>
                  <div className="flex space-x-3">
                    <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2"></div> Premium
                    </span>
                    <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-200 mr-2"></div> Free
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-72 gap-6">
                  {[30, 50, 45, 90, 65, 80, 55].map((val, i) => (
                    <div key={i} className="flex-grow flex flex-col items-center group">
                      <div className="w-full bg-slate-50 rounded-3xl relative overflow-hidden h-full shadow-inner">
                        <div 
                          className="absolute bottom-0 w-full bg-slate-900/10 group-hover:bg-slate-900/20 transition-all rounded-3xl" 
                          style={{ height: `${val + 10}%` }}
                        ></div>
                        <div 
                          className="absolute bottom-0 w-full bg-slate-900 transition-all rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)]" 
                          style={{ height: `${val}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 mt-5 uppercase">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10">Subject Demand</h3>
                <div className="space-y-8 flex-grow">
                  {[
                    { sub: 'English', val: 92, col: 'bg-slate-900' },
                    { sub: 'Mathematics', val: 78, col: 'bg-indigo-600' },
                    { sub: 'Science', val: 45, col: 'bg-emerald-600' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-black text-slate-900 mb-3 uppercase tracking-widest">
                        <span>{s.sub}</span>
                        <span>{s.val}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-4 rounded-full overflow-hidden shadow-inner">
                        <div className={`${s.col} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${s.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white">
                  <p className="text-[10px] font-bold leading-relaxed tracking-wide opacity-80 uppercase">
                    Insight: Enrollment peak detected between 8PM and 10PM WAT. System scaling recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Transmission Logs</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Real-time engagement telemetry</p>
              </div>
              <div className="flex items-center space-x-3 bg-slate-900 text-white px-6 py-2.5 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Live Feed</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {MOCK_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="p-10 hover:bg-slate-50 transition-all flex items-center group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center mr-8 text-3xl text-white group-hover:scale-110 transition-transform shadow-xl">
                    {activity.action === 'Upgrade' ? '💎' : '📚'}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-black text-slate-900">{activity.userEmail}</span>
                      <span className="text-[10px] font-black text-slate-300 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest">{activity.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                      <span className="text-slate-900 mr-3">{activity.action}</span>
                      {activity.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-10 border-b border-slate-50">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Financial Ledger</h3>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Audit of successful plan acquisitions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-8">Ref ID</th>
                    <th className="px-10 py-8">Student</th>
                    <th className="px-10 py-8">Subscription</th>
                    <th className="px-10 py-8">Amount</th>
                    <th className="px-10 py-8">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_PAYMENTS.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-8 text-xs font-mono font-black text-slate-400">{payment.id}</td>
                      <td className="px-10 py-8">
                        <div className="text-sm font-black text-slate-900">{payment.userEmail}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{payment.date}</div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg
                          ${payment.plan === 'Premium' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                          {payment.plan}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-sm font-black text-slate-900">₦{payment.amount.toLocaleString()}</td>
                      <td className="px-10 py-8">
                        <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center
                          ${payment.status === 'Successful' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full mr-3 ${payment.status === 'Successful' ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
