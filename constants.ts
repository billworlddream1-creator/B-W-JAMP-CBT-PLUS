
import { Question, Subject, Plan, ActivityLog, PaymentLog, ColorTheme, StudentTestimonial, StudyMaterial, LiveStats, SessionHistory } from './types';

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
  "Welcome, Distinguished Scholar. Excellence awaits! ✨"
];

export const MOCK_STUDY_MATERIALS: StudyMaterial[] = SUBJECTS.map(subject => ({
  subject,
  modules: [
    { id: 'm1', title: 'The Foundation Phase', content: `This module covers the core concepts of ${subject}. JAMB frequently pulls 40% of their questions from these fundamental topics.`, isPremium: false },
    { id: 'm2', title: 'Strategic Application', content: `We transition from 'knowing' to 'solving'. In ${subject}, speed is just as important as accuracy.`, isPremium: false },
    { id: 'm3', title: 'Global Perspective: JAMB vs. The World', content: `How does your ${subject} knowledge compare globally? This module mirrors the South African NSC and the American SAT.`, isPremium: true },
  ]
}));

export const GET_MOCK_LIVE_STATS = (): LiveStats => ({
  activeUsers: Math.floor(Math.random() * (2500 - 1200) + 1200),
  trendingSubject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
  totalQuestionsSolved: 3450912 + Math.floor(Math.random() * 1000),
  recentScores: [
    { name: "Segun W.", score: 355, subject: "Chemistry" },
    { name: "Adaeze P.", score: 318, subject: "Government" },
  ]
});

export const PLANS: Plan[] = [
  {
    id: 'Free',
    name: 'Starter',
    price: 'Free',
    priceAmount: 0,
    features: ['4 Questions per Subject', 'Limited Study Topics'],
    color: 'slate'
  },
  {
    id: 'Basic',
    name: 'Standard',
    price: '₦2,500',
    priceAmount: 2500,
    features: ['All Subjects', '20 Questions per Session', 'Unlimited Shuffles'],
    color: 'indigo'
  },
  {
    id: 'Premium',
    name: 'Pro Elite',
    price: '₦5,000',
    priceAmount: 5000,
    features: ['Unlimited Questions', 'Full Exam Mode', 'Everything Unlocked', 'AI SabiTutor'],
    color: 'purple'
  }
];

export const MOCK_QUESTIONS: Question[] = [
  { id: 'e1', subject: 'Use of English', question: "Choose the option nearest in meaning to the underlined word: The manager's decision was **arbitrary**.", options: { A: "Balanced", B: "Unreasonable", C: "Objective", D: "Legal" }, correctAnswer: 'B', topic: 'Synonyms' },
  { id: 'e2', subject: 'Use of English', question: "Identify the word that is correctly spelled.", options: { A: "Occurrence", B: "Occurence", C: "Ocurrence", D: "Occurrense" }, correctAnswer: 'A', topic: 'Spelling' },
  { id: 'm1', subject: 'Mathematics', question: "Solve for x: 2x + 5 = 15.", options: { A: "5", B: "10", C: "15", D: "20" }, correctAnswer: 'A', topic: 'Algebra' },
  { id: 'p1', subject: 'Physics', question: "Which of the following is a fundamental unit?", options: { A: "Newton", B: "Joule", C: "Kelvin", D: "Watt" }, correctAnswer: 'C', topic: 'Units' },
];

export const CORRECT_SHOUTS = ["GENIUS! JAMB is in trouble! 🔥", "Spot on! You're cooking! 👨‍🍳"];
export const INCORRECT_SHOUTS = ["Chai! JAMB go catch you o! 🏃‍♂️", "Is this how you want to enter Uni? 🏫"];
export const UPGRADE_MESSAGES = ["🚀 Ace JAMB & NSC: Unlock Global Study Modules!", "💡 Compare your JAMB score with SAT benchmarks!"];
export const MOCK_TESTIMONIALS: StudentTestimonial[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `student-${i}`,
  name: `Scholar ${i + 1}`,
  score: 300 + i,
  institution: "UNILAG",
  image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  year: '2023/2024'
}));
