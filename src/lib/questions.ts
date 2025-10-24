export interface Question {
  id: number;
  text: string;
}

export interface Dimension {
  name: string;
  questionIds: number[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Members who are not reps identify issues, plan to solve them together, and ask for help if they need it.",
  },
  {
    id: 2,
    text: "Reps consult members before responding to management actions on their behalf.",
  },
  {
    id: 3,
    text: "It's more important to focus on winning for members than to spend time on mapping out the details of where and who they are.",
  },
  {
    id: 4,
    text: "Reps solve problems on their members' behalf.",
  },
  {
    id: 5,
    text: "Word-of-mouth is the best way to share updates, messages, and campaign materials within the workplace.",
  },
  {
    id: 6,
    text: "The national union should focus on lobbying policymakers and employers to improve conditions across the sector.",
  },
  {
    id: 7,
    text: "Members should contact the union when issues arise, trusting reps to respond and support.",
  },
  {
    id: 8,
    text: "Recruitment and organising are part of everything the union does.",
  },
  {
    id: 9,
    text: "Members should value the union as an independent third party in the workplace.",
  },
  {
    id: 10,
    text: "The union should provide regular updates, guidance, and policy information to members.",
  },
  {
    id: 11,
    text: "Negotiations should always involve as many members as possible.",
  },
  {
    id: 12,
    text: "The best way to recruit members is to tell them about the benefits and support they gain by joining.",
  },
  {
    id: 13,
    text: "Consultation and negotiation meetings are where the union wins for members.",
  },
  {
    id: 14,
    text: "Reps are responsible for taking actions on members' behalf.",
  },
  {
    id: 15,
    text: "Staff deserve for their union to get the best results for them possible and to be frustrated if it doesn't.",
  },
  {
    id: 16,
    text: "One-to-one conversations are the best way to build the union.",
  },
  {
    id: 17,
    text: "Campaigning should be directed at staff, not management.",
  },
  {
    id: 18,
    text: "Reps and officials should not see formal negotiation meetings as a priority.",
  },
  {
    id: 19,
    text: "If members have an issue, they should get in touch with a rep to handle it.",
  },
  {
    id: 20,
    text: "Industrial action should be led by members as part of a series of actions to achieve a goal.",
  },
  {
    id: 21,
    text: "Decision-making and strategic planning is the responsibility of every member.",
  },
  {
    id: 22,
    text: "Training on employment law and policy should not be a top priority for reps.",
  },
  {
    id: 23,
    text: "Members should be able to get value for money out of their membership.",
  },
  {
    id: 24,
    text: "Members think positively and proudly of their union.",
  },
  {
    id: 25,
    text: "Reps and officials set the union agenda, and seek members' input to deliver it.",
  },
  {
    id: 26,
    text: "Members are paying a subscription and so their union should give them a good service.",
  },
  {
    id: 27,
    text: "Skilled and well-informed negotiation by reps and officials is unlikely to achieve significant wins.",
  },
  {
    id: 28,
    text: "Union activity should happen both in work and outside of work hours.",
  },
  {
    id: 29,
    text: "Members should identify issues early, plan together, and take initiative to improve conditions.",
  },
  {
    id: 30,
    text: "Recruiting is important, but not always a part of the union's day-to-day work.",
  },
  {
    id: 31,
    text: "Stalls, drop-ins, and membership offers are some of the best ways to recruit members.",
  },
  {
    id: 32,
    text: "When negotiations reach an impasse, reps should ask members to take industrial action.",
  },
];

export const reverseKeyed = [3, 9, 13, 14, 22, 27, 18, 31];

export const dimensions: Dimension[] = [
  {
    name: "Servicing",
    questionIds: [26, 12, 15, 23, 10, 22, 6, 19],
  },
  {
    name: "Organising",
    questionIds: [14, 3, 28, 16, 8, 21, 9, 5],
  },
  {
    name: "Campaigning",
    questionIds: [1, 31, 24, 11, 29, 17, 13, 20],
  },
  {
    name: "Advocating",
    questionIds: [4, 30, 27, 2, 7, 25, 32, 18],
  },
];

export const scaleOptions = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Slightly disagree" },
  { value: 4, label: "Slightly agree" },
  { value: 5, label: "Agree" },
  { value: 6, label: "Strongly agree" },
];

export interface QuizResponse {
  [questionId: number]: number;
}

export interface DimensionScore {
  dimension: string;
  score: number;
  maxScore: number;
  totalPossibleScore: number;
  answeredCount: number;
  totalCount: number;
}

export function calculateDimensionScores(
  responses: QuizResponse
): DimensionScore[] {
  return dimensions.map((dimension) => {
    const answeredQuestions = dimension.questionIds.filter(
      (questionId) => responses[questionId] !== undefined
    );

    const score = answeredQuestions.reduce((sum, questionId) => {
      const rawScore = responses[questionId] || 0;
      // Invert score for reverse-keyed questions (1->6, 2->5, 3->4, 4->3, 5->2, 6->1)
      const adjustedScore = reverseKeyed.includes(questionId)
        ? 7 - rawScore
        : rawScore;
      return sum + adjustedScore;
    }, 0);

    const maxScore = answeredQuestions.length * 6; // Only count answered questions
    const totalPossibleScore = dimension.questionIds.length * 6; // Total possible if all answered

    return {
      dimension: dimension.name,
      score,
      maxScore,
      totalPossibleScore,
      answeredCount: answeredQuestions.length,
      totalCount: dimension.questionIds.length,
    };
  });
}
