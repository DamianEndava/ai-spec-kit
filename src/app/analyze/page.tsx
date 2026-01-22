"use client";
import { REQUIREMENT_LOCAL_STORAGE_KEY } from "@/lib/constans";
import { SpecResponse } from "@/lib/types";
import { useEffect, useState } from "react";
import SpecificationBuilder from "./components/SpecificationBuilder";
import ChatPanel from "./components/ChatPanel";

export default function AnalyzePage() {
  const [result, setResult] = useState<SpecResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const res = localStorage.getItem(REQUIREMENT_LOCAL_STORAGE_KEY);
    const data: SpecResponse | null = res ? JSON.parse(res) : null;
    setResult(data);
  }, []);

  async function runPrompt() {
    setLoading(true);
    setError(null);
    const requirementsText = {
      ...result,
      aswerQuestion: {
        id: result?.questionsToAsk[0]?.id || "",
        answer: "SSO via SAML/OIDC", // TODO: replace with actual answer from user input
      },
    };
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirementsText: requirementsText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      console.log("resp data: ", data);

      setResult(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col lg:flex-row py-4 px-4">
        {/* Left Section - Specification Builder */}
        <div className="h-[50vh] border-b border-border lg:h-[calc(100vh-4rem)] lg:w-1/2 lg:border-b-0 lg:border-r overflow-hidden">
          <SpecificationBuilder result={result} />
        </div>

        {/* Right Section - Chat Panel */}
        <div className="h-[50vh] lg:h-[calc(100vh-4rem)] lg:w-1/2 overflow-hidden">
          <ChatPanel
            result={result}
            runPrompt={runPrompt}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
