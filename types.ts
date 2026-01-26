
export type Subject = 'Use of English' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Economics' | 'Government';

export type UserTier = 'Free' | 'Basic' | 'Premium';

export type AppView = 'HOME' | 'QUIZ' | 'STUDY' | 'RESULT' | 'PRICING' | 'ADMIN' | 'PROGRESS' | 'AUTH';

export interface User {
  id: string;
  name: string;
  email: string;
  tier: UserTier;
  role?: 'student' | 'admin';
  avatar?: string;
  lastLogin?: number;
}

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

export interface Question {
  id: string;
  subject: Subject;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  topic?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  timeLeft: number;
  isFinished: boolean;
  score: number;
  startTime: number;
}

export interface SessionHistory {
  id: string;
  subject: Subject;
  score: number;
  total: number;
  timestamp: number;
  timeSpentSeconds: number;
}

export interface UserProgress {
  sessions: SessionHistory[];
  totalStudyTime: number; 
  lastActive: number;
}

export interface StudyModule {
  id: string;
  title: string;
  content: string;
  isPremium: boolean;
}

export interface StudyMaterial {
  subject: Subject;
  modules: StudyModule[];
}

export interface LiveStats {
  activeUsers: number;
  trendingSubject: Subject;
  recentScores: { name: string; score: number; subject: string }[];
  totalQuestionsSolved: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  timestamp: number;
  details: string;
}

export interface PaymentLog {
  id: string;
  userId: string;
  userEmail: string;
  plan: UserTier;
  amount: number;
  date: string;
  timestamp: number;
  status: 'Successful' | 'Pending' | 'Failed';
  transactionRef: string;
}

export interface Plan {
  id: UserTier;
  name: string;
  price: string;
  priceAmount: number;
  features: string[];
  color: string;
}

export interface StudentTestimonial {
  id: string;
  name: string;
  score: number;
  image: string;
  institution: string;
  year: string;
}
