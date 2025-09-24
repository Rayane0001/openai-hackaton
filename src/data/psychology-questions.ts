// @file src/data/psychology-questions.ts
// Psychology assessment questions for 3-tier system

import { AssessmentQuestion } from '@/lib/types';

export const assessmentQuestions: AssessmentQuestion[] = [
    // TIER 1 - Essential (2 minutes) - 60% precision
    {
        id: 'age',
        tier: 1,
        category: 'background',
        question: 'What is your age?',
        type: 'text',
        required: true
    },
    {
        id: 'occupation',
        tier: 1,
        category: 'background',
        question: 'What best describes your current situation?',
        type: 'multiple',
        options: ['Student', 'Employee', 'Entrepreneur', 'Freelancer', 'Unemployed', 'Retired'],
        required: true
    },
    {
        id: 'decision_urgency',
        tier: 1,
        category: 'background',
        question: 'How quickly do you typically need to make important decisions?',
        type: 'multiple',
        options: ['Very quickly (days)', 'Moderately (weeks)', 'Slowly (months)', 'Very slowly (years)'],
        required: true
    },
    {
        id: 'risk_tolerance',
        tier: 1,
        category: 'personality',
        question: 'How comfortable are you with taking risks? (1 = Very uncomfortable, 5 = Love taking risks)',
        type: 'scale',
        required: true
    },
    {
        id: 'decision_style',
        tier: 1,
        category: 'personality',
        question: 'Which describes your decision-making style best?',
        type: 'multiple',
        options: ['Analytical - I need lots of data', 'Intuitive - I trust my gut', 'Balanced - Mix of both', 'Spontaneous - I decide quickly'],
        required: true
    },

    // TIER 2 - Enhanced (5 minutes total) - 80% precision
    {
        id: 'openness',
        tier: 2,
        category: 'personality',
        question: 'I enjoy trying new experiences and ideas (1 = Strongly disagree, 5 = Strongly agree)',
        type: 'scale',
        required: false
    },
    {
        id: 'conscientiousness',
        tier: 2,
        category: 'personality',
        question: 'I am organized and methodical in my approach (1 = Strongly disagree, 5 = Strongly agree)',
        type: 'scale',
        required: false
    },
    {
        id: 'extraversion',
        tier: 2,
        category: 'personality',
        question: 'I gain energy from being around other people (1 = Strongly disagree, 5 = Strongly agree)',
        type: 'scale',
        required: false
    },
    {
        id: 'agreeableness',
        tier: 2,
        category: 'personality',
        question: 'I prioritize harmony and cooperation with others (1 = Strongly disagree, 5 = Strongly agree)',
        type: 'scale',
        required: false
    },
    {
        id: 'neuroticism',
        tier: 2,
        category: 'personality',
        question: 'I often feel stressed or anxious about decisions (1 = Strongly disagree, 5 = Strongly agree)',
        type: 'scale',
        required: false
    },
    {
        id: 'core_values',
        tier: 2,
        category: 'values',
        question: 'What matters most to you? (Select up to 3)',
        type: 'multiple',
        options: ['Family', 'Career Success', 'Financial Security', 'Adventure', 'Creativity', 'Health', 'Independence', 'Social Impact', 'Learning'],
        required: false
    },
    {
        id: 'life_priorities',
        tier: 2,
        category: 'goals',
        question: 'In the next 5 years, what is your biggest priority?',
        type: 'multiple',
        options: ['Build wealth', 'Find love/relationships', 'Advance career', 'Improve health', 'Travel/experiences', 'Start a family', 'Learn new skills'],
        required: false
    },

    // TIER 3 - Deep Analysis (10 minutes total) - 95% precision
    {
        id: 'biggest_fear',
        tier: 3,
        category: 'fears',
        question: 'What is your biggest fear when making major life decisions?',
        type: 'multiple',
        options: ['Making the wrong choice', 'Disappointing others', 'Financial loss', 'Missing out on opportunities', 'Being judged', 'Uncertainty about the future'],
        required: false
    },
    {
        id: 'past_regrets',
        tier: 3,
        category: 'fears',
        question: 'Looking back, do you regret decisions you made or decisions you didn\'t make?',
        type: 'multiple',
        options: ['Regret actions I took', 'Regret chances I didn\'t take', 'Both equally', 'Neither - no regrets'],
        required: false
    },
    {
        id: 'decision_confidence',
        tier: 3,
        category: 'personality',
        question: 'How confident do you typically feel about your major life decisions? (1 = Very unconfident, 5 = Very confident)',
        type: 'scale',
        required: false
    },
    {
        id: 'external_validation',
        tier: 3,
        category: 'personality',
        question: 'How important is it that others approve of your decisions? (1 = Not important, 5 = Very important)',
        type: 'scale',
        required: false
    },
    {
        id: 'ideal_future',
        tier: 3,
        category: 'goals',
        question: 'Describe your ideal life in 10 years (one sentence)',
        type: 'text',
        required: false
    },
    {
        id: 'decision_patterns',
        tier: 3,
        category: 'personality',
        question: 'When facing tough decisions, I usually...',
        type: 'multiple',
        options: ['Research extensively', 'Ask friends/family for advice', 'Sleep on it', 'Make pros/cons lists', 'Trust my first instinct', 'Avoid deciding as long as possible'],
        required: false
    }
];

export const getTierQuestions = (tier: 1 | 2 | 3): AssessmentQuestion[] => {
    return assessmentQuestions.filter((q: AssessmentQuestion) => q.tier <= tier);
};

export const getQuestionsByCategory = (category: string): AssessmentQuestion[] => {
    return assessmentQuestions.filter((q: AssessmentQuestion) => q.category === category);
};