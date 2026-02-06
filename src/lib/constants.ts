export const REQUIREMENT_LOCAL_STORAGE_KEY = "requirement_payload";

export const CATEGORY_VALUES = ["context", "goals", "technicalStack"] as const;

export type Category = (typeof CATEGORY_VALUES)[number];

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
      "In-scope and out-of-scope boundaries",
      "Key workflows / scenarios (happy path + exceptions)",
      "Dependencies on other systems/processes",
      "Constraints (legal, data residency, internal policies)",
      "Assumptions and risks",
    ],
  },
  {
    category: "goals",
    shortDescription:
      "Define measurable business outcomes and success criteria so we can validate value delivery.",
    mustHave: [
      "Top business goals (outcomes, not features)",
      "Success metrics / KPIs and target values",
      "Priorities / ordering of goals",
      "Stakeholders and decision makers",
      "Time constraints / milestones",
      "Definition of done for MVP vs later phases",
    ],
  },
  {
    category: "technicalStack",
    shortDescription:
      "Define technology constraints and preferences (or propose options) for frontend, backend, database, and infrastructure.",
    mustHave: [
      "Frontend constraints/preferences (framework, UI library, browser support)",
      "Backend constraints/preferences (language, framework, API style)",
      "Database needs (relational vs NoSQL, volume, consistency, reporting)",
      "Infra/hosting constraints (cloud provider, regions, on-prem, containers)",
      "Security requirements (authN/authZ, encryption, secrets management)",
      "Integrations (SSO, CRM/ERP, payments, messaging, analytics)",
      "Non-functional requirements impacting tech (performance, availability, scalability)",
      "Operational requirements (monitoring, logging, CI/CD)",
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
        goals: { type: "array", items: { type: "string" } },
        technicalStack: {
          type: "object",
          additionalProperties: false,
          properties: {
            frontend: { type: "array", items: { type: "string" } },
            backend: { type: "array", items: { type: "string" } },
            database: { type: "array", items: { type: "string" } },
            infrastructure: { type: "array", items: { type: "string" } },
          },
          required: ["frontend", "backend", "database", "infrastructure"],
        },
      },
      required: CATEGORY_VALUES,
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
            enum: CATEGORY_VALUES,
          },
          question: { type: "string" },
        },
        required: ["id", "category", "question"],
      },
    },
  },
  required: ["specDraft", "questionsToAsk"],
} as const;

export const MODEL = "gpt-4.1-mini";
