"use client";
import { REQUIREMENT_LOCAL_STORAGE_KEY } from "@/lib/constans";
import { ChatMessage, SpecResponse } from "@/lib/types";
import { useEffect, useState } from "react";
import SpecificationBuilder from "./components/SpecificationBuilder";
import ChatPanel from "./components/ChatPanel";

export default function AnalyzePage() {
  const [result, setResult] = useState<SpecResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const res = localStorage.getItem(REQUIREMENT_LOCAL_STORAGE_KEY);
    const data: SpecResponse | null = res ? JSON.parse(res) : null;
    setResult(data);

    if (data?.questionsToAsk[0]) {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        questionId: data.questionsToAsk[0]?.id,
        content: data.questionsToAsk[0]?.question,
        sender: "ai",
        timestamp: new Date(),
      };

      setChatMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.questionId === aiMessage.questionId &&
            msg.sender === aiMessage.sender,
        );

        if (exists) return prev; // skip duplicate

        return [...prev, aiMessage];
      });
    }
  }, []);

  useEffect(() => {
    if (loading) {
      const aiMessage: ChatMessage = {
        id: "loading-question",
        questionId: "loading-question",
        content: "Loading next question...",
        sender: "ai",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    }

    if (!loading) {
      setChatMessages((prev) =>
        prev.filter((msg) => msg.id !== "loading-question"),
      );
    }
  }, [loading]);

  async function runPrompt() {
    setLoading(true);
    setError(null);
    const requirementsText = {
      ...result,
      aswerQuestion: {
        id: chatMessages[chatMessages.length - 1].questionId || "",
        answer: chatMessages[chatMessages.length - 1].content,
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
      if (data?.questionsToAsk[0]) {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          questionId: data.questionsToAsk[0]?.id,
          content: data.questionsToAsk[0]?.question,
          sender: "ai",
          timestamp: new Date(),
        };

        const exists = chatMessages.some(
          (msg) => msg.id === aiMessage.id && msg.sender === aiMessage.sender,
        );

        if (exists) return; // skip duplicate

        setChatMessages((prev) => [...prev, aiMessage]);
      } else {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          questionId: "no-more-questions",
          content:
            "That was the last question. You have completed the analysis.",
          sender: "ai",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMessage]);
      }
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
        <div className="h-[50vh] border-b border-border lg:h-[calc(100vh-6rem)] lg:w-1/2 lg:border-b-0 lg:border-r overflow-hidden">
          <SpecificationBuilder result={result} />
        </div>

        {/* Right Section - Chat Panel */}
        <div className="h-[50vh] lg:h-[calc(100vh-6rem)] lg:w-1/2 overflow-hidden">
          <ChatPanel
            result={result}
            runPrompt={runPrompt}
            error={error}
            loading={loading}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        </div>
      </div>
    </div>
  );
}
