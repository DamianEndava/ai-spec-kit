import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SpecDraft } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateJSON = (dataSpecDraft: SpecDraft) => {
  return JSON.stringify(dataSpecDraft, null, 2);
};

export const generateMarkdown = (dataSpecDraft: SpecDraft) => {
  const md = `# Project Specification
    ## Context
    ${dataSpecDraft.context}
    ## Business Goals
    ${dataSpecDraft.goals.map((goal, i) => `${i + 1}. ${goal}`).join("\n")}
    ## Technical Stack
    ### Frontend
    ${dataSpecDraft.technicalStack.frontend.map((t) => `- ${t}`).join("\n")}
    ### Backend
    ${dataSpecDraft.technicalStack.backend.map((t) => `- ${t}`).join("\n")}
    ### Database
    ${dataSpecDraft.technicalStack.database.map((t) => `- ${t}`).join("\n")}
    ### Infrastructure
    ${dataSpecDraft.technicalStack.infrastructure.map((t) => `- ${t}`).join("\n")}
    `;
  return md;
};
