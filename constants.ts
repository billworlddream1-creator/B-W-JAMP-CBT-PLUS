
import { Question, Subject, Plan, ActivityLog, PaymentLog, ColorTheme, StudentTestimonial, StudyMaterial, LiveStats } from './types';

export const APP_NAME = "B&W JAMB CBT PLUS";

export const SUBJECTS: Subject[] = [
  'Use of English',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Government'
];

export const THEMES: ColorTheme[] = [
  { primary: 'slate-900', secondary: 'slate-800', accent: 'indigo-500', bg: 'slate-50' }, 
  { primary: 'indigo-900', secondary: 'indigo-700', accent: 'amber-400', bg: 'slate-50' },
  { primary: 'emerald-900', secondary: 'emerald-700', accent: 'emerald-400', bg: 'emerald-50' },
  { primary: 'rose-900', secondary: 'rose-700', accent: 'rose-400', bg: 'rose-50' },
  { primary: 'blue-900', secondary: 'blue-700', accent: 'cyan-400', bg: 'blue-50' },
];

export const SALUTATIONS = [
  "Welcome back, Future 300+ Scorer! 🎓",
  "Greetings, Nigeria's Next Top Scholar! 🇳🇬",
  "Rise and grind, the campus is calling! 🏫",
  "Hello Candidate! Ready to dominate JAMB today? 🔥",
  "Welcome, Distinguished Scholar. Excellence awaits! ✨",
  "Step into your future, one question at a time! 🚀",
  "Greetings! Your hard work is the key to admission! 🔑"
];

export const MOCK_STUDY_MATERIALS: StudyMaterial[] = SUBJECTS.map(subject => ({
  subject,
  modules: [
    { id: 'm1', title: 'Fundamental Principles', content: `This module covers the core concepts of ${subject}. Understanding the basics is crucial for acing JAMB. Take notes on key definitions and recurring patterns in past questions.`, isPremium: false },
    { id: 'm2', title: 'Advanced Applications', content: `Moving deeper into ${subject}, we look at complex scenarios and multi-step problem solving. Focus on high-frequency topics that appear annually in UTME.`, isPremium: false },
    { id: 'm3', title: 'The JAMB Trap: Common Errors', content: `JAMB often sets "traps" in ${subject}. This premium module analyzes the top 10 mistakes students make and how to avoid them through critical thinking.`, isPremium: true },
    { id: 'm4', title: 'Rapid Review Summary', content: `A concise wrap-up of everything you need to know about ${subject} in 15 minutes. Perfect for final-day revision and mental mapping.`, isPremium: true },
  ]
}));

export const GET_MOCK_LIVE_STATS = (): LiveStats => ({
  activeUsers: Math.floor(Math.random() * (1500 - 800) + 800),
  trendingSubject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
  totalQuestionsSolved: 1240582 + Math.floor(Math.random() * 500),
  recentScores: [
    { name: "Tunde A.", score: 342, subject: "Physics" },
    { name: "Bisi O.", score: 310, subject: "English" },
    { name: "Chidi K.", score: 358, subject: "Mathematics" },
    { name: "Fatima S.", score: 325, subject: "Biology" },
  ]
});

export const CORRECT_SHOUTS = [
  "GENIUS! JAMB is in trouble! 🔥",
  "FUTURE 400 SCORER! 🚀",
  "Spot on! You're cooking! 👨‍🍳",
  "Omo, you sabi this thing! 💎",
  "Excellent! Brain box loading... 🧠",
  "Sharper than a new razor! 🪒",
  "Correct! Your Admission is sure! 🎓",
  "Banger! No mistakes here! ✨"
];

export const INCORRECT_SHOUTS = [
  "Eiyah! Even my grandma knows this! 👵",
  "BULLY! Go back to your books! 📚",
  "Chai! JAMB go catch you o! 🏃‍♂️",
  "Wrong! Are you sure you're reading? 👀",
  "E shock you? Try again jo! ⚡",
  "Knowledge not found! 404 Error! ❌",
  "Is this how you want to enter Uni? 🏫",
  "Small math, you don fail! Bully! 🤡"
];

const firstNames = ["Chidi", "Olumide", "Amina", "Ngozi", "Tunde", "Zainab", "Femi", "Bisi", "Kola", "Efe", "Uche", "Ifeanyi", "Fatima", "Sade", "Emeka"];
const lastNames = ["Okonkwo", "Adeyemi", "Abubakar", "Bello", "Nwosu", "Ibrahim", "Balogun", "Danjuma", "Olatunji", "Okeke", "Suleiman", "Musa"];
const universities = ["UNILAG", "UI", "OAU", "UNIBEN", "ABU", "UNN", "LASU", "UNILORIN", "Covenant University", "Babcock"];

