import { useState } from "react";
import { FileJson, FileText, Download, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpecDraft, SpecResponse } from "@/lib/types";
import { generateJSON, generateMarkdown } from "@/lib/utils";
import SectionHeader from "./SectionHeader";

const defaultSpecDraft: SpecDraft = {
  businessContext:
    "Eg.: A comprehensive software specification tool powered by AI",
  businessGoals: [
    "Eg.: Streamline specification creation process",
    "Eg.: Reduce time to create documentation",
    "Eg.: Improve project clarity and communication",
  ],
  technicalStack: {
    frontend: ["Eg.: React", "Eg.: TypeScript", "Eg.: Tailwind CSS"],
    backend: ["Eg.: Node.js", "Eg.: Express", "Eg.: REST API"],
    database: ["Eg.: PostgreSQL", "Eg.: Redis"],
    infrastructure: ["Eg.: Docker", "Eg.: AWS", "Eg.: GitHub Actions"],
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
    goals: true,
    technicalStack: true,
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
        {Object.entries(dataSpecDraft).map(([sectionKey, sectionValue]) => (
          <div
            className="rounded-lg border border-border bg-card p-4"
            key={sectionKey}
          >
            <SectionHeader
              title={sectionKey
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())}
              sectionKey={sectionKey}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
            {expandedSections[sectionKey] && (
              <div className="mt-3 animate-fade-in space-y-2 text-sm text-foreground leading-relaxed">
                {Array.isArray(sectionValue) ? (
                  sectionValue.map((item, index) => (
                    <p key={index} className="text-sm">
                      – {item}
                    </p>
                  ))
                ) : typeof sectionValue === "object" ? (
                  Object.entries(sectionValue).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground mb-1">
                          {key}
                        </div>
                        <div className="space-y-0.5">
                          {Array.isArray(sectionValue[key]) ? (
                            sectionValue[key].map((tech, index) => (
                              <p key={index} className="text-sm">
                                – {tech}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm">{value as string}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm">{sectionValue as string}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecificationBuilder;
