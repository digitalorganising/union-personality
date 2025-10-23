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
    text: "Members identify issues, plan to solve them together, and ask for help if they need it.",
  },
  {
    id: 2,
    text: "The union responds to management actions to make sure that changes reflect members' interests.",
  },
  {
    id: 3,
    text: "Members and reps continually assess where they hold power in the workplace, who their biggest champions are and where they are weak.",
  },
  {
    id: 4,
    text: "Reps advise members that the union will try to solve problems on their behalf.",
  },
  {
    id: 5,
    text: "Members develop and share updates, messages, and campaign materials within the workplace.",
  },
  {
    id: 6,
    text: "National union teams lobby policymakers and employers to improve working conditions across the sector.",
  },
  {
    id: 7,
    text: "Members contact the union when issues arise, trusting it to respond and support.",
  },
  {
    id: 8,
    text: "Recruitment and organising are two separate but integrated core activities of the union.",
  },
  {
    id: 9,
    text: "Members identify with the union and contribute to it; an attack on the union is an attack on themselves.",
  },
  {
    id: 10,
    text: "Communications from the union provide regular updates, guidance, and policy information to members.",
  },
  {
    id: 11,
    text: "Negotiations are shaped by active member participation and involvement.",
  },
  {
    id: 12,
    text: "The best way to recruit members is to tell them about the benefits and support they gain by joining.",
  },
  {
    id: 13,
    text: "Change is mostly achieved outside of formal consultation and negotiation meetings.",
  },
  {
    id: 14,
    text: "Members see themselves as the union and take action themselves.",
  },
  {
    id: 15,
    text: "Staff in the workplace feel frustrated by the union when it doesn't get the results they want.",
  },
  {
    id: 16,
    text: "Members are encouraged to build the union through one-to-one conversations.",
  },
  {
    id: 17,
    text: "Campaigns primarily engage with staff, rather than being directed at management.",
  },
  {
    id: 18,
    text: "What reps and officials say in negotiations makes or breaks the results.",
  },
  {
    id: 19,
    text: "If members want an issue to be raised with management, they should get in touch with a rep to do so.",
  },
  {
    id: 20,
    text: "Industrial action is an end-point of decisions and actions taken by members.",
  },
  {
    id: 21,
    text: "Members share decisions and solve problems together with union reps and officials.",
  },
  {
    id: 22,
    text: "Training focuses on employment law, procedures, and policy enforcement.",
  },
  {
    id: 23,
    text: "Members are concerned about getting value for money out of their membership.",
  },
  {
    id: 24,
    text: "Members think of the union as a positive and active force.",
  },
  {
    id: 25,
    text: "Reps and officials set the union agenda and involve members in delivering it.",
  },
  {
    id: 26,
    text: "The union is a service which members pay a subscription to access.",
  },
  {
    id: 27,
    text: "Results are achieved through reps making well-informed and reasoned arguments to change policies and other management actions.",
  },
  {
    id: 28,
    text: "Union activity happens both in work and outside of work hours.",
  },
  {
    id: 29,
    text: "Members identify issues early, plan together, and take initiative to improve conditions.",
  },
  {
    id: 30,
    text: "Recruiting is an activity that the union carries out separately to other day-to-day work.",
  },
  {
    id: 31,
    text: "Recruitment is achieved primarily through members establishing contacts, finding natural leaders and uncovering issues.",
  },
  {
    id: 32,
    text: "When negotiations reach an impasse, reps ask members to take industrial action for resolution.",
  },
];

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
      return sum + (responses[questionId] || 0);
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
