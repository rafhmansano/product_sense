import { FrameworkStep, PracticeQuestion, Badge, ScoreRubric } from '@/types';

export const FRAMEWORK_STEPS: FrameworkStep[] = [
  {
    id: 'clarification',
    number: 1,
    title: 'Clarification',
    subtitle: 'Define the scope before diving in',
    description:
      'Before jumping to solutions, ensure you fully understand the problem. Ask clarifying questions to define constraints, goals, and context. This step prevents misaligned solutions and shows structured thinking.',
    keyQuestions: [
      'What product or feature are we discussing?',
      'Who is the primary user we are optimizing for?',
      'What is the business goal behind this question?',
      'Are there any constraints I should be aware of (technical, legal, time)?',
      'What does success look like for this exercise?',
    ],
    tips: [
      'Spend 2-3 minutes on clarification — not more',
      'State your assumptions explicitly if the interviewer skips answering',
      'Confirm the scope: are we improving an existing feature or building new?',
      'Ask about time horizon: short-term or long-term optimization?',
    ],
    examples: [
      '"Before I begin, let me ask a few clarifying questions to ensure I\'m solving the right problem."',
      '"I\'ll assume we\'re optimizing for existing users rather than acquisition — does that align with your thinking?"',
      '"Just to confirm the scope: we\'re talking about the mobile app, not the web experience, correct?"',
    ],
    icon: '◎',
    color: '#4A6FA5',
  },
  {
    id: 'segmentation',
    number: 2,
    title: 'Strategic Segmentation',
    subtitle: 'Behavior over demographics',
    description:
      'Segment users by behavior, not demographics. Understanding how different users interact with the product reveals where the real opportunity lies. Focus on behavioral patterns that indicate intent, frequency, and motivation.',
    keyQuestions: [
      'Who are the main user segments by behavior?',
      'Which segment represents the highest opportunity for impact?',
      'What is the core behavior we want to influence?',
      'How do power users differ from casual users?',
      'What triggers different users to engage with the product?',
    ],
    tips: [
      'Avoid demographic segmentation (age, gender) — prefer behavioral',
      'Think in terms of: frequency, intent, and stage in user journey',
      'Identify the segment that is underserved yet has high potential',
      'Name each segment descriptively (e.g., "The Occasional Explorer" vs "The Power Creator")',
    ],
    examples: [
      'Segment A: Daily active users who complete the core loop → optimize for retention',
      'Segment B: Weekly users who abandon mid-funnel → optimize for activation',
      'Segment C: Churned users who returned once → optimize for re-engagement',
    ],
    icon: '⬡',
    color: '#7C5CBF',
  },
  {
    id: 'problem',
    number: 3,
    title: 'Problem Identification',
    subtitle: 'Needs vs. pains — go deeper',
    description:
      'Distinguish between surface needs and deep pains. A need is what users say they want; a pain is what actually blocks them. Map the user journey to find friction points and emotional lows — this is where the best product opportunities live.',
    keyQuestions: [
      'What is the user trying to accomplish (the job to be done)?',
      'Where in the journey does friction occur?',
      'What is the emotional state at the moment of pain?',
      'Is this a need (conscious desire) or a pain (blocking problem)?',
      'How severe and frequent is this problem?',
    ],
    tips: [
      'Use the user journey map: Trigger → Action → Outcome → Reflection',
      'Ask "why" 3 times to get from surface need to root pain',
      'Prioritize problems that are both frequent AND severe',
      'State the problem as a "How Might We" (HMW) statement',
    ],
    examples: [
      'Need: "Users want more content recommendations"',
      'Pain: "Users feel overwhelmed by irrelevant content and can\'t find what matches their current mood"',
      'HMW: "How might we help users discover content that matches their emotional context in under 10 seconds?"',
    ],
    icon: '◈',
    color: '#C45E3E',
  },
  {
    id: 'solutions',
    number: 4,
    title: 'Solution Brainstorming',
    subtitle: 'Diverge wildly, then converge sharply',
    description:
      'Use the Double Diamond approach: first diverge with creative, even impossible ideas (magic thinking), then converge by applying real-world constraints. Present 3 distinct solutions with different effort/impact tradeoffs, then prioritize one.',
    keyQuestions: [
      'If we had unlimited resources and no constraints, what would the ideal solution be?',
      'What can we learn from adjacent industries or products?',
      'What is the simplest version of this solution (MVP)?',
      'Which solution best balances user value and business impact?',
      'What are the risks and failure modes of each solution?',
    ],
    tips: [
      'Always present exactly 3 solutions with different effort levels',
      'Start with "magic thinking" — remove all constraints temporarily',
      'Make solutions meaningfully different, not variations of the same idea',
      'Explicitly recommend one solution and justify why',
    ],
    examples: [
      'Solution 1 (Quick win): A/B test the CTA placement — 2 weeks, measurable',
      'Solution 2 (Medium-term): Redesign the onboarding flow with personalization — 2 months',
      'Solution 3 (Long-term): Build an AI recommendation engine — 6 months, high leverage',
    ],
    icon: '◇',
    color: '#2E7D52',
  },
  {
    id: 'metrics',
    number: 5,
    title: 'Metrics & Guardrails',
    subtitle: 'North Star, counters, and what to protect',
    description:
      'Define what success looks like with precision. Every solution needs a North Star metric that connects to the company mission, counter-metrics to prevent gaming, and guardrails to protect against collateral damage. The 30-day retention rate is often the queen metric for habit formation.',
    keyQuestions: [
      'What is the North Star metric for this solution?',
      'How does this metric connect to the company\'s mission?',
      'What counter-metrics prevent us from gaming the primary metric?',
      'What guardrails protect against unintended negative consequences?',
      'How will we know if the solution is working within 2 weeks?',
    ],
    tips: [
      'North Star = the one metric that captures core user value delivered',
      'Always pair a growth metric with a quality counter-metric',
      'Guardrails protect: safety, trust, experience of other user segments',
      '30-day retention = habit formation proxy — use it to prove stickiness',
    ],
    examples: [
      'North Star: Weekly Active Users who complete ≥1 social challenge',
      'Counter-metric: Completion rate (guards against low-quality challenges)',
      'Guardrail: Report rate must stay below 0.1% (protects community safety)',
      'Leading indicator: Day-7 retention as early signal before Day-30 data',
    ],
    icon: '★',
    color: '#B5860A',
  },
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q1',
    question: 'How would you improve Instagram Stories to increase engagement?',
    company: 'Meta',
    product: 'Instagram',
    difficulty: 'Medium',
    category: 'Improvement',
    tags: ['social', 'engagement', 'consumer'],
    hints: [
      'Consider different user segments: creators vs. passive viewers',
      'Think about the difference between producing and consuming Stories',
      'Engagement can mean many things — be specific about which type',
    ],
  },
  {
    id: 'q2',
    question: 'Design a feature to help Spotify users discover new music they\'ll love',
    company: 'Spotify',
    product: 'Spotify',
    difficulty: 'Medium',
    category: 'Design',
    tags: ['music', 'discovery', 'recommendation', 'consumer'],
    hints: [
      'Distinguish between active discovery (searching) vs. passive discovery (serendipity)',
      'Think about the emotional context of listening',
      'Consider social proof as a discovery mechanism',
    ],
  },
  {
    id: 'q3',
    question: 'How would you increase user retention on Duolingo?',
    company: 'Duolingo',
    product: 'Duolingo',
    difficulty: 'Easy',
    category: 'Retention',
    tags: ['education', 'retention', 'gamification', 'consumer'],
    hints: [
      'Duolingo already has strong gamification — what is missing?',
      'Think about the 3-day vs. 30-day retention difference',
      'Consider users who have lapsed — what would bring them back?',
    ],
  },
  {
    id: 'q4',
    question: 'Design a product to reduce food waste for grocery stores',
    company: 'Generic',
    product: 'New Product',
    difficulty: 'Hard',
    category: 'Design',
    tags: ['sustainability', 'b2b', 'marketplace', 'impact'],
    hints: [
      'Consider both sides: grocery stores and end consumers',
      'Think about timing — most waste happens at end of day',
      'Incentive alignment between store goals and customer behavior',
    ],
  },
  {
    id: 'q5',
    question: 'How would you improve the LinkedIn job search experience?',
    company: 'LinkedIn',
    product: 'LinkedIn',
    difficulty: 'Medium',
    category: 'Improvement',
    tags: ['b2b', 'career', 'search', 'professional'],
    hints: [
      'Different users: active seekers vs. passive seekers vs. recruiters',
      'The quality of a match matters more than quantity of results',
      'Think about the emotional journey of a job seeker',
    ],
  },
  {
    id: 'q6',
    question: 'Design an onboarding experience for a new fintech app targeting young adults',
    company: 'Generic',
    product: 'Fintech App',
    difficulty: 'Hard',
    category: 'Design',
    tags: ['fintech', 'onboarding', 'trust', 'consumer'],
    hints: [
      'Trust is the #1 barrier in fintech — how do you establish it fast?',
      'Time to first value is critical — what is the aha moment?',
      'Regulatory requirements create friction — how do you make them feel safe?',
    ],
  },
  {
    id: 'q7',
    question: 'How would you measure the success of Google Maps?',
    company: 'Google',
    product: 'Google Maps',
    difficulty: 'Easy',
    category: 'Metrics',
    tags: ['navigation', 'metrics', 'consumer', 'utility'],
    hints: [
      'Maps has multiple use cases: navigation, discovery, business listings',
      'Think about the difference between route accuracy and user satisfaction',
      'Consider both the journey (navigation) and the destination (discovery)',
    ],
  },
  {
    id: 'q8',
    question: 'How would you grow Airbnb in a new market with low host supply?',
    company: 'Airbnb',
    product: 'Airbnb',
    difficulty: 'Hard',
    category: 'Growth',
    tags: ['marketplace', 'growth', 'supply', 'international'],
    hints: [
      'Two-sided marketplace problem: you need both hosts and guests',
      'Host supply is the constraint — focus there first',
      'Local trust and cultural fit matter more in new markets',
    ],
  },
];

