import {
  ANALYZE_SYSTEM_PROMPT,
  getAnalyzeUserTextPrompt,
  SCHEMA_OPEN_AI,
} from "@/lib/constants";
import OpenAI from "openai";

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
      model: "gpt-5",
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
              text: getAnalyzeUserTextPrompt(requirementsText),
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
