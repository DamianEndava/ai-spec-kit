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
