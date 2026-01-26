
import React, { useState } from 'react';
import { PLANS } from '../constants';
import { UserTier, User } from '../types';

interface PricingProps {
  user: User | null;
  currentTier: UserTier;
  onSelectPlan: (tier: UserTier) => void;
}

const Pricing: React.FC<PricingProps> = ({ user, currentTier, onSelectPlan }) => {
  const [showStripe, setShowStripe] = useState<UserTier | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async (tier: UserTier) => {
    setProcessing(true);
    // Simulate Stripe Checkout delay
    setTimeout(() => {
      onSelectPlan(tier);
      setProcessing(false);
      setShowStripe(null);
    }, 2000);
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Choose Your Success Plan</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest max-w-xl mx-auto leading-relaxed">
          Upgrade via Stripe to unlock all subjects, full exam simulations, and our advanced AI Tutor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-10 bg-white rounded-[3rem] border-2 transition-all hover:shadow-2xl 
              ${currentTier === plan.id ? 'border-slate-900 ring-4 ring-slate-100 shadow-xl scale-[1.02]' : 'border-slate-100 shadow-lg'}`}
          >
            {currentTier === plan.id && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Active Mission
              </div>
            )}
            
            <div className="mb-10">
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                {plan.id !== 'Free' && <span className="text-slate-400 ml-2 text-[10px] font-black uppercase tracking-widest">/ session</span>}
              </div>
            </div>

            <ul className="flex-grow space-y-5 mb-12">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-slate-500">
                  <div className="bg-emerald-50 text-emerald-500 p-1 rounded-lg mr-3 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-tight leading-none">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => plan.id === 'Free' ? onSelectPlan('Free') : setShowStripe(plan.id)}
              disabled={currentTier === plan.id}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all
                ${currentTier === plan.id 
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed border-2 border-slate-100 shadow-none' 
                  : 'bg-slate-900 text-white hover:bg-black hover:scale-105 active:scale-95'}`}
            >
              {currentTier === plan.id ? 'Already Active' : `Initialize ${plan.id}`}
            </button>
          </div>
        ))}
      </div>

      {/* Stripe Payment Simulation Modal */}
      {showStripe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl animate-bubble">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                   <div className="bg-indigo-600 text-white p-2 rounded-xl">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.934-3.356-1.426-3.356-2.409 0-.831.763-1.444 1.961-1.444 1.014 0 1.903.355 2.37.556l.33.14V3.125A12.032 12.032 0 0012.593 2.8c-2.607 0-4.416 1.386-4.416 3.754 0 2.458 2.058 3.428 4.221 4.316 2.502 1.025 3.016 1.745 3.016 2.596 0 1.029-1.008 1.605-2.215 1.605-1.483 0-2.66-.549-3.224-.86l-.341-.189v2.857c.715.342 1.83.67 3.064.67 2.723 0 4.64-1.342 4.64-3.868 0-2.636-1.928-3.69-4.362-4.74zM12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0z"/></svg>
                   </div>
                   <h3 className="text-xl font-black uppercase tracking-tighter">Stripe Checkout</h3>
                </div>
                <button onClick={() => setShowStripe(null)} className="text-slate-400 hover:text-slate-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl mb-8">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>Summary</span>
                    <span>Plan: {showStripe}</span>
                 </div>
                 <div className="text-2xl font-black text-slate-900">
                    {PLANS.find(p => p.id === showStripe)?.price}
                 </div>
              </div>

              <div className="space-y-6 mb-10">
                 <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-2">Card Details</label>
                    <div className="bg-white border-2 border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                       <span className="text-xs font-bold text-slate-400">•••• •••• •••• 4242</span>
                       <div className="flex gap-2">
                          <div className="w-8 h-5 bg-slate-100 rounded-md"></div>
                          <div className="w-8 h-5 bg-slate-100 rounded-md"></div>
                       </div>
                    </div>
                 </div>
              </div>

              <button 
                disabled={processing}
                onClick={() => handleCheckout(showStripe)}
                className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {processing ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  `Authorize Payment`
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 opacity-30 grayscale">
                 <span className="text-[8px] font-black uppercase tracking-[0.3em]">Securely Powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
