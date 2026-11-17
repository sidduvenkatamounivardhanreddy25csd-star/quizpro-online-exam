export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  pass_mark: number;
  published: number; // 0: draft, 1: published, 2: archived
  question_count?: number;
  attempt_count?: number;
  avg_score?: number;
}

export interface Question {
  id: number;
  quiz_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  points: number;
}

export interface AdminQuestion extends Question {
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuestionReviewItem {
  id: number;
  question: string;
  points: number;
  studentAnswer: string;
  studentAnswerText: string;
  correctAnswer: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AttemptResult {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  quizCategory?: string;
  studentName?: string;
  score: number;
  total: number;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  passMark: number;
  timeSpentSeconds: number;
  duration: number;
  submittedAt: string;
  classRank?: number;
  totalPeers?: number;
  review: QuestionReviewItem[];
}

export interface AttemptHistoryItem {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total: number;
  percentage: number;
  time_spent_seconds: number;
  submitted_at: string;
  quiz_title: string;
  quiz_category: string;
  quiz_duration: number;
  pass_mark: number;
  correct_count?: number;
  total_questions?: number;
  student_name?: string;
  passed?: boolean;
}

export interface StudentDashboardData {
  studentName: string;
  availableCount: number;
  completedCount: number;
  avgScore: number;
  globalRank: number;
  cohortSize: number;
  streakDays: number;
  accuracyRate: number;
  timePerQuestionSec: number;
  hoursLogged: number;
  weeklyChart: { day: string; height: number; isToday?: boolean }[];
  recentAttempts: {
    id: number;
    quiz_id: number;
    score: number;
    total: number;
    percentage: number;
    submitted_at: string;
    quiz_title: string;
  }[];
  availableQuizzes: Quiz[];
}

export interface AdminOverviewData {
  totalStudents: number;
  totalQuizzes: number;
  totalAttempts: number;
  avgPassRate: number;
  liveSubmissions: {
    id: number;
    score: number;
    total: number;
    percentage: number;
    submitted_at: string;
    time_spent_seconds: number;
    student_name: string;
    student_email: string;
    quiz_title: string;
  }[];
}
