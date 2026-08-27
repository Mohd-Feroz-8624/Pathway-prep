"use client";

import { createContext, useContext, useState } from "react";

import type {
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
  ResumeCertification,
  ResumeAchievement,
} from "@/app/generated/prisma/client";

export type ResumeEditorData = {
  id:string;
  title: string;
  summary: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;

  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];

  templateSlug: string | null;
};

type ResumeEditorContextValue = {
  resumeData: ResumeEditorData;
  updateResumeData: (updates: Partial<ResumeEditorData>) => void;
};

const ResumeEditorContext = createContext<ResumeEditorContextValue | null>(
  null,
);

export function useResumeEditor() {
  const context = useContext(ResumeEditorContext);

  if (!context) {
    throw new Error("useResumeEditor must be used inside ResumeEditorShell");
  }

  return context;
}

type ResumeEditorShellProps = {
  children: React.ReactNode;
  initialResume: ResumeEditorData;
};

export default function ResumeEditorShell({
  children,
  initialResume,
}: ResumeEditorShellProps) {
  const [resumeData, setResumeData] = useState<ResumeEditorData>(initialResume);

  function updateResumeData(updates: Partial<ResumeEditorData>) {
    setResumeData((current) => ({
      ...current,
      ...updates,
    }));
  }

  return (
    <ResumeEditorContext.Provider
      value={{
        resumeData,
        updateResumeData,
      }}
    >
      {children}
    </ResumeEditorContext.Provider>
  );
}
