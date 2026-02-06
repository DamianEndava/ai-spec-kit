export const REQUIREMENT_LOCAL_STORAGE_KEY = "requirement_payload";

export const CATEGORY_VALUES = [
  "context",
  "goals",
  "technicalStackMobile",
] as const;

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
      "Business & product context for the mobile app: who it's for, the problem being solved, and where it fits in the product ecosystem.",
    mustHave: [
      "Problem statement and current pain points (mobile-specific)",
      "Primary target users / personas and device usage patterns",
      "Core user journeys / happy path + error/edge flows for mobile",
      "In-scope vs out-of-scope features for MVP (mobile-first decisions)",
      "Relationship to existing web/backend systems and dependencies",
      "Legal/privacy constraints and required permissions (GDPR, COPPA, etc.)",
      "Assumptions, open questions and key project risks",
    ],
  },
  {
    category: "goals",
    shortDescription:
      "Measurable business and product goals for the mobile app and how we'll judge success.",
    mustHave: [
      "Top business outcomes (engagement, retention, revenue, support reduction)",
      "Success metrics / KPIs and target values (DAU/MAU, retention, crash-free users)",
      "Priority ordering of goals (MVP vs later phases)",
      "Primary stakeholders and decision owners (product, mobile engineering, security)",
      "Launch milestones, app-store submission windows, and release cadence",
      "Definition of done for MVP and acceptance criteria for later phases",
    ],
  },
  {
    category: "technicalStackMobile",
    shortDescription:
      "Mobile-specific technology constraints, platform choices and operational concerns.",
    mustHave: [
      "Target platforms and minimum OS versions (iOS / Android, versions / device families)",
      "UI/UX constraints and design system guidance (native vs shared components)",
      "Framework / language preferences (native Swift/Kotlin, React Native, Flutter, etc.)",
      "Offline support / data sync strategy and local storage choice (SQLite, Realm)",
      "Push notifications, background tasks, and platform limitations",
      "Permissions required (location, camera, contacts) and privacy handling",
      "Backend / API expectations (GraphQL/REST, realtime, websockets) and integrations",
      "App distribution and release constraints (App Store, Play Store, internal testing)",
      "Security requirements (keychain/keystore, secure storage, certificate pinning)",
      "Non-functional requirements (performance, memory, battery, startup time)",
      "Testing & QA approach (unit, integration, E2E on emulators and real devices)",
      "CI/CD / build & signing pipeline requirements and tooling",
      "Analytics & monitoring (crash reporting, usage analytics, logging)",
      "Operational requirements (monitoring, SLOs, rollback strategy)",
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
        technicalStackMobile: {
          type: "object",
          additionalProperties: false,
          properties: {
            platforms: { type: "array", items: { type: "string" } }, // e.g., ["iOS (>=16)", "Android (>=12)"]
            frameworks: { type: "array", items: { type: "string" } }, // e.g., ["SwiftUI", "React Native"]
            uiGuidelines: { type: "array", items: { type: "string" } }, // design system / accessibility notes
            offlineAndStorage: { type: "array", items: { type: "string" } },
            notificationsAndBackground: {
              type: "array",
              items: { type: "string" },
            },
            permissions: { type: "array", items: { type: "string" } },
            backendIntegrations: { type: "array", items: { type: "string" } },
            security: { type: "array", items: { type: "string" } },
            testingAndCI: { type: "array", items: { type: "string" } },
            analyticsAndMonitoring: {
              type: "array",
              items: { type: "string" },
            },
            releaseAndDistribution: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "platforms",
            "frameworks",
            "uiGuidelines",
            "offlineAndStorage",
            "notificationsAndBackground",
            "permissions",
            "backendIntegrations",
            "security",
            "testingAndCI",
            "analyticsAndMonitoring",
            "releaseAndDistribution",
          ],
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
