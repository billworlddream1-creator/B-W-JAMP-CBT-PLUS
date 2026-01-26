
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  doc, 
  updateDoc,
  getDocs,
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { User, ActivityLog, PaymentLog, UserTier } from '../types';

interface AdminPortalProps {
  currentUser: User | null;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'payments' | 'users'>('overview');
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingPayment, setEditingPayment] = useState<PaymentLog | null>(null);
  const [loading, setLoading] = useState(true);

  // Stats derived from real data
  const revenue = payments
    .filter(p => p.status === 'Successful')
    .reduce((acc, p) => acc + p.amount, 0);

  useEffect(() => {
    // 1. Listen for activities
    const qAct = query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(50));
    const unsubAct = onSnapshot(qAct, (snap) => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })) as ActivityLog[]);
    });

    // 2. Listen for payments
    const qPay = query(collection(db, "payments"), orderBy("timestamp", "desc"));
    const unsubPay = onSnapshot(qPay, (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })) as PaymentLog[]);
    });

    // 3. Listen for users
    const qUser = query(collection(db, "users"), limit(100));
    const unsubUser = onSnapshot(qUser, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })) as User[]);
      setLoading(false);
    });

    return () => {
      unsubAct();
      unsubPay();
      unsubUser();
    };
  }, []);

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    try {
      // 1. Update Payment Status
      await updateDoc(doc(db, "payments", editingPayment.id), {
        status: editingPayment.status,
        plan: editingPayment.plan
      });

      // 2. If status is successful, ensure user tier is also updated
      if (editingPayment.status === 'Successful') {
        await updateDoc(doc(db, "users", editingPayment.userId), {
          tier: editingPayment.plan
        });
      }

      setEditingPayment(null);
      alert("Payment record updated successfully.");
    } catch (err) {
      alert("Update failed. Check Firestore rules.");
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">BOOTING COMMAND CENTER...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-10 animate-fadeIn">
      {/* Admin Sidebar */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 sticky top-28">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">BW</div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">HQ Command</h4>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Auth: {currentUser?.name.split(' ')[0]}</span>
            </div>
          </div>
          
          <nav className="space-y-3">
            {[
              { id: 'overview', label: 'Dashboard', icon: '📊' },
              { id: 'activities', label: 'Telemetry', icon: '📝' },
              { id: 'payments', label: 'Treasury', icon: '💰' },
              { id: 'users', label: 'Personnel', icon: '👥' },
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
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-grow space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Platform Intel</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">B&W Enterprise &bull; Master Node</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: 'Real-time Revenue', value: `₦${revenue.toLocaleString()}`, icon: '💎', color: 'text-indigo-600' },
              { label: 'Total Scholars', value: users.length, icon: '🎓', color: 'text-slate-900' },
              { label: 'Live Activities', value: activities.length, icon: '⚡', color: 'text-amber-600' },
              { label: 'Conversion Rate', value: `${Math.round((payments.filter(p=>p.status==='Successful').length / users.length) * 100 || 0)}%`, icon: '📈', color: 'text-emerald-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl group">
                <div className="text-3xl mb-6">{stat.icon}</div>
                <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Transmission Logs</h3>
               <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2"></div> Live Stream
               </div>
            </div>
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="p-10 hover:bg-slate-50 transition-all flex items-center group">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mr-6 text-xl text-white">📡</div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-black text-slate-900">{activity.userEmail}</span>
                      <span className="text-[9px] text-slate-300 font-black uppercase">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      <span className="text-slate-900 mr-2">[{activity.action}]</span> {activity.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Financial Ledger</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-6">Reference</th>
                    <th className="px-10 py-6">Student</th>
                    <th className="px-10 py-6">Plan</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6 text-[10px] font-black text-slate-400">{payment.transactionRef}</td>
                      <td className="px-10 py-6">
                        <div className="text-xs font-black text-slate-900">{payment.userEmail}</div>
                        <div className="text-[8px] text-slate-400 uppercase">{payment.date.split('T')[0]}</div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase text-white 
                          ${payment.plan === 'Premium' ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                          {payment.plan}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase 
                          ${payment.status === 'Successful' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <button 
                          onClick={() => setEditingPayment(payment)}
                          className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest underline"
                        >
                          Edit Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Edit Modal */}
        {editingPayment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl animate-bubble p-10">
              <h3 className="text-xl font-black uppercase mb-6">Modify Transaction</h3>
              <form onSubmit={handleUpdatePayment} className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Status</label>
                  <select 
                    value={editingPayment.status}
                    onChange={(e) => setEditingPayment({...editingPayment, status: e.target.value as any})}
                    className="w-full bg-slate-50 p-4 rounded-xl text-xs font-black uppercase border-none focus:ring-2 ring-indigo-500"
                  >
                    <option value="Successful">Successful</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Subscription Tier</label>
                  <select 
                    value={editingPayment.plan}
                    onChange={(e) => setEditingPayment({...editingPayment, plan: e.target.value as any})}
                    className="w-full bg-slate-50 p-4 rounded-xl text-xs font-black uppercase border-none focus:ring-2 ring-indigo-500"
                  >
                    <option value="Free">Free</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Commit Changes</button>
                  <button type="button" onClick={() => setEditingPayment(null)} className="flex-grow bg-slate-100 py-4 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
