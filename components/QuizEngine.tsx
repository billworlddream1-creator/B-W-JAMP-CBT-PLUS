
import React, { useState, useEffect } from 'react';
import { Question, Subject, QuizState, UserTier } from '../types';
import { getExplanation } from '../services/geminiService';
import { CORRECT_SHOUTS, INCORRECT_SHOUTS } from '../constants';

interface QuizEngineProps {
  questions: Question[];
  subject: Subject;
  userTier: UserTier;
  onFinish: (score: number, total: number) => void;
  onShowPricing: () => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ questions, subject, userTier, onFinish, onShowPricing }) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    timeLeft: questions.length * 60,
    isFinished: false,
    score: 0,
    startTime: Date.now()
  });

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [shout, setShout] = useState<{ text: string; type: 'correct' | 'wrong' } | null>(null);

  useEffect(() => {
    if (state.timeLeft <= 0 || state.isFinished) return;
    const timer = setInterval(() => {
      setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.timeLeft, state.isFinished]);

  const handleOptionSelect = (option: string) => {
    const currentQ = questions[state.currentQuestionIndex];
    const isCorrect = option === currentQ.correctAnswer;
    
    // Pick a random shout
    const shoutPool = isCorrect ? CORRECT_SHOUTS : INCORRECT_SHOUTS;
    const randomMsg = shoutPool[Math.floor(Math.random() * shoutPool.length)];
    
    setShout({ text: randomMsg, type: isCorrect ? 'correct' : 'wrong' });
    
    setState(prev => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [currentQ.id]: option }
    }));
    setAiExplanation(null);
  };

  const navigateQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setState(prev => ({ ...prev, currentQuestionIndex: index }));
      setAiExplanation(null);
      setShout(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    let score = 0;
    questions.forEach(q => {
      if (state.selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    setState(prev => ({ ...prev, isFinished: true, score }));
    onFinish(score, questions.length);
  };

  const currentQuestion = questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
      <div className="flex-grow bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Bubbling Shout Notification */}
        {shout && (
          <div className={`absolute top-0 left-0 w-full py-4 text-center font-black text-white transform transition-all z-20 animate-bubble
            ${shout.type === 'correct' ? 'bg-emerald-500' : 'bg-rose-500 shadow-[0_15px_30px_rgba(244,63,94,0.4)]'}`}>
            <span className="text-xl uppercase tracking-widest">{shout.text}</span>
          </div>
        )}

        <div className={`flex justify-between items-center mb-10 ${shout ? 'mt-10' : ''}`}>
          <span className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
            {subject}
          </span>
          <div className="flex items-center space-x-4 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-mono font-black text-2xl ${state.timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
              {formatTime(state.timeLeft)}
            </span>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Question {state.currentQuestionIndex + 1}</h2>
            <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{state.currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
            <div className="bg-slate-900 h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mb-14 min-h-[160px]">
          <p className="text-2xl leading-snug text-slate-800 font-extrabold tracking-tight">{currentQuestion.question}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            const isSelected = state.selectedAnswers[currentQuestion.id] === key;
            const hasAnswered = !!state.selectedAnswers[currentQuestion.id];
            
            return (
              <button
                key={key}
                onClick={() => handleOptionSelect(key)}
                className={`p-7 text-left rounded-[2rem] border-4 transition-all flex items-center group relative overflow-hidden
                  ${isSelected 
                    ? shout?.type === 'correct' ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'
                    : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50 shadow-sm hover:shadow-xl'}`}
              >
                <span className={`w-12 h-12 flex items-center justify-center rounded-2xl mr-5 font-black text-lg transition-all
                  ${isSelected 
                    ? shout?.type === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
                  {key}
                </span>
                <span className={`flex-grow font-bold text-xl ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{value}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 pt-10 gap-8">
          <div className="flex gap-4">
            <button
              onClick={() => navigateQuestion(state.currentQuestionIndex - 1)}
              disabled={state.currentQuestionIndex === 0}
              className="px-10 py-4 border-4 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-20 hover:border-slate-300 hover:text-slate-900 transition-all"
            >
              Back
            </button>
            <button
              onClick={() => state.currentQuestionIndex === questions.length - 1 ? handleFinish() : navigateQuestion(state.currentQuestionIndex + 1)}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl transition-all"
            >
              {state.currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
             <button
              onClick={handleFinish}
              className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-700 transition-all"
            >
              Submit Session
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 sticky top-28">
          <h3 className="font-black text-slate-900 mb-8 text-[10px] uppercase tracking-[0.3em] text-center border-b border-slate-50 pb-4">
            Session Navigator
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, idx) => {
               const isAnswered = !!state.selectedAnswers[q.id];
               const isActive = state.currentQuestionIndex === idx;
               
               return (
                <button
                  key={q.id}
                  onClick={() => navigateQuestion(idx)}
                  className={`w-full aspect-square flex items-center justify-center rounded-2xl text-xs font-black transition-all border-4
                    ${isActive 
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-110' 
                      : isAnswered 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 opacity-60' 
                        : 'border-slate-50 text-slate-300 hover:border-slate-200'}`}
                >
                  {idx + 1}
                </button>
               )
            })}
          </div>
          
          <div className="mt-12 space-y-3">
             <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
               <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
               Completed
             </div>
             <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
               <div className="w-2 h-2 bg-slate-900 rounded-full mr-3"></div>
               Active Now
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;
