import { SCHEMA_OPEN_AI } from "@/lib/constans";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Category = "context" | "businessGoals" | "techStack";

type CategoryGuideline = {
  category: Category;
  shortDescription: string;
  mustHave: string[]; // requirements checklist used to generate questions
};

const CATEGORY_GUIDELINES: CategoryGuideline[] = [
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

export async function POST(req: Request) {
  try {
    const { requirementsText } = await req.json();

    if (!requirementsText || typeof requirementsText !== "string") {
      return Response.json(
        { error: "Missing 'requirementsText' (string)." },
        { status: 400 },
      );
    }

    const systemText =
      "You are a senior Business Analyst in a software development team. " +
      "Convert unstructured requirements into a structured spec draft JSON matching the schema. " +
      "Do NOT invent facts. If unknown: context='', arrays=[]. " +
      "Generate questionsToAsk based on category guidelines and missing/ambiguous info. " +
      "Rules for questionsToAsk: " +
      "(1) Ask only questions that are NOT answered in the input text. " +
      "(2) Questions must be specific and actionable (no generic 'please clarify'). " +
      "(3) Ensure IDs are unique and follow q-<category>-<number>, numbering starts at 1 per category. " +
      "(4) Add at least 2 questions per category IF there are meaningful gaps; otherwise 0 for that category.";

    const userText =
      "Unstructured requirements:\n" +
      requirementsText +
      "\n\nCategory guidelines for generating questions (shortDescription + mustHave checklist):\n" +
      JSON.stringify(CATEGORY_GUIDELINES, null, 2) +
      "\n\nOutput requirements:\n" +
      "- Return ONLY valid JSON matching the schema.\n" +
      "- Fill specDraft only with information supported by the input.\n" +
      "- For missing/unclear items, leave specDraft fields empty and generate questionsToAsk.\n";

    const resp = await client.responses.create({
      model: "gpt-5",
      input: [
        { role: "system", content: [{ type: "input_text", text: systemText }] },
        { role: "user", content: [{ type: "input_text", text: userText }] },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "spec_draft",
          strict: true,
          schema: SCHEMA_OPEN_AI,
        },
      },
    });

    const jsonText = resp.output_text?.trim() || "{}";
    const parsed = JSON.parse(jsonText);

    return Response.json(parsed);
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Server error" },
      { status: 500 },
    );
  }
}
