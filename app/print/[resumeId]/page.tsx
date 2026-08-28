import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import PrintButton from "./PrintButton";
import ClassicTemplate from "@/app/(platform)/resume/[resumeId]/templates/ClassicTemplate";
import ModernTemplate from "@/app/(platform)/resume/[resumeId]/templates/ModrenTemplate";

type PrintPageProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export default async function ResumePrintPage({ params }: PrintPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { resumeId } = await params;

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: user.id,
    },
    include: {
      education: {
        orderBy: {
          createdAt: "asc",
        },
      },

      experience: {
        orderBy: {
          createdAt: "asc",
        },
      },

      projects: {
        orderBy: {
          createdAt: "asc",
        },
      },

      skills: {
        orderBy: {
          createdAt: "asc",
        },
      },

      certifications: {
        orderBy: {
          createdAt: "asc",
        },
      },

      achievements: {
        orderBy: {
          createdAt: "asc",
        },
      },

      template: true,
    },
  });

  if (!resume) {
    notFound();
  }

  const resumeData = {
    id: resume.id,
    email: user.email,
    name: user.name ?? "",
    title: resume.title,
    summary: resume.summary,
    phone: resume.phone,
    location: resume.location,
    linkedin: resume.linkedin,
    github: resume.github,
    education: resume.education,
    experience: resume.experience,
    projects: resume.projects,
    skills: resume.skills,
    certifications: resume.certifications,
    achievements: resume.achievements,
  };

  return (
    <main className="resume-print-page">
      <PrintButton  />
      {resume.template?.slug === "modern" ? (
        <ModernTemplate resume={resumeData} />
      ) : (
        <ClassicTemplate resume={resumeData} />
      )}
    </main>
  );
}
