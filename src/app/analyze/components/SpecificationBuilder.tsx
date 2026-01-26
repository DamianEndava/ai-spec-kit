import { useState } from "react";
import { FileJson, FileText, Download, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpecDraft, SpecResponse } from "@/lib/types";
import { generateJSON, generateMarkdown } from "@/lib/utils";
import SectionHeader from "./SectionHeader";

const defaultSpecDraft: SpecDraft = {
  context: "Eg.: A comprehensive software specification tool powered by AI",
  businessGoals: [
    "Eg.: Streamline specification creation process",
    "Eg.: Reduce time to create documentation",
    "Eg.: Improve project clarity and communication",
  ],
  techStack: {
    frontend: ["Eg.: React", "Eg.: TypeScript", "Eg.: Tailwind CSS"],
    backend: ["Eg.: Node.js", "Eg.: Express", "Eg.: REST API"],
    database: ["Eg.: PostgreSQL", "Eg.: Redis"],
    infra: ["Eg.: Docker", "Eg.: AWS", "Eg.: GitHub Actions"],
  },
};

interface SpecificationBuilderProps {
  result: SpecResponse | null;
}

const SpecificationBuilder = ({ result }: SpecificationBuilderProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    context: true,
    businessGoals: true,
    techStack: true,
  });

  const dataSpecDraft: SpecDraft = result?.specDraft || defaultSpecDraft;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCopy = (type: "markdown" | "json") => {
    const content =
      type === "markdown"
        ? generateMarkdown(dataSpecDraft)
        : generateJSON(dataSpecDraft);
    navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (type: "markdown" | "json") => {
    const content =
      type === "markdown"
        ? generateMarkdown(dataSpecDraft)
        : generateJSON(dataSpecDraft);
    const extension = type === "markdown" ? "md" : "json";
    const mimeType = type === "markdown" ? "text/markdown" : "application/json";

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `specification.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const techCategories: {
    key: keyof typeof dataSpecDraft.techStack;
    label: string;
  }[] = [
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
    { key: "database", label: "Database" },
    { key: "infra", label: "Infrastructure" },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            Specification
          </h2>
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            {result?.questionsToAsk.length ?? 0} questions left
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy("markdown")}
            className="gap-2"
          >
            {copied === "markdown" ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy("json")}
            className="gap-2"
          >
            {copied === "json" ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            <FileJson className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload("markdown")}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            MD
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload("json")}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Context Section */}
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionHeader
            title="Context"
            sectionKey="context"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
          {expandedSections.context && (
            <div className="mt-3 animate-fade-in">
              <p className="text-sm text-foreground leading-relaxed">
                {dataSpecDraft.context}
              </p>
            </div>
          )}
        </div>

        {/* Business Goals Section */}
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionHeader
            title="Business Goals"
            sectionKey="businessGoals"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
          {expandedSections.businessGoals && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {dataSpecDraft.businessGoals.map((goal, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed pt-0.5">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech Stack Section */}
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionHeader
            title="Tech Stack"
            sectionKey="techStack"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
          {expandedSections.techStack && (
            <div className="mt-3 space-y-3 animate-fade-in">
              {techCategories.map(({ key, label }, categoryIndex) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                    {categoryIndex + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {label}
                    </h4>
                    <div className="space-y-0.5">
                      {dataSpecDraft.techStack[key].map((tech, index) => (
                        <p
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          – {tech}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificationBuilder;
