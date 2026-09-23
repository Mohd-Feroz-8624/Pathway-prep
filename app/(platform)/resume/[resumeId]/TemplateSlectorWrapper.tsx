"use client";

import { useRouter } from "next/navigation";
import TemplateSelector from "./TemplateSelector";

type Template = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  previewUrl: string | null;
};

type TemplateSelectorWrapperProps = {
  resumeId: string;
  templates: Template[];
  selectedTemplateId: string | null;
};

export default function TemplateSelectorWrapper({
  resumeId,
  templates,
  selectedTemplateId,
}: TemplateSelectorWrapperProps) {
  const router = useRouter();

 async function handleSelect(templateId: string) {
   try {
     const response = await fetch(`/api/resumes/${resumeId}/template`, {
       method: "PATCH",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         templateId,
       }),
     });

     const data = await response.json();

     if (!response.ok) {
       console.error(data.error || "Failed to update template");
       return;
     }

     window.dispatchEvent(new CustomEvent("resume-data-updated"));

     router.refresh();
   } catch (error) {
     console.error("Template selection error:", error);
   }
 }

  return (
    <TemplateSelector
      templates={templates}
      selectedTemplateId={selectedTemplateId}
      onSelect={handleSelect}
    />
  );
}
