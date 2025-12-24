
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
  "Greetings! Your hard work is the key to admission! 🔑",
  "The World is watching. Practice like a global champion! 🌍",
  "Future Ivy League or Unilag Scholar? The work is the same! 🏛️"
];

export const MOCK_STUDY_MATERIALS: StudyMaterial[] = SUBJECTS.map(subject => ({
  subject,
  modules: [
    { id: 'm1', title: 'The Foundation Phase', content: `This module covers the core concepts of ${subject}. JAMB frequently pulls 40% of their questions from these fundamental topics. Mastery here is non-negotiable for anyone seeking a score above 250.`, isPremium: false },
    { id: 'm2', title: 'Strategic Application', content: `We transition from 'knowing' to 'solving'. In ${subject}, speed is just as important as accuracy. This module focuses on the mental shortcuts required to finish 40 questions in record time.`, isPremium: false },
    { id: 'm3', title: 'Global Perspective: JAMB vs. The World', content: `How does your ${subject} knowledge compare globally? 
    
    • IN SOUTH AFRICA: This content mirrors the National Senior Certificate (NSC) 'Matric' exams and NBTs. Like JAMB, the NSC demands high analytical precision.
    • IN THE USA: This is equivalent to the SAT Subject Tests or ACT. While the SAT focuses more on aptitude, JAMB requires deep subject-specific mastery.
    • IN EUROPE: You are studying at the level of UK A-Levels or the French Baccalauréat. High scores in ${subject} prove you can compete in any European university.`, isPremium: true },
    { id: 'm4', title: 'The 300+ Secret: Elite Logic', content: `This premium module analyzes high-difficulty questions in ${subject} that separate the average candidates from the elite scholars. We break down complex logic used by JAMB examiners.`, isPremium: true },
  ]
}));

export const GET_MOCK_LIVE_STATS = (): LiveStats => ({
  activeUsers: Math.floor(Math.random() * (2500 - 1200) + 1200),
  trendingSubject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
  totalQuestionsSolved: 3450912 + Math.floor(Math.random() * 1000),
  recentScores: [
    { name: "Segun W.", score: 355, subject: "Chemistry" },
    { name: "Adaeze P.", score: 318, subject: "Government" },
    { name: "Ibrahim M.", score: 362, subject: "Mathematics" },
    { name: "Chinelo V.", score: 329, subject: "English" },
  ]
});

export const CORRECT_SHOUTS = [
  "GENIUS! JAMB is in trouble! 🔥",
  "FUTURE 400 SCORER! 🚀",
  "Spot on! You're cooking! 👨‍🍳",
  "Omo, you sabi this thing! 💎",
  "Correct! Your Admission is sure! 🎓",
  "Banger! No mistakes here! ✨",
  "A-Level performance! Spot on! 🇬🇧",
  "SAT standard accuracy! Amazing! 🇺🇸"
];

export const INCORRECT_SHOUTS = [
  "Eiyah! Even my grandma knows this! 👵",
  "BULLY! Go back to your books! 📚",
  "Chai! JAMB go catch you o! 🏃‍♂️",
  "Wrong! Are you sure you're reading? 👀",
  "E shock you? Try again jo! ⚡",
  "Is this how you want to enter Uni? 🏫",
  "South African Matrics would pass this! Step up! 🇿🇦",
  "American SAT students are faster. Focus! 🇺🇸"
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
    features: ['4 Questions per Subject', 'Limited Study Topics', 'Standard Stats'],
    color: 'slate'
  },
  {
    id: 'Basic',
    name: 'Standard',
    price: '₦2,500',
    features: ['All Subjects', '20 Questions per Session', 'Global Exam Comparisons', 'Unlimited Shuffles'],
    color: 'indigo'
  },
  {
    id: 'Premium',
    name: 'Pro Elite',
    price: '₦5,000',
    features: ['Unlimited Questions', 'Full Exam Mode', 'Everything Unlocked', 'AI Global Tutoring'],
    color: 'purple'
  }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: '1', userEmail: 'scholar_tunde@gmail.com', action: 'Global Comparison', timestamp: 'Just now', details: 'Reading: JAMB vs SAT' },
  { id: '2', userEmail: 'ngozi.j@edu.ng', action: 'Upgrade', timestamp: '5 mins ago', details: 'Upgraded to Pro Elite' },
  { id: '3', userEmail: 'mike_physics@web.com', action: 'Study Session', timestamp: '12 mins ago', details: 'Comparing A-Level Mechanics' },
  { id: '4', userEmail: 'future_doc@jamb.ng', action: 'Quiz Finished', timestamp: '20 mins ago', details: 'Score: 19/20 (Biology)' },
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
  "🚀 Ace JAMB & NSC: Unlock Global Study Modules!",
  "💡 Compare your JAMB score with SAT & A-Level benchmarks!",
  "🏆 Join 10,000+ students aiming for World-Class scores.",
  "⚡ Pro users study at an Ivy League standard. Upgrade now!",
];
