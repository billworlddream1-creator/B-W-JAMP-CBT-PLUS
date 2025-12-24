
export type Subject = 'Use of English' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Economics' | 'Government';

export type UserTier = 'Free' | 'Basic' | 'Premium';

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
  userEmail: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface PaymentLog {
  id: string;
  userEmail: string;
  plan: UserTier;
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
}

export interface Plan {
  id: UserTier;
  name: string;
  price: string;
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