export const MOCK_TESTIMONIALS: StudentTestimonial[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `student-${i}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`,
  score: Math.floor(Math.random() * (365 - 305 + 1)) + 305,
  institution: universities[i % universities.length],
  image: `https://i.pravatar.cc/150?u=student${i}`,
  year: '2023/2024'
}));

export const PLANS: Plan[] = [
  {
    id: 'Free',
    name: 'Starter',
    price: 'Free',
    features: ['4 Questions per Subject', 'Limited Study Topics', 'Limited Hall of Fame Shuffles'],
    color: 'slate'
  },
  {
    id: 'Basic',
    name: 'Standard',
    price: '₦2,500',
    features: ['All Subjects', '20 Questions per Session', 'Full Study Materials', 'Unlimited Shuffles'],
    color: 'indigo'
  },
  {
    id: 'Premium',
    name: 'Pro Elite',
    price: '₦5,000',
    features: ['Unlimited Questions', 'Full Exam Mode', 'Everything Unlocked', 'Unlimited AI Explanations'],
    color: 'purple'
  }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: '1', userEmail: 'tunde@gmail.com', action: 'Quiz Started', timestamp: '2 mins ago', details: 'Mathematics Practice' },
  { id: '2', userEmail: 'kemi_a@web.com', action: 'Upgrade', timestamp: '15 mins ago', details: 'Upgraded to Premium' },
  { id: '3', userEmail: 'mike_99@gmail.com', action: 'AI Explanation', timestamp: '45 mins ago', details: 'Physics: Motion' },
  { id: '4', userEmail: 'josh@edu.ng', action: 'Quiz Finished', timestamp: '1 hour ago', details: 'Score: 18/20 (English)' },
];

export const MOCK_PAYMENTS: PaymentLog[] = [
  { id: 'TXN_9821', userEmail: 'jane.doe@web.com', plan: 'Premium', amount: 5000, date: '2023-11-20', status: 'Successful' },
  { id: 'TXN_9820', userEmail: 'mike_99@gmail.com', plan: 'Basic', amount: 2500, date: '2023-11-19', status: 'Successful' },
];

export const MOCK_QUESTIONS: Question[] = [
  { id: 'e1', subject: 'Use of English', question: "Choose the option nearest in meaning to the underlined word: The manager's decision was **arbitrary**.", options: { A: "Balanced", B: "Unreasonable", C: "Objective", D: "Legal" }, correctAnswer: 'B', topic: 'Synonyms' },
  { id: 'e2', subject: 'Use of English', question: "Identify the word that is correctly spelled.", options: { A: "Occurrence", B: "Occurence", C: "Ocurrence", D: "Occurrense" }, correctAnswer: 'A', topic: 'Spelling' },
  { id: 'm1', subject: 'Mathematics', question: "Solve for x: 2x + 5 = 15.", options: { A: "5", B: "10", C: "15", D: "20" }, correctAnswer: 'A', topic: 'Algebra' },
  { id: 'p1', subject: 'Physics', question: "Which of the following is a fundamental unit?", options: { A: "Newton", B: "Joule", C: "Kelvin", D: "Watt" }, correctAnswer: 'C', topic: 'Units' },
  { id: 'c1', subject: 'Chemistry', question: "The atomic number of Oxygen is:", options: { A: "6", B: "7", C: "8", D: "16" }, correctAnswer: 'C', topic: 'Atomic Structure' },
  { id: 'b1', subject: 'Biology', question: "The powerhouse of the cell is the:", options: { A: "Nucleus", B: "Mitochondria", C: "Ribosome", D: "Cytoplasm" }, correctAnswer: 'B', topic: 'Cell Biology' },
  { id: 'g1', subject: 'Government', question: "Democracy is often defined as government of the:", options: { A: "Few", B: "Military", C: "People", D: "Rich" }, correctAnswer: 'C', topic: 'Civics' },
];

export const UPGRADE_MESSAGES = [
  "🚀 Ace JAMB with Premium: Unlock 5,000+ Past Questions!",
  "💡 Free users get limited questions. Go Pro for full exam simulations!",
  "🏆 Join 10,000+ students scoring 300+ with our AI Tutor.",
];
