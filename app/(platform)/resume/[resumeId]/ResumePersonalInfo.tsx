"use client";

import { useState } from "react";
import {useResumeEditor} from "./ResumeEditorShell"

type ResumePersonalInfoProps = {
  resumeId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
};

export default function ResumePersonalInfo({
  resumeId,
  name,
  email,
  phone,
  location,
  linkedin,
  github,
}: ResumePersonalInfoProps) {
  const [formData, setFormData] = useState({
    name,
    email,
    phone,
    location,
    linkedin,
    github,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const { updateResumeData } = useResumeEditor();
  

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setIsDirty(true);
    setSuccess("");
    setError("");
  }

  async function handleSave() {
    if (!isDirty) {
      return;
    }
    if (
      formData.linkedin.trim() &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(formData.linkedin.trim())
    ) {
      setError("Please enter a valid LinkedIn URL.");
      return;
    }

    if (
      formData.github.trim() &&
      !/^https?:\/\/(www\.)?github\.com\/.+/i.test(formData.github.trim())
    ) {
      setError("Please enter a valid GitHub URL.");
      return;
    }
    setIsSaving(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          location: formData.location,
          linkedin: formData.linkedin,
          github: formData.github,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save personal information.");
        return;
      }
      updateResumeData({
        phone: formData.phone,
        location: formData.location,
        linkedin: formData.linkedin,
        github: formData.github,
      });
      setIsDirty(false);
      setSuccess("Personal information saved successfully.");
    } catch (error) {
      console.error("Save personal information error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-950">
          Personal Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Add the contact information you want to display on your resume.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label
            htmlFor={`name-${resumeId}`}
            className="text-sm font-semibold text-slate-700"
          >
            Full Name
          </label>

          <input
            id={`name-${resumeId}`}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor={`email-${resumeId}`}
            className="text-sm font-semibold text-slate-700"
          >
            Email
          </label>

          <input
            id={`email-${resumeId}`}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor={`phone-${resumeId}`}
            className="text-sm font-semibold text-slate-700"
          >
            Phone
          </label>

          <input
            id={`phone-${resumeId}`}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor={`location-${resumeId}`}
            className="text-sm font-semibold text-slate-700"
          >
            Location
          </label>

          <input
            id={`location-${resumeId}`}
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Hyderabad, India"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label
            htmlFor={`linkedin-${resumeId}`}
            className="text-sm font-semibold text-slate-700"
          >
            LinkedIn
          </label>

          <input
            id={`linkedin-${resumeId}`}
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* GitHub */}
        <div>
          <label
            htmlFor={`github-${resumeId}`}
            className="text-sm font-semibold text-slate-700"
          >
            GitHub
          </label>

          <input
            id={`github-${resumeId}`}
            name="github"
            type="url"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Save area */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {success && (
            <p className="text-sm font-medium text-emerald-600">{success}</p>
          )}

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
