interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  infra: string[];
}

interface SpecDraft {
  context: string;
  businessGoals: string[];
  techStack: TechStack;
}

interface Question {
  id: string;
  category: "context" | "businessGoals" | "techStack";
  question: string;
}
interface AnsweredQuestion {
  id: string;
  answer: string;
}

export interface SpecResponse {
  specDraft: SpecDraft;
  questionsToAsk: Question[];
  aswerQuestion?: AnsweredQuestion;
}
