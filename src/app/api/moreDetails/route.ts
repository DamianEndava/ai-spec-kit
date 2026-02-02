import { CATEGORY_GUIDELINES, SCHEMA_OPEN_AI } from "@/lib/constants";
import OpenAI from "openai";

const ANALYZE_SYSTEM_PROMPT =
  "You are a senior Business Analyst in a software development team. " +
  "You will receive a previously generated JSON that matches the schema, plus a single answer to one question. " +
  "Do NOT invent facts. If unknown: context='', arrays=[]. " +
  "Generate questionsToAsk based on category guidelines and missing/ambiguous info. " +
  "Rules for questionsToAsk: " +
  "(1) Ask only questions that are NOT answered in the input text. " +
  "(2) Questions must be specific and actionable (no generic 'please clarify'). " +
  "(3) Ensure IDs are unique and follow q-<category>-<number>, numbering starts at 1 per category. " +
  "(4) Add 1 questions per category IF there are meaningful gaps; otherwise 0 for that category.";

function getAnalyzeUserTextPrompt(
  requirementsText: any,
  categoryGuidelines: any,
): string {
  return (
    "Previously generated JSON (schema-compliant) with Answered question:\n" +
    JSON.stringify(requirementsText) +
    "\n\nCategory guidelines for generating questions (shortDescription + mustHave checklist):\n" +
    JSON.stringify(categoryGuidelines) +
    "\n\nOutput requirements:\n" +
    "- Return ONLY valid JSON matching the schema.\n" +
    "- For missing/unclear items, leave specDraft fields empty and generate questionsToAsk.\n"
  );
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { requirementsText } = await req.json();

    if (!requirementsText) {
      return Response.json(
        { error: "Missing 'requirementsText' (string)." },
        { status: 400 },
      );
    }

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: ANALYZE_SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: getAnalyzeUserTextPrompt(
                requirementsText,
                CATEGORY_GUIDELINES,
              ),
            },
          ],
        },
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
