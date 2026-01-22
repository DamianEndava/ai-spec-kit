"use client";

import { useState } from "react";

export default function QuestionsForm() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runPrompt() {
    setLoading(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/chat", {
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
      <h1>QuestionsForm</h1>
      <div>
        <h1>Prompt → OpenAI → Result</h1>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt..."
          rows={8}
          style={{ width: "100%", padding: 12, fontSize: 14 }}
        />

        <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
          <button onClick={runPrompt} disabled={loading || !prompt.trim()}>
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            onClick={() => {
              setPrompt("");
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
