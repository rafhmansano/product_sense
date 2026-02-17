'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exercise, UserStats, BadgeId, StepId } from '@/types';
import { BADGES, calculateXpForExercise, XP_PER_LEVEL } from '@/lib/framework';

interface AppState {
  exercises: Exercise[];
  stats: UserStats;
  activeExerciseId: string | null;

  // Exercise actions
  createExercise: (question: string, difficulty: 'Easy' | 'Medium' | 'Hard', category: string, company?: string, tags?: string[]) => string;
  updateExerciseStep: (exerciseId: string, stepId: StepId, content: string) => void;
  completeExercise: (exerciseId: string, scores: Record<StepId, number>) => void;
  deleteExercise: (exerciseId: string) => void;
  setActiveExercise: (id: string | null) => void;

  // Stats actions
  awardBadge: (badgeId: BadgeId) => void;
  updateStreak: () => void;
}

const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL,
  totalExercises: 0,
  completedExercises: 0,
  averageScore: 0,
  streak: 0,
  longestStreak: 0,
  badges: [],
  stepMastery: {
    clarification: 0,
    segmentation: 0,
    problem: 0,
    solutions: 0,
    metrics: 0,
  },
  totalTimeSpent: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      exercises: [],
      stats: DEFAULT_STATS,
      activeExerciseId: null,

      createExercise: (question, difficulty, category, company, tags = []) => {
        const id = `ex_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const exercise: Exercise = {
          id,
          question,
          company,
          difficulty,
          category,
          steps: [],
          createdAt: new Date().toISOString(),
          status: 'draft',
          tags,
        };

        set((state) => {
          const newStats = { ...state.stats, totalExercises: state.stats.totalExercises + 1 };
          const newBadges = [...state.stats.badges];

          if (state.stats.totalExercises === 0 && !state.stats.badges.includes('first_exercise')) {
            newBadges.push('first_exercise');
            const badge = BADGES.find((b) => b.id === 'first_exercise');
            newStats.xp += badge?.xpReward ?? 0;
          }

          newStats.badges = newBadges;
          newStats.level = Math.floor(newStats.xp / XP_PER_LEVEL) + 1;
          newStats.xpToNextLevel = XP_PER_LEVEL - (newStats.xp % XP_PER_LEVEL);

          return {
            exercises: [exercise, ...state.exercises],
            stats: newStats,
            activeExerciseId: id,
          };
        });

        return id;
      },

      updateExerciseStep: (exerciseId, stepId, content) => {
        set((state) => ({
          exercises: state.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            const existingStepIndex = ex.steps.findIndex((s) => s.stepId === stepId);
            const updatedStep = { stepId, content };
            const newSteps =
              existingStepIndex >= 0
                ? ex.steps.map((s, i) => (i === existingStepIndex ? updatedStep : s))
                : [...ex.steps, updatedStep];
            return { ...ex, steps: newSteps, status: 'in_progress' as const };
          }),
        }));
      },

      completeExercise: (exerciseId, scores) => {
        const state = get();
        const exercise = state.exercises.find((e) => e.id === exerciseId);
        if (!exercise) return;

        const stepIds: StepId[] = ['clarification', 'segmentation', 'problem', 'solutions', 'metrics'];
        const totalScore = Math.round(
          stepIds.reduce((sum, id) => sum + (scores[id] ?? 0), 0) / stepIds.length
        );

        const xpEarned = calculateXpForExercise(totalScore, exercise.difficulty, state.stats.streak);

        set((state) => {
          const completedExercises = state.stats.completedExercises + 1;
          const allScores = state.exercises
            .filter((e) => e.status === 'completed' && e.score !== undefined)
            .map((e) => e.score as number);
          allScores.push(totalScore);
          const averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

          const newXp = state.stats.xp + xpEarned;
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
          const newXpToNext = XP_PER_LEVEL - (newXp % XP_PER_LEVEL);

          const newBadges = [...state.stats.badges];

          if (completedExercises === 1 && !newBadges.includes('first_completion')) {
            newBadges.push('first_completion');
          }
          if (exercise.difficulty === 'Hard' && !newBadges.includes('hard_mode')) {
            newBadges.push('hard_mode');
          }
          if (totalScore === 100 && !newBadges.includes('perfect_score')) {
            newBadges.push('perfect_score');
          }
          if (completedExercises >= 10 && !newBadges.includes('solutions_master')) {
            newBadges.push('solutions_master');
          }
          if (newLevel >= 10 && !newBadges.includes('framework_master')) {
            newBadges.push('framework_master');
          }

          // Update step mastery
          const newStepMastery = { ...state.stats.stepMastery };
          stepIds.forEach((id) => {
            if (scores[id] !== undefined) {
              const prev = newStepMastery[id] ?? 0;
              newStepMastery[id] = Math.round((prev + scores[id]) / 2);
            }
          });

          return {
            exercises: state.exercises.map((ex) =>
              ex.id === exerciseId
                ? {
                    ...ex,
                    score: totalScore,
                    status: 'completed' as const,
                    completedAt: new Date().toISOString(),
                    xpEarned,
                  }
                : ex
            ),
            stats: {
              ...state.stats,
              xp: newXp,
              level: newLevel,
              xpToNextLevel: newXpToNext,
              completedExercises,
              averageScore,
              badges: newBadges,
              stepMastery: newStepMastery,
            },
          };
        });
      },

      deleteExercise: (exerciseId) => {
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== exerciseId),
          activeExerciseId: state.activeExerciseId === exerciseId ? null : state.activeExerciseId,
        }));
      },

      setActiveExercise: (id) => {
        set({ activeExerciseId: id });
      },

      awardBadge: (badgeId) => {
        set((state) => {
          if (state.stats.badges.includes(badgeId)) return state;
          const badge = BADGES.find((b) => b.id === badgeId);
          const newXp = state.stats.xp + (badge?.xpReward ?? 0);
          return {
            stats: {
              ...state.stats,
              badges: [...state.stats.badges, badgeId],
              xp: newXp,
              level: Math.floor(newXp / XP_PER_LEVEL) + 1,
              xpToNextLevel: XP_PER_LEVEL - (newXp % XP_PER_LEVEL),
            },
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date().toDateString();
          const lastPractice = state.stats.lastPracticeDate
            ? new Date(state.stats.lastPracticeDate).toDateString()
            : null;
          const yesterday = new Date(Date.now() - 86400000).toDateString();

          let newStreak = state.stats.streak;
          if (lastPractice === today) return state;
          if (lastPractice === yesterday) {
            newStreak += 1;
          } else if (lastPractice !== today) {
            newStreak = 1;
          }

          const longestStreak = Math.max(newStreak, state.stats.longestStreak);
          const newBadges = [...state.stats.badges];
          let bonusXp = 0;

          if (newStreak >= 3 && !newBadges.includes('streak_3')) {
            newBadges.push('streak_3');
            bonusXp += BADGES.find((b) => b.id === 'streak_3')?.xpReward ?? 0;
          }
          if (newStreak >= 7 && !newBadges.includes('streak_7')) {
            newBadges.push('streak_7');
            bonusXp += BADGES.find((b) => b.id === 'streak_7')?.xpReward ?? 0;
          }
          if (newStreak >= 30 && !newBadges.includes('streak_30')) {
            newBadges.push('streak_30');
            bonusXp += BADGES.find((b) => b.id === 'streak_30')?.xpReward ?? 0;
          }

          const newXp = state.stats.xp + bonusXp;

          return {
            stats: {
              ...state.stats,
              streak: newStreak,
              longestStreak,
              lastPracticeDate: new Date().toISOString(),
              badges: newBadges,
              xp: newXp,
              level: Math.floor(newXp / XP_PER_LEVEL) + 1,
              xpToNextLevel: XP_PER_LEVEL - (newXp % XP_PER_LEVEL),
            },
          };
        });
      },
    }),
    {
      name: 'product-sense-storage',
    }
  )
);
