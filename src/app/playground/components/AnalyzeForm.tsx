"use client";

import { useEffect, useState } from "react";

interface RespFromOpenAiType {
  specDraft: {
    context: string;
    businessGoals: string[];
    techStack: {
      frontend: string[];
      backend: string[];
      database: never[];
      infra: string[];
    };
  };
  questionsToAsk: {
    id: string;
    category: string;
    question: string;
  }[];
  aswerQuestion?: {
    id: string;
    answer: string;
  };
}

const respFromOpenAi: RespFromOpenAiType = {
  specDraft: {
    context:
      "Build an AI chatbot for business analysts and tech leads that converts requirements interviews into a complete, standardized SpecKit. The solution includes a simple chat UI and a SpecKit generation engine that outputs Markdown and JSON. Frontend and backend are built in Next.js communicating via REST, integrated with the OpenAI API, and deployed on AWS. No database is planned.",
    businessGoals: [
      "Create an AI chatbot that turns a requirements interview into a complete, standardized SpecKit",
    ],
    techStack: {
      frontend: ["Next.js"],
      backend: ["Next.js", "REST API", "OpenAI API"],
      database: [],
      infra: ["AWS"],
    },
  },
  questionsToAsk: [
    {
      id: "q-context-1",
      category: "context",
      question:
        "What specific pain points in the current requirements-to-spec process do we need to solve (e.g., time to draft, inconsistency, missing sections, review rework, traceability)?",
    },
    {
      id: "q-context-2",
      category: "context",
      question:
        "What interview input formats should the chatbot support at launch (live text chat only, uploaded transcripts, audio/video upload with transcription)?",
    },
    {
      id: "q-context-3",
      category: "context",
      question:
        "Do you have an existing SpecKit template/standard to follow? If yes, please share the exact section/field structure; if not, should we define one and get it approved?",
    },
    {
      id: "q-context-4",
      category: "context",
      question:
        "Are there any privacy/compliance constraints for handling interview data with OpenAI (PII/PHI, data residency, retention policies, customer data handling)?",
    },
    {
      id: "q-businessGoals-1",
      category: "businessGoals",
      question:
        "What are the top 3 measurable outcomes you want (e.g., reduce time to produce a spec to X minutes, reduce rework rate to Y%, increase completeness to Z%)?",
    },
    {
      id: "q-businessGoals-2",
      category: "businessGoals",
      question:
        "What success metrics and target values should we track for the generated SpecKit quality (acceptance rate without edits, reviewer satisfaction/NPS, coverage of mandatory sections)?",
    },
    {
      id: "q-businessGoals-3",
      category: "businessGoals",
      question:
        "What adoption/throughput targets do you expect for the first 3–6 months (number of users, interviews processed per week/month)?",
    },
    {
      id: "q-businessGoals-4",
      category: "businessGoals",
      question:
        "Are there budget constraints for OpenAI usage and AWS costs (e.g., monthly cap or cost per spec target) that define success?",
    },
    {
      id: "q-techStack-1",
      category: "techStack",
      question:
        "Which Next.js version and language preferences should we use (TypeScript vs JavaScript)?",
    },
    {
      id: "q-techStack-2",
      category: "techStack",
      question:
        "Do you have a preferred UI library/design system (e.g., Tailwind, MUI, Chakra) and any required browser support policy?",
    },
    {
      id: "q-techStack-3",
      category: "techStack",
      question:
        "How should we host Next.js on AWS (Amplify Hosting, Lambda@Edge with CloudFront, ECS/Fargate, EC2)?",
    },
    {
      id: "q-techStack-4",
      category: "techStack",
      question:
        "Which OpenAI model and endpoint should we target, and what is the fallback model if the preferred one is unavailable? (e.g., Responses API with JSON mode/function calling)?",
    },
    {
      id: "q-techStack-5",
      category: "techStack",
      question:
        "Should chat responses stream to the UI in real time, and if so, what timeout and retry behavior do you expect?",
    },
    {
      id: "q-techStack-6",
      category: "techStack",
      question:
        "Even without a database, do we need any persistence for conversation history or generated files (e.g., S3 for Markdown/JSON outputs, session store, logging)?",
    },
    {
      id: "q-techStack-7",
      category: "techStack",
      question:
        "What authentication/authorization is required (e.g., SSO via SAML/OIDC, OAuth, role-based access for BAs vs tech leads)?",
    },
  ],
};

export default function AnalyzeForm() {
  const [prompt, setPrompt] = useState<RespFromOpenAiType | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrompt({
      ...respFromOpenAi,
      aswerQuestion: {
        id: "q-techStack-7",
        answer: "SSO via SAML/OIDC",
      },
    });
  }, []);

  async function runPrompt() {
    setLoading(true);
    setError(null);
    setResult("");
    console.log("prompt: ", prompt);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirementsText: prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");

      setResult(data.result);
    } catch (e: any) {
      setError(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        fontFamily: "system-ui",
      }}
    >
      <h1>AnalyzeForm</h1>
      <div>
        <h1>Prompt → OpenAI → Result</h1>

        {/* <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt..."
          rows={8}
          style={{ width: "100%", padding: 12, fontSize: 14 }}
        /> */}

        <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
          <button onClick={runPrompt} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            onClick={() => {
              setPrompt(null);
              setResult("");
              setError(null);
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {error && <p style={{ color: "crimson", marginTop: 16 }}>{error}</p>}

        {result && (
          <>
            <h2 style={{ marginTop: 24 }}>Result</h2>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                padding: 12,
                border: "1px solid #ddd",
              }}
            >
              {result}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
