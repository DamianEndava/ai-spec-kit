type Category = "context" | "businessGoals" | "techStack";

type CategoryGuideline = {
  category: Category;
  shortDescription: string;
  mustHave: string[]; // requirements checklist used to generate questions
};

export const CATEGORY_GUIDELINES: CategoryGuideline[] = [
  {
    category: "context",
    shortDescription:
      "Define the business and system context: what problem we solve, for whom, and where the solution fits (as-is/to-be, boundaries).",
    mustHave: [
      "Problem statement and current pain points",
      "Target users / roles / personas",
      //   "In-scope and out-of-scope boundaries",
      //   "Key workflows / scenarios (happy path + exceptions)",
      //   "Dependencies on other systems/processes",
      //   "Constraints (legal, data residency, internal policies)",
      //   "Assumptions and risks",
    ],
  },
  {
    category: "businessGoals",
    shortDescription:
      "Define measurable business outcomes and success criteria so we can validate value delivery.",
    mustHave: [
      "Top business goals (outcomes, not features)",
      "Success metrics / KPIs and target values",
      //   "Priorities / ordering of goals",
      //   "Stakeholders and decision makers",
      //   "Time constraints / milestones",
      //   "Definition of done for MVP vs later phases",
    ],
  },
  {
    category: "techStack",
    shortDescription:
      "Define technology constraints and preferences (or propose options) for frontend, backend, database, and infrastructure.",
    mustHave: [
      "Frontend constraints/preferences (framework, UI library, browser support)",
      "Backend constraints/preferences (language, framework, API style)",
      //   "Database needs (relational vs NoSQL, volume, consistency, reporting)",
      //   "Infra/hosting constraints (cloud provider, regions, on-prem, containers)",
      //   "Security requirements (authN/authZ, encryption, secrets management)",
      //   "Integrations (SSO, CRM/ERP, payments, messaging, analytics)",
      //   "Non-functional requirements impacting tech (performance, availability, scalability)",
      //   "Operational requirements (monitoring, logging, CI/CD)",
    ],
  },
];

export const SCHEMA_OPEN_AI = {
  type: "object",
  additionalProperties: false,
  properties: {
    specDraft: {
      type: "object",
      additionalProperties: false,
      properties: {
        context: { type: "string" },
        businessGoals: { type: "array", items: { type: "string" } },
        techStack: {
          type: "object",
          additionalProperties: false,
          properties: {
            frontend: { type: "array", items: { type: "string" } },
            backend: { type: "array", items: { type: "string" } },
            database: { type: "array", items: { type: "string" } },
            infra: { type: "array", items: { type: "string" } },
          },
          required: ["frontend", "backend", "database", "infra"],
        },
      },
      required: ["context", "businessGoals", "techStack"],
    },
    questionsToAsk: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          category: {
            type: "string",
            enum: ["context", "businessGoals", "techStack"],
          },
          question: { type: "string" },
        },
        required: ["id", "category", "question"],
      },
    },
  },
  required: ["specDraft", "questionsToAsk"],
} as const;

export const REQUIREMENTS_SYSTEM_PROMPT =
  "You are a senior Business Analyst in a software development team. " +
  "Convert unstructured requirements into a structured spec draft JSON matching the schema. " +
  "Do NOT invent facts. If unknown: context='', arrays=[]. " +
  "Generate questionsToAsk based on category guidelines and missing/ambiguous info. " +
  "Rules for questionsToAsk: " +
  "(1) Ask only questions that are NOT answered in the input text. " +
  "(2) Questions must be specific and actionable (no generic 'please clarify'). " +
  "(3) Ensure IDs are unique and follow q-<category>-<number>, numbering starts at 1 per category. " +
  "(4) Add 1 question per category IF there are meaningful gaps; otherwise 0 for that category.";

export function getRequirementsUserTextPrompt(
  requirementsText: any,
  categoryGuidelines: any,
): string {
  return (
    "Unstructured requirements:\n" +
    requirementsText +
    "\n\nCategory guidelines for generating questions (shortDescription + mustHave checklist):\n" +
    JSON.stringify(categoryGuidelines, null, 2) +
    "\n\nOutput requirements:\n" +
    "- Return ONLY valid JSON matching the schema.\n" +
    "- Fill specDraft only with information supported by the input.\n" +
    "- For missing/unclear items, leave specDraft fields empty and generate questionsToAsk.\n"
  );
}

export const ANALYZE_SYSTEM_PROMPT =
  "You are a senior Business Analyst in a software development team. " +
  "You will receive a previously generated JSON that matches the schema, plus a single answer to one question. " +
  "Your job is to update the JSON strictly based on that answer, without inventing facts. " +
  "Rules: " +
  "(1) Use the provided answer ONLY to enrich/modify specDraft fields that it directly supports. " +
  "(2) You MUST remove from questionsToAsk the question whose id matches answeredQuestion.id. " +
  "This question must NOT appear in the output under any circumstances. " +
  "(3) Re-evaluate the remaining questions: keep only those still unanswered/needed. " +
  "(4) Preserve the schema exactly (no extra fields). " +
  "(5) If the answer is unclear or does not provide actionable facts, do not force updates—keep specDraft as-is. " +
  "(6) Question IDs must remain unique and follow q-<category>-<number> (numbering starts at 1 per category). " +
  "(7) STRICT Q&A MODE: You MUST NOT add any new questionsToAsk in this step. " +
  "Only delete the answered one and keep the rest as-is (except you may remove questions that are now answered by the new information).";

export function getAnalyzeUserTextPrompt(requirementsText: any): string {
  return (
    "Previously generated JSON (schema-compliant) with Answered question:\n" +
    JSON.stringify(requirementsText, null, 2) +
    "\n\nOutput requirements:\n" +
    "- Return ONLY valid JSON matching the schema.\n" +
    "- Update specDraft only with information supported by the provided answer.\n" +
    "- Remove the answered question by id from questionsToAsk.\n" +
    "- Keep/adjust remaining questions so they are still relevant and unanswered.\n" +
    "- DO NOT add any new questions in this step (strict Q&A mode).\n"
  );
}
