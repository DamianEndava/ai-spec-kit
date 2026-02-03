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

  const [showTextarea, setShowTextarea] = useState(false);
  const [specificationText, setSpecificationText] = useState("");
  const [isSpecificationLoading, setIsSpecificationLoading] = useState(false);
  const [specificationErrorMsg, setSpecificationErrorMsg] = useState<
    string | null
  >(null);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadInProgress, setIsFileUploadInProgress] = useState(false);
  const [fileUploadErrorMsg, setFileUploadErrorMsg] = useState<string | null>(
    null,
  );

  const handleUploadPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || file.type !== "application/pdf") {
      setFileUploadErrorMsg("Select a PDF first");
      return;
    }

    setIsFileUploadInProgress(true);
    setFileUploadErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploadRequirements", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      localStorage.setItem(REQUIREMENT_LOCAL_STORAGE_KEY, JSON.stringify(data));
      router.push("/analyze");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFileUploadErrorMsg(err.message || "Request failed");
      } else {
        setFileUploadErrorMsg("Request failed");
      }
    } finally {
      setIsFileUploadInProgress(false);
    }
  };

  const handleSendSpecification = async () => {
    setIsSpecificationLoading(true);
    setSpecificationErrorMsg(null);

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
      setSpecificationErrorMsg(e.message ?? "Error");
    } finally {
      setIsSpecificationLoading(false);
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
          <div className="group cursor-pointer rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent/10">
              <FileDown className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Requirements Upload
            </h2>
            <p className="mb-6 text-muted-foreground">
              Upload a structured PDF to help you organize your project
              requirements.
            </p>
            {fileUploadErrorMsg && (
              <p style={{ color: "crimson", marginTop: 16 }}>
                {fileUploadErrorMsg}
              </p>
            )}
            {!showUploadForm && (
              <Button
                variant="outline"
                className="group-hover:border-accent group-hover:text-accent"
                type="button"
                onClick={() => setShowUploadForm(true)}
              >
                Upload requirements (PDF)
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
            {showUploadForm && (
              <form
                onSubmit={handleUploadPDF}
                className="space-y-4 animate-fade-in"
              >
                {/* File Upload */}
                <label
                  htmlFor="pdf-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-6 text-center transition-all hover:border-accent hover:bg-accent/5"
                >
                  <FileDown className="mb-2 h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {file ? file.name : "Click to upload a PDF"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    PDF files only
                  </span>

                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {/* Submit */}
                <Button
                  variant="outline"
                  type="submit"
                  disabled={isFileUploadInProgress || !file}
                  className="w-full border-accent bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
                >
                  {isFileUploadInProgress ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing PDF…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Upload & Analyze
                    </>
                  )}
                </Button>
              </form>
            )}
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
            {specificationErrorMsg && (
              <p style={{ color: "crimson", marginTop: 16 }}>
                {specificationErrorMsg}
              </p>
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
                />
                <Button
                  onClick={handleSendSpecification}
                  disabled={!specificationText.trim() || isSpecificationLoading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSpecificationLoading ? (
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
