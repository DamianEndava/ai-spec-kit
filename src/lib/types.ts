import { Category } from "@/lib/constants";

interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
}

export interface SpecDraft {
  context: string;
  goals: string[];
  technicalStack: TechStack;
}

interface Question {
  id: string;
  category: Category;
  question: string;
}

export interface SpecResponse {
  specDraft: SpecDraft;
  questionsToAsk: Question[];
}

export interface ChatMessage {
  id: string;
  questionId: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}
