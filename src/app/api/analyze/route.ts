import { SCHEMA_OPEN_AI } from "@/lib/constans";
import OpenAI from "openai";

export const runtime = "nodejs";

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

    const systemText =
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

    const userText =
      "Previously generated JSON (schema-compliant) with Answered question:\n" +
      JSON.stringify(requirementsText, null, 2) +
      "\n\nOutput requirements:\n" +
      "- Return ONLY valid JSON matching the schema.\n" +
      "- Update specDraft only with information supported by the provided answer.\n" +
      "- Remove the answered question by id from questionsToAsk.\n" +
      "- Keep/adjust remaining questions so they are still relevant and unanswered.\n" +
      "- DO NOT add any new questions in this step (strict Q&A mode).\n";

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
