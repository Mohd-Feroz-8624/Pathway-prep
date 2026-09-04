"use client";

import ClassicTemplate, {
  type ResumeData,
} from "@/app/(platform)/resume/[resumeId]/templates/ClassicTemplate";
import ModernTemplate from "@/app/(platform)/resume/[resumeId]/templates/ModrenTemplate";

type TemplateDesign = {
  headerAlignment: string;
  layout: string;
  accentColor: string;
  sectionStyle: string;
  nameSize: string;
};

type TemplatePreviewProps = {
  slug: string;
  design: TemplateDesign;
};

const sampleResume = {
  name: "Mohd Feroz",
  email: "feroz@example.com",
  title: "Full Stack Developer",
  summary:
    "Computer Science engineering student passionate about building modern web applications and solving real-world problems.",
  phone: "+91 98765 43210",
  location: "Hyderabad, India",
  linkedin: "linkedin.com/in/mohdferoz",
  github: "github.com/mohd-feroz",

  education: [
    {
      id: "preview-education-1",
      resumeId: "preview-resume",
      institution: "Muffakham Jah College of Engineering and Technology",
      degree: "B.E.",
      field: "Computer Science and Engineering",
      startDate: "2023",
      endDate: "2027",
      description: null,
    },
  ],

  experience: [
    {
      id: "preview-experience-1",
      resumeId: "preview-resume",
      company: "Software Company",
      position: "Full Stack Developer Intern",
      location: "Hyderabad",
      startDate: "2026",
      endDate: null,
      isCurrent: true,
      description:
        "Built responsive web applications using React, Next.js, TypeScript, and PostgreSQL.",
    },
  ],

  projects: [
    {
      id: "preview-project-1",
      resumeId: "preview-resume",
      title: "Pathway Prep",
      description:
        "Career preparation platform with roadmaps, DSA practice, resume analysis, interviews, and AI assistance.",
      technologies: "Next.js · TypeScript · Prisma · PostgreSQL",
      githubUrl: null,
      liveUrl: null,
    },
  ],

  skills: [
    {
      id: "preview-skill-1",
      resumeId: "preview-resume",
      name: "React",
      category: "Frontend",
    },
    {
      id: "preview-skill-2",
      resumeId: "preview-resume",
      name: "Next.js",
      category: "Frontend",
    },
    {
      id: "preview-skill-3",
      resumeId: "preview-resume",
      name: "TypeScript",
      category: "Languages",
    },
    {
      id: "preview-skill-4",
      resumeId: "preview-resume",
      name: "Prisma",
      category: "Backend",
    },
  ],

  certifications: [
    {
      id: "preview-certification-1",
      resumeId: "preview-resume",
      name: "Full Stack Development",
      issuer: "Online Certification",
      issueDate: "2026",
      credentialUrl: null,
    },
  ],

  achievements: [
    {
      id: "preview-achievement-1",
      resumeId: "preview-resume",
      title: "Solved 160+ coding problems",
      description:
        "Consistently practiced data structures and algorithms on coding platforms.",
    },
  ],
};
const previewResume = sampleResume as unknown as ResumeData;

export default function TemplatePreview({
  slug,
  design,
}: TemplatePreviewProps) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-200 p-4">
      <div className="mx-auto w-fit origin-top scale-[0.65] sm:scale-[0.75] lg:scale-[0.8]">
        {slug === "modern" ? (
          <ModernTemplate resume={previewResume} templateDesign={design} />
        ) : (
          <ClassicTemplate resume={previewResume} templateDesign={design} />
        )}
      </div>
    </div>
  );
}
