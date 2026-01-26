import { ChevronDown, ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  sectionKey: string;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

const SectionHeader = ({
  title,
  sectionKey,
  expandedSections,
  toggleSection,
}: SectionHeaderProps) => (
  <button
    onClick={() => toggleSection(sectionKey)}
    className="flex w-full items-center gap-2 py-2 text-left font-semibold text-foreground transition-colors hover:text-accent"
  >
    {expandedSections[sectionKey] ? (
      <ChevronDown className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )}
    {title}
  </button>
);

export default SectionHeader;
