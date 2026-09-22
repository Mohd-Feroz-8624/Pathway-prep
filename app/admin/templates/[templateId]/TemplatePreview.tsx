"use client";

import type { ResumeData } from "@/app/(platform)/resume/[resumeId]/templates/ClassicTemplate";

import type { ResumeTemplateConfig } from "@/lib/resume-template-config";

import ClassicTemplate from "@/app/(platform)/resume/[resumeId]/templates/ClassicTemplate";
import ModernTemplate from "@/app/(platform)/resume/[resumeId]/templates/ModrenTemplate";

type TemplatePreviewProps = {
  slug: string;

  design: {
    headerAlignment: string;
    layout: string;
    accentColor: string;
    sectionStyle: string;
    nameSize: string;
  };

  designConfig: ResumeTemplateConfig;
};

/*
 * Preview-only sample resume.
 *
 * The explicit ResumeData type prevents
 * TypeScript inference errors when passing
 * the object into the template renderers.
 */
const previewResume = {
  name: "Mohd Feroz",
  email: "feroz@example.com",
  title: "Full Stack Developer",

  summary:
    "Computer Science student focused on full-stack development, scalable web applications, and problem solving.",

  phone: "+91 98765 43210",
  location: "Hyderabad, India",

  linkedin: "https://linkedin.com",
  github: "https://github.com",

  education: [
    {
      id: "preview-education-1",
      institution: "Muffakham Jah College of Engineering and Technology",
      degree: "Bachelor of Engineering",
      field: "Computer Science and Engineering",
      startDate: "2023",
      endDate: "2027",
      description: null,
    },
  ],

  experience: [
    {
      id: "preview-experience-1",
      company: "Pathway Prep",
      position: "Full Stack Developer",
      location: "Hyderabad",
      startDate: "2026",
      endDate: null,
      isCurrent: true,
      description:
        "Built full-stack features using Next.js, TypeScript, Prisma and PostgreSQL.",
    },
  ],

  projects: [
    {
      id: "preview-project-1",
      title: "Pathway Prep",
      description:
        "Career preparation platform for students with roadmaps, DSA, resume building and AI-powered interview preparation.",
      technologies: "Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL",
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
    },
  ],

  skills: [
    {
      id: "preview-skill-1",
      name: "JavaScript",
      category: "Programming",
    },
    {
      id: "preview-skill-2",
      name: "TypeScript",
      category: "Programming",
    },
    {
      id: "preview-skill-3",
      name: "React",
      category: "Frontend",
    },
    {
      id: "preview-skill-4",
      name: "Next.js",
      category: "Frontend",
    },
    {
      id: "preview-skill-5",
      name: "Prisma",
      category: "Backend",
    },
  ],

  certifications: [
    {
      id: "preview-certification-1",
      name: "Full Stack Web Development",
      issuer: "Udemy",
      issueDate: "2026",
      credentialUrl: null,
    },
  ],

  achievements: [
    {
      id: "preview-achievement-1",
      title: "160+ LeetCode Problems",
      description:
        "Solved more than 160 programming problems across multiple DSA topics.",
    },
  ],
} as ResumeData;

export default function TemplatePreview({
  slug,
  design,
  designConfig,
}: TemplatePreviewProps) {
  /*
   * Keep old design properties synchronized
   * with the new full configuration.
   */
  const templateDesign = {
    ...design,

    headerAlignment: designConfig.header.alignment,

    layout: designConfig.layout.type,

    accentColor: designConfig.style.accentColor,

    sectionStyle: designConfig.style.sectionStyle,

    nameSize: designConfig.header.nameSize,
  };

  if (slug === "modern") {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <div className="overflow-auto p-4 sm:p-6">
          <ModernTemplate
            resume={previewResume}
            templateDesign={templateDesign}
            designConfig={designConfig}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <div className="overflow-auto p-4 sm:p-6">
        <ClassicTemplate
          resume={previewResume}
          templateDesign={templateDesign}
          designConfig={designConfig}
        />
      </div>
    </div>
  );
}
