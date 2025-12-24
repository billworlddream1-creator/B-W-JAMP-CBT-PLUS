
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import QuizEngine from './components/QuizEngine';
import Pricing from './components/Pricing';
import AdminPortal from './components/AdminPortal';
import HallOfFame from './components/HallOfFame';
import StudyHub from './components/StudyHub';
import LiveAnalytics from './components/LiveAnalytics';
import { Subject, Question, UserTier, ColorTheme, StudentTestimonial, StudyMaterial, LiveStats } from './types';
import { SUBJECTS, MOCK_QUESTIONS, THEMES, APP_NAME, MOCK_TESTIMONIALS, SALUTATIONS, MOCK_STUDY_MATERIALS, GET_MOCK_LIVE_STATS } from './constants';

type AppView = 'HOME' | 'QUIZ' | 'STUDY' | 'RESULT' | 'PRICING' | 'ADMIN';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('HOME');
  const [userTier, setUserTier] = useState<UserTier>('Free');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Use of English');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(THEMES[0]);
  const [visibleTestimonials, setVisibleTestimonials] = useState<StudentTestimonial[]>([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [salutation, setSalutation] = useState("");
  const [liveStats, setLiveStats] = useState<LiveStats>(GET_MOCK_LIVE_STATS());

  const shuffleTestimonials = useCallback(() => {
    const shuffled = [...MOCK_TESTIMONIALS].sort(() => 0.5 - Math.random());
    setVisibleTestimonials(shuffled.slice(0, 12));
  }, []);

  const handleManualShuffle = () => {
    if (userTier === 'Free' && shuffleCount >= 3) {
      alert("Daily shuffle limit reached for Free users! Upgrade for unlimited.");
      return;
    }
    if (userTier === 'Free') setShuffleCount(prev => prev + 1);
    shuffleTestimonials();
  };

  useEffect(() => {
    shuffleTestimonials();
    setSalutation(SALUTATIONS[Math.floor(Math.random() * SALUTATIONS.length)]);

    const themeInterval = setInterval(() => {
      setCurrentTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
    }, 300000); 

    const testimonialInterval = setInterval(shuffleTestimonials, 1800000); 

    const statsInterval = setInterval(() => {
      setLiveStats(GET_MOCK_LIVE_STATS());
    }, 60000);

    return () => {
      clearInterval(themeInterval);
      clearInterval(testimonialInterval);
      clearInterval(statsInterval);
    };
  }, [shuffleTestimonials]);

  const startPractice = (subject: Subject) => {
    let subjectQuestions = MOCK_QUESTIONS.filter(q => q.subject === subject);
    if (subjectQuestions.length === 0) {
      subjectQuestions = MOCK_QUESTIONS.map((q, i) => ({ ...q, id: `gen-${i}-${subject}`, subject }));
    }

    let limit = userTier === 'Premium' ? 40 : userTier === 'Basic' ? 15 : 4;
    setSelectedSubject(subject);
    setQuestions(subjectQuestions.slice(0, limit));
    setView('QUIZ');
  };

  const startStudy = (subject: Subject) => {
    setSelectedSubject(subject);
    setView('STUDY');
  };

  const handleFinish = (score: number, total: number) => {
    setFinalScore({ score, total });
    setView('RESULT');
  };

  const handleSelectPlan = (tier: UserTier) => {
    setUserTier(tier);
    setView('HOME');
  };

  const activeStudyMaterial = MOCK_STUDY_MATERIALS.find(m => m.subject === selectedSubject)!;

  return (
    <Layout 
      userTier={userTier} 
      theme={currentTheme}
      onNavigateHome={() => setView('HOME')} 
      onNavigatePricing={() => setView('PRICING')}
      onNavigateAdmin={() => setView('ADMIN')}
    >
      {view !== 'HOME' && view !== 'PRICING' && view !== 'ADMIN' && (
        <button 
          onClick={() => setView('HOME')}
          className="fixed top-24 left-8 z-[60] bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center lg:hidden"
        >
          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Dashboard
        </button>
      )}

      {view === 'HOME' && (
        <div className="animate-fadeIn space-y-24">
          {/* Hero Section */}
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

          {/* Quick Navigation Shortcuts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Exam Mode', desc: 'Simulate Real Test', icon: '⚡', color: 'indigo', onClick: () => startPractice('Use of English') },
              { label: 'Study Vault', desc: 'Read Curriculum', icon: '📖', color: 'emerald', onClick: () => startStudy('Mathematics') },
              { label: 'Go Premium', desc: 'Unlock Features', icon: '💎', color: 'amber', onClick: () => setView('PRICING') },
              { label: 'Hall of Fame', desc: 'Top 300+ Scorers', icon: '🏆', color: 'rose', onClick: () => document.getElementById('hof')?.scrollIntoView({ behavior: 'smooth' }) },
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

          {/* Subjects and Analytics Grid */}
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
                    <button 
                      onClick={() => startPractice(subject)}
                      className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                    >
                      Practice
                    </button>
                    <button 
                      onClick={() => startStudy(subject)}
                      className="flex-grow bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Study
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <LiveAnalytics stats={liveStats} theme={currentTheme} />
            </div>
          </div>

          <div id="hof">
            <HallOfFame 
              students={visibleTestimonials} 
              theme={currentTheme} 
              userTier={userTier}
              onShuffle={handleManualShuffle}
              shufflesRemaining={3 - shuffleCount}
            />
          </div>
        </div>
      )}

      {view === 'PRICING' && <Pricing currentTier={userTier} onSelectPlan={handleSelectPlan} />}
      {view === 'ADMIN' && <AdminPortal />}
      {view === 'QUIZ' && <QuizEngine questions={questions} subject={selectedSubject} userTier={userTier} onFinish={handleFinish} onShowPricing={() => setView('PRICING')} />}
      {view === 'STUDY' && <StudyHub material={activeStudyMaterial} userTier={userTier} theme={currentTheme} onExit={() => setView('HOME')} onShowPricing={() => setView('PRICING')} />}

      {view === 'RESULT' && (
        <div className="max-w-4xl mx-auto bg-white p-12 lg:p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.12)] border border-slate-100 text-center animate-bounceIn">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Mission Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
               <span className="block text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Raw Performance</span>
               <span className="text-5xl lg:text-6xl font-black text-slate-900">{finalScore.score} <span className="text-xl lg:text-2xl text-slate-300">/ {finalScore.total}</span></span>
            </div>
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
               <span className="block text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Efficiency Rating</span>
               <span className="text-5xl lg:text-6xl font-black text-slate-900">{Math.round((finalScore.score / finalScore.total) * 100)}%</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            <button onClick={() => setView('HOME')} className="flex-grow bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-lg lg:text-xl uppercase tracking-widest hover:bg-black transition-all">Back Home</button>
            <button onClick={() => startPractice(selectedSubject)} className="flex-grow bg-white border-4 border-slate-100 text-slate-900 py-6 rounded-[2.5rem] font-black text-lg lg:text-xl uppercase tracking-widest transition-all">Relaunch Exam</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
