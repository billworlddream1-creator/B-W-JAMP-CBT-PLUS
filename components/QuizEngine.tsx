
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Question, Subject, QuizState, UserTier } from '../types';
import { chatWithTutor } from '../services/geminiService';
import { CORRECT_SHOUTS, INCORRECT_SHOUTS } from '../constants';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface QuizSettings {
  hideTutor: boolean;
  randomizeOrder: boolean;
}

interface QuizEngineProps {
  questions: Question[];
  subject: Subject;
  userTier: UserTier;
  onFinish: (score: number, total: number, timeSpent: number) => void;
  onShowPricing: () => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ questions: initialQuestions, subject, userTier, onFinish, onShowPricing }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    timeLeft: initialQuestions.length * 60,
    isFinished: false,
    score: 0,
    startTime: Date.now()
  });

  const [shout, setShout] = useState<{ text: string; type: 'correct' | 'wrong' } | null>(null);
  
  // Quiz Settings
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>({
    hideTutor: false,
    randomizeOrder: false
  });

  // AI Tutor Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechConfidence, setSpeechConfidence] = useState<'high' | 'low' | 'idle'>('idle');
  const [cooldown, setCooldown] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Memoized finish handler to be used by timer and manual finish
  const handleFinish = useCallback(() => {
    if (state.isFinished) return;

    let score = 0;
    questions.forEach(q => {
      if (state.selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    
    const totalTimeAllowed = initialQuestions.length * 60;
    const timeSpent = totalTimeAllowed - state.timeLeft;
    
    setState(prev => ({ ...prev, isFinished: true, score }));
    onFinish(score, questions.length, timeSpent);
  }, [state.selectedAnswers, state.timeLeft, state.isFinished, questions, initialQuestions.length, onFinish]);

  // Timer Effect
  useEffect(() => {
    if (state.isFinished) return;

    if (state.timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setState(prev => ({ ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeLeft, state.isFinished, handleFinish]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiTyping]);

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-NG';

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechConfidence('idle');
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
        setSpeechConfidence('low');
      };

      recognition.onresult = (event: any) => {
        const result = event.results[0][0];
        const transcript = result.transcript;
        const confidence = result.confidence;

        if (confidence < 0.75) {
          setSpeechConfidence('low');
        } else {
          setSpeechConfidence('high');
          setChatInput(prev => (prev ? prev + " " + transcript : transcript));
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const shuffleQuestions = (qArray: Question[]) => {
    const shuffled = [...qArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleToggleRandomize = () => {
    const newRandomize = !settings.randomizeOrder;
    setSettings(prev => ({ ...prev, randomizeOrder: newRandomize }));
    
    if (newRandomize) {
      setQuestions(shuffleQuestions(initialQuestions));
    } else {
      setQuestions(initialQuestions);
    }
    
    setState({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeLeft: initialQuestions.length * 60,
      isFinished: false,
      score: 0,
      startTime: Date.now()
    });
    setChatHistory([]);
    setShout(null);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (userTier === 'Free') {
        onShowPricing();
        return;
      }
      if (cooldown > 0) return;
      try {
        setSpeechConfidence('idle');
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Speech Recognition Error:", e);
      }
    }
  };

  /**
   * Handles the submission of a chat message to the SabiTutor AI.
   * Integrates with the Gemini API through the chatWithTutor service.
   */
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping || cooldown > 0) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsAiTyping(true);

    try {
      // Prepare history format required by geminiService
      const apiHistory = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as 'user' | 'model',
        parts: [{ text: msg.text }]
      }));

      const context = {
        question: questions[state.currentQuestionIndex],
        subject: subject
      };

      const response = await chatWithTutor(userMessage, apiHistory, context);
      
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
      // Set a small cooldown to manage API usage and simulate thinking
      setCooldown(3); 
    } catch (error) {
      console.error("Chat Submit Error:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Omo, I hit a snag connecting. Check your network and try again jo!" }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    const currentQ = questions[state.currentQuestionIndex];
    const isCorrect = option === currentQ.correctAnswer;
    
    const shoutPool = isCorrect ? CORRECT_SHOUTS : INCORRECT_SHOUTS;
    const randomMsg = shoutPool[Math.floor(Math.random() * shoutPool.length)];
    
    setShout({ text: randomMsg, type: isCorrect ? 'correct' : 'wrong' });
    
    setState(prev => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [currentQ.id]: option }
    }));
  };

  const navigateQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setState(prev => ({ ...prev, currentQuestionIndex: index }));
      setShout(null);
      setChatHistory([]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
  const isTimeCritical = state.timeLeft < 60;
  const isTimeWarning = state.timeLeft < 300 && state.timeLeft >= 60;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn relative h-full">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl animate-bubble">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Mission Config</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Calibrate your exam mode</p>
              </div>
              <button onClick={() => setShowSettings(false)} className="p-3 hover:bg-white/10 rounded-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Hide AI Tutor</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Simulate strict exam conditions</p>
                </div>
                <button 
                  onClick={() => setSettings(prev => ({ ...prev, hideTutor: !prev.hideTutor }))}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.hideTutor ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${settings.hideTutor ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Shuffle Questions</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Randomize order (Resets Session)</p>
                </div>
                <button 
                  onClick={handleToggleRandomize}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.randomizeOrder ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${settings.randomizeOrder ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
              >
                Apply & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Quiz Area */}
      <div className={`flex-grow bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden transition-all duration-500 ${isChatOpen ? 'lg:mr-[400px]' : ''}`}>
        {/* Bubbling Shout Notification */}
        {shout && (
          <div className={`absolute top-0 left-0 w-full py-4 text-center font-black text-white transform transition-all z-20 animate-bubble
            ${shout.type === 'correct' ? 'bg-emerald-500' : 'bg-rose-500 shadow-[0_15px_30px_rgba(244,63,94,0.4)]'}`}>
            <span className="text-xl uppercase tracking-widest">{shout.text}</span>
          </div>
        )}

        <div className={`flex justify-between items-center mb-10 ${shout ? 'mt-10' : ''}`}>
          <div className="flex items-center space-x-4">
            <span className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
              {subject}
            </span>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-100"
              title="Exam Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          
          {/* Prominent Real-time Timer */}
          <div className={`flex items-center space-x-4 px-6 py-3 rounded-2xl border transition-all duration-500 shadow-lg
            ${isTimeCritical ? 'bg-rose-50 border-rose-200 ring-4 ring-rose-100 animate-pulse' : 
              isTimeWarning ? 'bg-amber-50 border-amber-200 shadow-amber-100' : 'bg-slate-50 border-slate-100'}`}>
            <svg className={`w-6 h-6 ${isTimeCritical ? 'text-rose-600 animate-bounce' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex flex-col items-center">
              <span className={`font-mono font-black text-3xl leading-none ${isTimeCritical ? 'text-rose-600' : 'text-slate-800'}`}>
                {formatTime(state.timeLeft)}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${isTimeCritical ? 'text-rose-400' : 'text-slate-400'}`}>
                {isTimeCritical ? 'Final Minute!' : 'Time Remaining'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Question {state.currentQuestionIndex + 1}</h2>
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
          
          {!settings.hideTutor && (
            <div className="flex items-center gap-4">
               <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl
                  ${isChatOpen ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>{isChatOpen ? 'Hide Tutor' : 'Ask AI Tutor'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Navigator */}
      {!isChatOpen && (
        <div className="lg:w-80 flex-shrink-0 animate-fadeIn">
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
            
            <div className="mt-10 pt-8 border-t border-slate-50">
               <button 
                onClick={handleFinish}
                className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-rose-100 hover:bg-rose-100 transition-all"
              >
                End Session Early
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor Chat Sidebar */}
      {!settings.hideTutor && (
        <div className={`fixed top-24 bottom-24 right-4 w-[90%] md:w-[400px] z-40 transition-all duration-500 transform 
          ${isChatOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="h-full bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-2 border-indigo-50 flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">👨‍🏫</div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tighter">SabiTutor AI</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full 
                      ${isRecording ? 'bg-red-500 animate-ping' : 
                        speechConfidence === 'low' ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'}`}></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {isRecording ? 'Listening...' : 
                        speechConfidence === 'low' ? 'Low Confidence - Repeat?' :
                        cooldown > 0 ? `Thinking (${cooldown}s)` : 'Ready to assist'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-3 hover:bg-white/10 rounded-xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {chatHistory.length === 0 && (
                <div className="text-center py-10 px-4">
                  <div className="text-4xl mb-6">💡</div>
                  <h5 className="font-black text-slate-900 uppercase text-xs mb-3">Ask about this question</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    "Why is option B incorrect?" or "Tell me more about the topic of this question."
                  </p>
                </div>
              )}
              
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-xs font-bold leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                      : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 p-5 rounded-3xl rounded-tl-none border border-slate-100 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-8 border-t border-slate-50 bg-slate-50/50">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={cooldown > 0}
                    placeholder={
                      isRecording ? "Listening to you..." : 
                      speechConfidence === 'low' ? "Didn't catch that. Try again?" :
                      cooldown > 0 ? `Ready in ${cooldown}s...` : "Ask your tutor anything..."
                    }
                    className={`w-full bg-white border-2 rounded-2xl py-5 pl-6 pr-16 text-xs font-black uppercase tracking-tight focus:outline-none transition-all shadow-inner
                      ${isRecording ? 'border-red-400 ring-4 ring-red-50 animate-pulse' : 
                        speechConfidence === 'low' ? 'border-amber-400 ring-4 ring-amber-50' :
                        cooldown > 0 ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-100 focus:border-indigo-500'}`}
                  />
                  <button 
                    type="button"
                    onClick={toggleRecording}
                    disabled={cooldown > 0}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all shadow-md
                      ${isRecording ? 'bg-red-500 text-white animate-pulse' : 
                        speechConfidence === 'low' ? 'bg-amber-500 text-white animate-bounce' :
                        cooldown > 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={isAiTyping || !chatInput.trim() || cooldown > 0}
                  className="bg-slate-900 text-white p-5 rounded-2xl disabled:opacity-20 hover:scale-105 transition-all shadow-lg flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizEngine;
