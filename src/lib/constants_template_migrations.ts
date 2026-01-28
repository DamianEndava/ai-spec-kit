export const REQUIREMENT_LOCAL_STORAGE_KEY = "requirement_payload";

export const CATEGORY_VALUES = [
  "migrationContext",
  "sourceAndTargetSystems",
  "migrationStrategy",
  "dataAndIntegration",
] as const;

export type Category = (typeof CATEGORY_VALUES)[number];

type CategoryGuideline = {
  category: Category;
  shortDescription: string;
  mustHave: string[]; // requirements checklist used to generate questions
};

export const CATEGORY_GUIDELINES: CategoryGuideline[] = [
  {
    category: "migrationContext",
    shortDescription:
      "Explain why the migration is needed, what business or technical problems it solves, and what constraints or drivers influence the migration.",
    mustHave: [
      "Reason for migration (business, technical, regulatory)",
      "Current pain points and limitations of the existing system",
      "Business impact if migration is delayed or fails",
      "In-scope and out-of-scope for the migration",
      "Key stakeholders and ownership",
    ],
  },
  {
    category: "sourceAndTargetSystems",
    shortDescription:
      "Describe the existing (source) system and the future (target) system, including functional and architectural differences.",
    mustHave: [
      "Source system overview (architecture, tech stack, vendor)",
      "Target system overview (architecture, tech stack, vendor)",
      "Key functional differences and gaps",
      "Dependencies on other systems",
      "Known constraints or limitations of either system",
    ],
  },
  {
    category: "migrationStrategy",
    shortDescription:
      "Define how the migration will be executed, including approach, phases, risk mitigation, and rollback.",
    mustHave: [
      "Migration approach (big bang, phased, parallel run)",
      "Cutover strategy and downtime expectations",
      "Rollback or fallback plan",
      "Risk assessment and mitigation strategy",
      "Testing and validation approach",
    ],
  },
  {
    category: "dataAndIntegration",
    shortDescription:
      "Describe how data and integrations will be migrated, validated, and maintained during and after the transition.",
    mustHave: [
      "Data scope and volume to be migrated",
      "Data mapping and transformation rules",
      "Data quality checks and validation criteria",
      "Integration changes (APIs, events, batch jobs)",
      "Post-migration data reconciliation and monitoring",
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
        migrationContext: { type: "string" },
        sourceAndTargetSystems: {
          type: "object",
          additionalProperties: false,
          properties: {
            source: { type: "string" },
            target: { type: "string" },
          },
          required: ["source", "target"],
        },
        migrationStrategy: {
          type: "object",
          additionalProperties: false,
          properties: {
            approach: { type: "string" },
            cutover: { type: "string" },
            rollback: { type: "string" },
          },
          required: ["approach", "cutover", "rollback"],
        },
        dataAndIntegration: {
          type: "object",
          additionalProperties: false,
          properties: {
            data: { type: "array", items: { type: "string" } },
            integrations: { type: "array", items: { type: "string" } },
          },
          required: ["data", "integrations"],
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
