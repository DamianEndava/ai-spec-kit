import {
  getRequirementsUserTextPrompt,
  REQUIREMENTS_SYSTEM_PROMPT,
} from "@/app/api/requirements/route";
import { CATEGORY_GUIDELINES, SCHEMA_OPEN_AI } from "@/lib/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read file to Base64 (no external libs)
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: REQUIREMENTS_SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: file.name || "document.pdf",
              file_data: `data:application/pdf;base64,${base64}`,
            },
            {
              type: "input_text",
              text: getRequirementsUserTextPrompt(
                file.name || "document.pdf",
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
