
import React from 'react';
import { PLANS } from '../constants';
import { UserTier } from '../types';

interface PricingProps {
  currentTier: UserTier;
  onSelectPlan: (tier: UserTier) => void;
}

const Pricing: React.FC<PricingProps> = ({ currentTier, onSelectPlan }) => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Choose Your Success Plan</h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Upgrade your account to unlock all subjects, full exam simulations, and our advanced AI Tutor for detailed explanations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-8 bg-white rounded-3xl border-2 transition-all hover:shadow-2xl 
              ${currentTier === plan.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-100 shadow-lg'}`}
          >
            {currentTier === plan.id && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Current Plan
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                {plan.id !== 'Free' && <span className="text-slate-400 ml-1 text-sm">/ year</span>}
              </div>
            </div>

            <ul className="flex-grow space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan.id)}
              disabled={currentTier === plan.id}
              className={`w-full py-3 rounded-xl font-bold transition-all
                ${currentTier === plan.id 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : plan.id === 'Premium'
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}
            >
              {currentTier === plan.id ? 'Already Active' : `Upgrade to ${plan.id}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-indigo-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between border border-indigo-100">
        <div className="mb-6 md:mb-0">
          <h4 className="text-xl font-bold text-indigo-900 mb-1">Scholarship Program</h4>
          <p className="text-indigo-700 opacity-80 max-w-md">
            Are you a high-performing student in need of financial assistance? Apply for our master scholarship to get Premium access for free.
          </p>
        </div>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold border-2 border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default Pricing;