export const BADGES: Badge[] = [
  {
    id: 'first_exercise',
    name: 'First Step',
    description: 'Created your first exercise',
    icon: '◎',
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'first_completion',
    name: 'Framework Complete',
    description: 'Completed all 5 steps of an exercise',
    icon: '★',
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Practiced 3 days in a row',
    icon: '⚡',
    xpReward: 150,
    rarity: 'uncommon',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Practiced 7 days in a row',
    icon: '🔥',
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    name: 'Habit Formed',
    description: 'Practiced 30 days in a row — retention proven',
    icon: '♛',
    xpReward: 1000,
    rarity: 'legendary',
  },
  {
    id: 'perfect_score',
    name: 'Perfect Framework',
    description: 'Scored 100% on a self-evaluation',
    icon: '◈',
    xpReward: 250,
    rarity: 'rare',
  },
  {
    id: 'hard_mode',
    name: 'Hard Mode',
    description: 'Completed a Hard difficulty exercise',
    icon: '◆',
    xpReward: 200,
    rarity: 'uncommon',
  },
  {
    id: 'solutions_master',
    name: 'Solutions Master',
    description: 'Completed 10 exercises',
    icon: '◇',
    xpReward: 400,
    rarity: 'rare',
  },
  {
    id: 'metrics_guru',
    name: 'Metrics Guru',
    description: 'Achieved 90%+ score on Metrics step 5 times',
    icon: '⬡',
    xpReward: 350,
    rarity: 'rare',
  },
  {
    id: 'framework_master',
    name: 'Framework Master',
    description: 'Reached Level 10',
    icon: '♛',
    xpReward: 500,
    rarity: 'legendary',
  },
];

