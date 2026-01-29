import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SpecDraft } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateJSON = (dataSpecDraft: SpecDraft) => {
  return JSON.stringify(dataSpecDraft, null, 2);
};

const formatMarkdownKey = (key: string) => {
  const withSpaces = key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

export const generateMarkdown = (
  data: unknown,
  title = "Project Specification",
) => {
  const lines: string[] = [`# ${title}`];

  const render = (value: unknown, depth: number, key?: string) => {
    const headingLevel = Math.min(depth, 6);
    const heading = key
      ? `${"#".repeat(headingLevel)} ${formatMarkdownKey(key)}`
      : null;

    if (heading) {
      lines.push("", heading);
    }

    if (value === null || value === undefined) {
      lines.push("", "_Not specified_");
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push("", "_Not specified_");
        return;
      }

      const allPrimitive = value.every(
        (item) =>
          item === null ||
          ["string", "number", "boolean"].includes(typeof item),
      );

      if (allPrimitive) {
        lines.push(
          "",
          ...value.map((item) => `- ${item === null ? "" : String(item)}`),
        );
        return;
      }

      value.forEach((item, index) => {
        const itemKey = `Item ${index + 1}`;
        render(item, depth + 1, itemKey);
      });
      return;
    }

    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        lines.push("", "_Not specified_");
        return;
      }
      entries.forEach(([childKey, childValue]) => {
        render(childValue, depth + 1, childKey);
      });
      return;
    }

    lines.push("", String(value));
  };

  render(data, 2);
  return lines.join("\n").trim() + "\n";
};
