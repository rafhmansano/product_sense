export type StepId = 'clarification' | 'segmentation' | 'problem' | 'solutions' | 'metrics';

export interface FrameworkStep {
  id: StepId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  keyQuestions: string[];
  tips: string[];
  examples: string[];
  icon: string;
  color: string;
}

export interface ExerciseStep {
  stepId: StepId;
  content: string;
  completedAt?: string;
}

export interface Exercise {
  id: string;
  question: string;
  company?: string;
  product?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  steps: ExerciseStep[];
  score?: number;
  feedback?: string;
  completedAt?: string;
  createdAt: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  xpEarned?: number;
  tags: string[];
}

export type BadgeId =
  | 'first_exercise'
  | 'first_completion'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'perfect_score'
  | 'hard_mode'
  | 'solutions_master'
  | 'metrics_guru'
  | 'consistent_practitioner'
  | 'speed_demon'
  | 'deep_thinker'
  | 'framework_master';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockedAt?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  streak: number;
  longestStreak: number;
  lastPracticeDate?: string;
  badges: BadgeId[];
  stepMastery: Record<StepId, number>;
  totalTimeSpent: number;
}

export interface ScoreRubric {
  stepId: StepId;
  criteria: Array<{
    label: string;
    description: string;
    maxPoints: number;
  }>;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  company: string;
  product: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  hints: string[];
}