export const SCORE_RUBRICS: ScoreRubric[] = [
  {
    stepId: 'clarification',
    criteria: [
      { label: 'Scope Definition', description: 'Clearly defined what product/feature is in scope', maxPoints: 25 },
      { label: 'Assumption Clarity', description: 'Stated assumptions explicitly when not clarified', maxPoints: 25 },
      { label: 'Goal Alignment', description: 'Confirmed business goal and success definition', maxPoints: 25 },
      { label: 'Efficiency', description: 'Kept clarification concise and structured', maxPoints: 25 },
    ],
  },
  {
    stepId: 'segmentation',
    criteria: [
      { label: 'Behavioral Focus', description: 'Segmented by behavior, not just demographics', maxPoints: 25 },
      { label: 'Segment Definition', description: 'Each segment is clearly named and described', maxPoints: 25 },
      { label: 'Opportunity Sizing', description: 'Identified which segment has the highest impact potential', maxPoints: 25 },
      { label: 'Focus Selection', description: 'Chose one segment to focus on with clear rationale', maxPoints: 25 },
    ],
  },
  {
    stepId: 'problem',
    criteria: [
      { label: 'Depth of Analysis', description: 'Went beyond surface need to identify root pain', maxPoints: 25 },
      { label: 'User Journey Mapping', description: 'Mapped the journey to locate specific friction points', maxPoints: 25 },
      { label: 'Problem Framing', description: 'Framed problem as a "How Might We" statement', maxPoints: 25 },
      { label: 'Prioritization', description: 'Justified why this is the most important problem to solve', maxPoints: 25 },
    ],
  },
  {
    stepId: 'solutions',
    criteria: [
      { label: 'Solution Diversity', description: 'Presented 3 meaningfully different solutions', maxPoints: 25 },
      { label: 'Creative Thinking', description: 'Used divergent thinking before converging', maxPoints: 25 },
      { label: 'Tradeoff Analysis', description: 'Analyzed effort/impact for each solution', maxPoints: 25 },
      { label: 'Clear Recommendation', description: 'Recommended one solution with strong justification', maxPoints: 25 },
    ],
  },
  {
    stepId: 'metrics',
    criteria: [
      { label: 'North Star Clarity', description: 'Defined a precise, meaningful North Star metric', maxPoints: 25 },
      { label: 'Mission Connection', description: 'Connected metric to company mission', maxPoints: 25 },
      { label: 'Counter-metrics', description: 'Identified counter-metrics to prevent gaming', maxPoints: 25 },
      { label: 'Guardrails', description: 'Defined guardrails to protect against side effects', maxPoints: 25 },
    ],
  },
];

export const XP_PER_LEVEL = 500;

export function calculateLevel(xp: number): { level: number; xpToNextLevel: number; progressPercent: number } {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - xpInCurrentLevel;
  const progressPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
  return { level, xpToNextLevel, progressPercent };
}

export function calculateXpForExercise(score: number, difficulty: string, streak: number): number {
  const base = difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 150 : 200;
  const scoreMultiplier = score / 100;
  const streakBonus = Math.min(streak * 10, 50);
  return Math.round(base * scoreMultiplier + streakBonus);
}
