"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  name: string | null;
  email: string;
  college: string | null;
  branch: string | null;
  currentSemester: number | null;
  careerGoal: string | null;
  github: string | null;
  linkedin: string | null;
};

export default function ProfileForm({
  name,
  email,
  college,
  branch,
  currentSemester,
  careerGoal,
  github,
  linkedin,
}: ProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: name ?? "",
    email,
    college: college ?? "",
    branch: branch ?? "",
    currentSemester: currentSemester?.toString() ?? "",
    careerGoal: careerGoal ?? "",
    github: github ?? "",
    linkedin: linkedin ?? "",
  });
  const [originalData, setOriginalData] = useState({
    name: name ?? "",
    email,
    college: college ?? "",
    branch: branch ?? "",
    currentSemester: currentSemester?.toString() ?? "",
    careerGoal: careerGoal ?? "",
    github: github ?? "",
    linkedin: linkedin ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(originalData);

    if (!hasChanges) {
      setMessage("");
      setError("Please change at least one field before saving.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          college: formData.college,
          branch: formData.branch,
          currentSemester: formData.currentSemester,
          careerGoal: formData.careerGoal,
          github: formData.github,
          linkedin: formData.linkedin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      setOriginalData(formData);
      setMessage("Profile saved successfully.");
      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-950">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep your academic information up to date.
          </p>
        </div>

        <div className="grid gap-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
            />

            <p className="mt-1 text-xs text-slate-400">
              Your email is managed by your authentication account.
            </p>
          </div>

          {/* College */}
          <div>
            <label
              htmlFor="college"
              className="text-sm font-semibold text-slate-700"
            >
              College
            </label>

            <input
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Your college"
            />
          </div>

          {/* Branch + Semester */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="branch"
                className="text-sm font-semibold text-slate-700"
              >
                Branch
              </label>

              <input
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. CSE"
              />
            </div>

            <div>
              <label
                htmlFor="currentSemester"
                className="text-sm font-semibold text-slate-700"
              >
                Current Semester
              </label>

              <input
                id="currentSemester"
                name="currentSemester"
                type="number"
                min="1"
                max="8"
                value={formData.currentSemester}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. 6"
              />
            </div>
          </div>

          {/* Career Goal */}
          <div>
            <label
              htmlFor="careerGoal"
              className="text-sm font-semibold text-slate-700"
            >
              Career Goal
            </label>

            <input
              id="careerGoal"
              name="careerGoal"
              value={formData.careerGoal}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Full Stack Developer"
            />
          </div>
        </div>
      </section>

      {/* Professional Links */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-950">
            Professional Links
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add links to your professional profiles.
          </p>
        </div>

        <div className="space-y-5">
          {/* GitHub */}
          <div>
            <label
              htmlFor="github"
              className="text-sm font-semibold text-slate-700"
            >
              GitHub
            </label>

            <input
              id="github"
              name="github"
              type="url"
              value={formData.github}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="https://github.com/username"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label
              htmlFor="linkedin"
              className="text-sm font-semibold text-slate-700"
            >
              LinkedIn
            </label>

            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
      </section>
      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {message && (
          <p className="text-sm font-medium text-green-600">{message}</p>
        )}

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
