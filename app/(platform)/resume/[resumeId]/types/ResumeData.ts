import type {
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
  ResumeCertification,
  ResumeAchievement,
} from "@/app/generated/prisma/client";

export type ResumeData = {
  id?: string;
  name: string;
  email: string;
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

  templateSlug?: string | null;

  templateDesign?: {
    headerAlignment: string;
    layout: string;
    accentColor: string;
    sectionStyle: string;
    nameSize: string;
  };
};
