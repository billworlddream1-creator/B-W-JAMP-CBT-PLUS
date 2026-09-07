
import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import Layout from './components/Layout';
import QuizEngine from './components/QuizEngine';
import Pricing from './components/Pricing';
import AdminPortal from './components/AdminPortal';
import HallOfFame from './components/HallOfFame';
import StudyHub from './components/StudyHub';
import LiveAnalytics from './components/LiveAnalytics';
import ProgressTracker from './components/ProgressTracker';
import Auth from './components/Auth';
import { Subject, Question, UserTier, ColorTheme, StudentTestimonial, StudyMaterial, LiveStats, SessionHistory, User, AppView } from './types';
import { SUBJECTS, MOCK_QUESTIONS, THEMES, APP_NAME, MOCK_TESTIMONIALS, SALUTATIONS, MOCK_STUDY_MATERIALS, GET_MOCK_LIVE_STATS } from './constants';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<AppView>('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Use of English');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0, timeSpent: 0 });
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(THEMES[0]);
  const [visibleTestimonials, setVisibleTestimonials] = useState<StudentTestimonial[]>([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [salutation, setSalutation] = useState("");
  const [liveStats, setLiveStats] = useState<LiveStats>(GET_MOCK_LIVE_STATS());
  const [history, setHistory] = useState<SessionHistory[]>([]);

  const userTier = user?.tier || 'Free';
  const isAdmin = user?.role === 'admin';

  // Global Activity Logger
  const logActivity = useCallback(async (action: string, details: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "activities"), {
        userId: user.id,
        userEmail: user.email,
        action,
        details,
        timestamp: Date.now()
      });
    } catch (e) {
      console.warn("Telemetry failure:", e);
    }
  }, [user]);

  // Auth & Profile Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
          } else {
            const fallbackUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Scholar',
              email: firebaseUser.email || '',
              tier: 'Free',
              role: 'student',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
            };
            setUser(fallbackUser);
          }
          setView(currentView => currentView === 'AUTH' ? 'HOME' : currentView);
        } catch (err: any) {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Scholar',
            email: firebaseUser.email || '',
            tier: 'Free',
            role: 'student',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
          });
          setView(currentView => currentView === 'AUTH' ? 'HOME' : currentView);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // History Real-time Listener
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const q = query(
      collection(db, "users", user.id, "history"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SessionHistory[];
      setHistory(historyData);
    });

    return () => unsubscribe();
  }, [user]);

  const shuffleTestimonials = useCallback(() => {
    const shuffled = [...MOCK_TESTIMONIALS].sort(() => 0.5 - Math.random());
    setVisibleTestimonials(shuffled.slice(0, 12));
  }, []);

  useEffect(() => {
    shuffleTestimonials();
    setSalutation(SALUTATIONS[Math.floor(Math.random() * SALUTATIONS.length)]);

    const themeInterval = setInterval(() => {
      setCurrentTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
    }, 300000); 

    const statsInterval = setInterval(() => {
      setLiveStats(GET_MOCK_LIVE_STATS());
    }, 60000);

    return () => {
      clearInterval(themeInterval);
      clearInterval(statsInterval);
    };
  }, [shuffleTestimonials]);

  const startPractice = (subject: Subject) => {
    let subjectQuestions = MOCK_QUESTIONS.filter(q => q.subject === subject);
    if (subjectQuestions.length === 0) {
      subjectQuestions = MOCK_QUESTIONS.map((q, i) => ({ ...q, id: `gen-${i}-${subject}`, subject }));
    }

    let limitQuestions = userTier === 'Premium' ? 40 : userTier === 'Basic' ? 15 : 4;
    setSelectedSubject(subject);
    setQuestions(subjectQuestions.slice(0, limitQuestions));
    setView('QUIZ');
    logActivity("Practice Started", `Subject: ${subject}`);
  };

  const startStudy = (subject: Subject) => {
    setSelectedSubject(subject);
    setView('STUDY');
    logActivity("Study Started", `Subject: ${subject}`);
  };

  const handleFinish = async (score: number, total: number, timeSpent: number) => {
    setFinalScore({ score, total, timeSpent });
    setView('RESULT');
    logActivity("Practice Finished", `Score: ${score}/${total}`);

    if (user) {
      const sessionData = {
        subject: selectedSubject,
        score,
        total,
        timestamp: Date.now(),
        timeSpentSeconds: timeSpent
      };
      try {
        await addDoc(collection(db, "users", user.id, "history"), sessionData);
      } catch (err: any) {
        console.error("Error saving history:", err);
      }
    }
  };

  const handleSelectPlan = async (tier: UserTier) => {
    if (!user) {
      setView('AUTH');
      return;
    }
    
    try {
      // Record Stripe-style payment intent in Firestore
      const paymentRef = await addDoc(collection(db, "payments"), {
        userId: user.id,
        userEmail: user.email,
        plan: tier,
        amount: tier === 'Premium' ? 5000 : 2500,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        status: 'Successful', 
        transactionRef: `BW-${Math.random().toString(36).substring(7).toUpperCase()}`
      });

      await updateDoc(doc(db, "users", user.id), { tier });
      setUser({ ...user, tier });
      setView('HOME');
      logActivity("Subscription Upgrade", `Plan: ${tier}`);
    } catch (err: any) {
      alert("Billing connection failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setView('HOME');
  };

  const activeStudyMaterial = MOCK_STUDY_MATERIALS.find(m => m.subject === selectedSubject)!;

  if (showSplash || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 opacity-80"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="w-36 h-36 md:w-44 md:h-44 bg-white/10 backdrop-blur-md p-4 rounded-[2.5rem] shadow-[0_0_60px_rgba(99,102,241,0.25)] border border-white/20 mb-8 animate-bubble flex items-center justify-center">
            <img src="/logo.png" alt="App Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">{APP_NAME}</h1>
          <p className="text-xs font-bold text-indigo-300/80 uppercase tracking-widest mb-8">Official JAMB CBT Prep Platform</p>

          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin mb-6"></div>

          <button
            onClick={() => setShowSplash(false)}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Launch Application &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      theme={currentTheme}
      onNavigateHome={() => setView('HOME')} 
      onNavigatePricing={() => setView('PRICING')}
      onNavigateAdmin={() => isAdmin ? setView('ADMIN') : alert("Restricted: Admin Identity Required")}
      onNavigateProgress={() => setView('PROGRESS')}
      onNavigateAuth={() => setView('AUTH')}
      onLogout={handleLogout}
    >
      {view === 'HOME' && (
        <div className="animate-fadeIn space-y-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 inline-block animate-bounceIn">
              <span className={`px-6 py-2 rounded-full bg-${currentTheme.primary} text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl transition-colors duration-[2000ms]`}>
                {salutation}
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none uppercase">
              Secure Your <span className={`text-${currentTheme.primary} transition-colors duration-[2000ms]`}>Future.</span>
            </h2>
            <p className="text-slate-500 text-lg lg:text-xl font-bold max-w-3xl mx-auto uppercase tracking-wide leading-relaxed">
              Experience the highest fidelity JAMB simulation on the planet. {APP_NAME} is your partner in excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Exam Mode', desc: 'Simulate Real Test', icon: '⚡', color: 'indigo', onClick: () => startPractice('Use of English') },
              { label: 'Study Vault', desc: 'Read Curriculum', icon: '📖', color: 'emerald', onClick: () => startStudy('Mathematics') },
              { label: 'My Progress', desc: 'View Analytics', icon: '📈', color: 'amber', onClick: () => setView('PROGRESS') },
              { label: 'Hall of Fame', desc: 'Top Scorers', icon: '🏆', color: 'rose', onClick: () => document.getElementById('hof')?.scrollIntoView({ behavior: 'smooth' }) },
            ].map((nav, i) => (
              <button 
                key={i}
                onClick={nav.onClick}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group text-left relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-16 h-16 bg-${nav.color}-500/5 rounded-bl-full group-hover:scale-110 transition-transform`}></div>
                <div className="text-3xl mb-4">{nav.icon}</div>
                <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{nav.label}</div>
                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">{nav.desc}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {SUBJECTS.map((subject) => (
                <div 
                  key={subject}
                  className={`group bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 transition-all relative overflow-hidden shadow-2xl hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:-translate-y-2`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${currentTheme.primary}/5 rounded-bl-full group-hover:scale-125 transition-transform duration-[2000ms]`}></div>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">{subject}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => startPractice(subject)} className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Practice</button>
                    <button onClick={() => startStudy(subject)} className="flex-grow bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Study</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <LiveAnalytics stats={liveStats} theme={currentTheme} />
            </div>
          </div>

          <div id="hof">
            <HallOfFame students={visibleTestimonials} theme={currentTheme} userTier={userTier} onShuffle={shuffleTestimonials} shufflesRemaining={3} />
          </div>
        </div>
      )}

      {view === 'AUTH' && <Auth onLoginSuccess={(u) => setUser(u)} onClose={() => setView('HOME')} />}
      {view === 'PRICING' && <Pricing user={user} currentTier={userTier} onSelectPlan={handleSelectPlan} />}
      {view === 'ADMIN' && <AdminPortal currentUser={user} />}
      {view === 'PROGRESS' && <ProgressTracker history={history} theme={currentTheme} user={user} />}
      {view === 'QUIZ' && <QuizEngine questions={questions} subject={selectedSubject} userTier={userTier} onFinish={handleFinish} onShowPricing={() => setView('PRICING')} />}
      {view === 'STUDY' && <StudyHub material={activeStudyMaterial} userTier={userTier} theme={currentTheme} onExit={() => setView('HOME')} onShowPricing={() => setView('PRICING')} />}

      {view === 'RESULT' && (
        <div className="max-w-4xl mx-auto bg-white p-12 lg:p-16 rounded-[4rem] shadow-2xl border border-slate-100 text-center animate-bounceIn">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Mission Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner text-center">
               <span className="block text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Raw Performance</span>
               <span className="text-5xl lg:text-6xl font-black text-slate-900">{finalScore.score} <span className="text-xl lg:text-2xl text-slate-300">/ {finalScore.total}</span></span>
            </div>
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner text-center">
               <span className="block text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Efficiency Rating</span>
               <span className="text-5xl lg:text-6xl font-black text-slate-900">{Math.round((finalScore.score / finalScore.total) * 100)}%</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            <button onClick={() => setView('HOME')} className="flex-grow bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-lg lg:text-xl uppercase tracking-widest hover:bg-black transition-all">Back Home</button>
            <button onClick={() => startPractice(selectedSubject)} className="flex-grow bg-white border-4 border-slate-100 text-slate-900 py-6 rounded-[2.5rem] font-black text-lg lg:text-xl uppercase tracking-widest transition-all">Relaunch</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
