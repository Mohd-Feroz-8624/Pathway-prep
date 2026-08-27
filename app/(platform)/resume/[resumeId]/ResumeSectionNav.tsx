"use client";

const sections = [
  {
    id: "personal-information",
    label: "Personal Information",
  },
  {
    id: "summary",
    label: "Summary",
  },
  {
    id: "education",
    label: "Education",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "skills",
    label: "Skills",
  },
  {
    id: "certifications",
    label: "Certifications",
  },
];

export default function ResumeSectionNav() {
  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <nav className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        Resume Sections
      </p>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
