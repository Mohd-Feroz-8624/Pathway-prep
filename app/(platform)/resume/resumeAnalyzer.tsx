"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

const roles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SDE",
];

export default function ResumeAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function validateFile(selectedFile: File) {
    if (!allowedTypes.includes(selectedFile.type)) {
      return "Please upload a PDF, JPG, or PNG file.";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "File size must be 10 MB or less.";
    }

    return "";
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setFile(null);
      setError(validationError);
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    const validationError = validateFile(droppedFile);

    if (validationError) {
      setFile(null);
      setError(validationError);
      return;
    }

    setError("");
    setFile(droppedFile);
  }

  function handleClose() {
    if (isAnalyzing) {
      return;
    }

    setIsOpen(false);
    setFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleAnalyze() {
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("targetRole", targetRole);

      const response = await fetch("/api/resumes/analyze", {
        method: "POST",
        body: formData,
      });
      const responseText = await response.text();

      console.log("ANALYZE API STATUS:", response.status);
      console.log("ANALYZE API RESPONSE:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Analysis API returned a non-JSON response (${response.status}).`,
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }
     const analysisId = data.data.analysisId;

     router.push(`/resume/analyze/result?analysisId=${analysisId}`);

      router.push(`resume/analyze/result`);
    } catch (error) {
      console.error("Resume analysis error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to analyze resume.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <>
      {/* Analyze button */}
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Analyze Resume
      </button>

      {/* Upload modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Resume Analyzer
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  Analyze Your Resume
                </h2>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isAnalyzing}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Upload your resume to get an ATS score, improvement suggestions,
              and relevant job recommendations.
            </p>

            {/* Target Role */}
            <div className="mt-6">
              <label
                htmlFor="targetRole"
                className="text-sm font-semibold text-slate-700"
              >
                Target Role
              </label>

              <select
                id="targetRole"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                disabled={isAnalyzing}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Hidden file input */}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isAnalyzing}
              className="hidden"
            />

            {/* Upload area */}
            <div
              onDragOver={(event) => event.preventDefault()}
              
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className="mt-6 cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                📄
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-950">
                {file ? file.name : "Upload your resume"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Drag & drop or click to browse"}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                PDF, JPG, or PNG · Maximum 10 MB
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error[2]}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isAnalyzing}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
