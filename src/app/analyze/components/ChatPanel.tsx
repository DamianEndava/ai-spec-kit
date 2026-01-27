"use client";

import {
  Send,
  Copy,
  User,
  Sparkles,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage, SpecResponse } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

interface ChatPanelProps {
  result: SpecResponse | null;
  runPrompt: () => Promise<void>;
  error: string | null;
  loading: boolean;
  chatMessages: ChatMessage[];
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

const ChatPanel = ({
  runPrompt,
  error,
  chatMessages,
  setChatMessages,
}: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");

  const saveUserResponse = () => {
    if (!inputValue.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      questionId: chatMessages[chatMessages.length - 1].questionId,
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    runPrompt();
    setInputValue("");
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => {
          return (
            <div
              key={`${message.id}+${message.sender}`}
              className={`flex items-start gap-3 animate-fade-in ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.sender === "ai" ? "bg-secondary" : "bg-primary"
                }`}
              >
                {message.sender === "ai" ? (
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="h-4 w-4 text-primary-foreground" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "ai"
                    ? "bg-secondary text-foreground rounded-tl-md"
                    : "bg-primary text-primary-foreground rounded-tr-md"
                }`}
              >
                <div className="text-sm leading-relaxed">
                  {message.id === "loading-question" ? (
                    <div className="flex items-center gap-1 h-5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </div>
                <div
                  className={`mt-1 flex items-center gap-2 text-xs ${
                    message.sender === "ai"
                      ? "text-muted-foreground"
                      : "text-primary-foreground/70"
                  }`}
                >
                  <span>{formatTime(message.timestamp)}</span>
                </div>

                {/* Copy button for AI messages */}
                {message.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(message.content)}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {error && (
          <div className="mt-2 w-10/12 flex items-start justify-between gap-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Something went wrong while loading the response. Please try
                again.
              </span>
            </div>

            <button
              onClick={() => console.log("reload")}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-destructive hover:bg-destructive/20 transition"
            >
              <RotateCw className="h-4 w-4" />
              Reload
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type your answer..."
            value={inputValue}
            rows={1}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                saveUserResponse();
              }
            }}
            className="flex-1 resize-none overflow-y-auto max-h-30 border-border bg-background focus:border-accent focus:ring-accent"
          />
          <Button
            onClick={saveUserResponse}
            disabled={!inputValue.trim()}
            className="h-10 w-10 shrink-0 bg-accent p-0 text-accent-foreground hover:bg-accent/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
