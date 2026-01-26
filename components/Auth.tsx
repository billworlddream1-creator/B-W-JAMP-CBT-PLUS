
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, onClose }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .trim()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleModeChange = (newMode: 'LOGIN' | 'SIGNUP' | 'FORGOT') => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const email = formData.email.trim();
    const password = formData.password.trim();
    const name = formData.name.trim();

    // Client-side basic validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (mode !== 'FORGOT' && password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    
    try {
      if (mode === 'FORGOT') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("Reset link sent! Check your inbox.");
        setLoading(false);
        return;
      }

      // Configure persistence based on "Remember Me"
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      if (mode === 'SIGNUP') {
        if (!name) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        await updateProfile(firebaseUser, { displayName: name });
        
        const userProfile: User = {
          id: firebaseUser.uid,
          name: name,
          email: email,
          tier: 'Free',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
        };
        
        try {
          await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
        } catch (fsErr: any) {
          console.warn("Firestore write failed during signup:", fsErr);
        }
        onLoginSuccess(userProfile);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Fetch profile to ensure UI updates with the right data
        let finalProfile: User;
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            finalProfile = userDoc.data() as User;
          } else {
            // Document missing, use fallback
            finalProfile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Scholar',
              email: firebaseUser.email || '',
              tier: 'Free',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
            };
          }
        } catch (err) {
          finalProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Scholar',
            email: firebaseUser.email || '',
            tier: 'Free',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
          };
        }
        onLoginSuccess(finalProfile);
      }
    } catch (err: any) {
      console.error("Auth Exception:", err.code, err.message);
      let message = "An error occurred. Please try again.";
      
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
          message = "Wrong email or password. Please double-check your credentials and try again.";
          break;
        case 'auth/invalid-email':
          message = "This email address is not properly formatted. Please check for typos.";
          break;
        case 'auth/user-not-found':
          message = "No account exists with this email address.";
          break;
        case 'auth/wrong-password':
          message = "The password you entered is incorrect.";
          break;
        case 'auth/email-already-in-use':
          message = "This email is already registered. You should Sign In instead.";
          break;
        case 'auth/weak-password':
          message = "The password is too weak. Please use at least 6 characters.";
          break;
        case 'auth/too-many-requests':
          message = "Access temporarily disabled due to many failed attempts. Try again in a few minutes.";
          break;
        case 'auth/network-request-failed':
          message = "Network error. Please check your internet connection.";
          break;
        default:
          message = err.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.12)] border border-slate-100 animate-bubble">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
          {mode === 'LOGIN' ? 'Welcome Back' : mode === 'SIGNUP' ? 'Create Account' : 'Reset Access'}
        </h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
          {mode === 'FORGOT' ? 'Recover your elite status' : 'Join the Elite Scholar Network'}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center mb-6 animate-shake">
          {error}
          {error.includes("already registered") && (
            <button 
              type="button" 
              onClick={() => handleModeChange('LOGIN')}
              className="block w-full mt-2 text-indigo-600 underline font-black"
            >
              Switch to Sign In
            </button>
          )}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center mb-6">
          {successMsg}
        </div>
      )}

      {mode !== 'FORGOT' && (
        <div className="flex bg-slate-50 p-2 rounded-2xl mb-8">
          <button 
            onClick={() => handleModeChange('LOGIN')}
            className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${mode === 'LOGIN' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => handleModeChange('SIGNUP')}
            className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${mode === 'SIGNUP' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}
          >
            Register
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'SIGNUP' && (
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Chidi Okonkwo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white p-5 rounded-2xl outline-none transition-all text-xs font-bold"
            />
          </div>
        )}
        <div>
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Email Address</label>
          <input 
            type="email" 
            required
            placeholder="scholar@jamb.ng"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white p-5 rounded-2xl outline-none transition-all text-xs font-bold"
          />
        </div>

        {mode !== 'FORGOT' && (
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white p-5 pr-14 rounded-2xl outline-none transition-all text-xs font-bold"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-2"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
        )}

        {mode === 'LOGIN' && (
          <div className="flex items-center justify-between px-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}>
                {rememberMe && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={rememberMe} 
                onChange={() => setRememberMe(!rememberMe)} 
              />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remember Me</span>
            </label>
            <button 
              type="button"
              onClick={() => handleModeChange('FORGOT')}
              className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            mode === 'LOGIN' ? 'Access Portal' : mode === 'SIGNUP' ? 'Launch Journey' : 'Reset My Password'
          )}
        </button>

        {mode === 'FORGOT' && (
          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => handleModeChange('LOGIN')}
              className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={onClose}
          className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default Auth;
