"use client";
import { Button } from "@/components/ui/button";
import { REQUIREMENT_LOCAL_STORAGE_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";
import {
  FileDown,
  MessageSquare,
  Send,
  ChevronRight,
  Loader,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const [specificationText, setSpecificationText] = useState("");

  // TODO : implement PDF download
  const handleDownloadPDF = () => {
    console.log("Not ready jet");
  };

  const handleSendSpecification = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirementsText: specificationText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      localStorage.setItem(REQUIREMENT_LOCAL_STORAGE_KEY, JSON.stringify(data));
      router.push("/analyze");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4">
      <div className="container py-12 md:py-20">
        {/* Hero Section */}
        <div className="mb-16 text-center animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl">
            Build Better <span className="text-accent">Specifications</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Create comprehensive software specifications with AI assistance.
            Start from a template or describe your project to get started.
          </p>
        </div>

        {/* Tiles Section */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Tile 1 - Requirements PDF */}
          <div
            onClick={handleDownloadPDF}
            className="group cursor-pointer rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent/10">
              <FileDown className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Requirements Template
            </h2>
            <p className="mb-6 text-muted-foreground">
              Download a structured PDF template to help you organize your
              project requirements.
            </p>
            <Button
              variant="outline"
              className="group-hover:border-accent group-hover:text-accent"
            >
              Download requirements (PDF)
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Tile 2 - Specification Input */}
          <div
            className={`group rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 ${
              !showTextarea
                ? "cursor-pointer hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
                : ""
            }`}
            onClick={() => !showTextarea && setShowTextarea(true)}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent/10">
              <MessageSquare className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Start with AI
            </h2>
            <p className="mb-6 text-muted-foreground">
              Describe your project and let AI help you create a comprehensive
              specification.
            </p>
            {error && (
              <p style={{ color: "crimson", marginTop: 16 }}>{error}</p>
            )}
            {!showTextarea ? (
              <Button
                variant="outline"
                className="group-hover:border-accent group-hover:text-accent"
              >
                Start specification
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <Textarea
                  placeholder="Describe your project goals, target users, and key features..."
                  value={specificationText}
                  onChange={(e: {
                    target: { value: SetStateAction<string> };
                  }) => setSpecificationText(e.target.value)}
                  className="min-h-[120px] resize-none border-border bg-background focus:border-accent focus:ring-accent"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  onClick={handleSendSpecification}
                  disabled={!specificationText.trim() || loading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send to AI Assistant
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="mb-8 text-lg font-medium text-muted-foreground">
            Streamline your specification process
          </h3>
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
            <div
              className="animate-slide-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-3 text-2xl font-bold text-accent">10+</div>
              <div className="text-sm text-muted-foreground">
                Guided questions
              </div>
            </div>
            <div
              className="animate-slide-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mb-3 text-2xl font-bold text-accent">AI</div>
              <div className="text-sm text-muted-foreground">
                Powered assistance
              </div>
            </div>
            <div
              className="animate-slide-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="mb-3 text-2xl font-bold text-accent">Export</div>
              <div className="text-sm text-muted-foreground">
                JSON & Markdown
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
