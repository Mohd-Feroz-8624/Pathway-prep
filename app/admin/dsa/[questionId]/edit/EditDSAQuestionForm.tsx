"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DSAQuestion = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  topic: string;
  description: string;
  constraints: string | null;
  examples: string | null;
  concept: string | null;
  approach: string | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  javaSolution: string | null;
  pythonSolution: string | null;
  javascriptSolution: string | null;
  cppSolution: string | null;
  isPublished: boolean;
};

type Props = {
  question: DSAQuestion;
};

export default function EditDSAQuestionForm({ question }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: question.title,
    slug: question.slug,
    difficulty: question.difficulty,
    topic: question.topic,
    description: question.description,
    constraints: question.constraints ?? "",
    examples: question.examples ?? "",
    concept: question.concept ?? "",
    approach: question.approach ?? "",
    timeComplexity: question.timeComplexity ?? "",
    spaceComplexity: question.spaceComplexity ?? "",
    javaSolution: question.javaSolution ?? "",
    pythonSolution: question.pythonSolution ?? "",
    javascriptSolution: question.javascriptSolution ?? "",
    cppSolution: question.cppSolution ?? "",
    isPublished: question.isPublished,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/dsa/${question.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const responseText = await response.text();

      let data: { error?: string; success?: boolean };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Non-JSON API response:", responseText);

        throw new Error(
          `API returned ${response.status}: ${responseText.slice(0, 500)}`,
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to update DSA question.");
      }

      router.push("/admin/dsa");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update DSA question.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <section>
        <h2 className="text-xl font-bold text-slate-950">Basic Information</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Title" required>
            <input
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Slug" required>
            <input
              required
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Difficulty" required>
            <select
              required
              value={form.difficulty}
              onChange={(event) =>
                updateField("difficulty", event.target.value)
              }
              className={inputClass}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </Field>

          <Field label="Topic" required>
            <input
              required
              value={form.topic}
              onChange={(event) => updateField("topic", event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-slate-100 pt-8">
        <h2 className="text-xl font-bold text-slate-950">Problem</h2>

        <div className="mt-5 space-y-5">
          <Field label="Description" required>
            <textarea
              required
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={7}
              className={textareaClass}
            />
          </Field>

          <Field label="Constraints">
            <textarea
              value={form.constraints}
              onChange={(event) =>
                updateField("constraints", event.target.value)
              }
              rows={5}
              className={textareaClass}
            />
          </Field>

          <Field label="Examples">
            <textarea
              value={form.examples}
              onChange={(event) => updateField("examples", event.target.value)}
              rows={8}
              className={textareaClass}
            />
          </Field>
        </div>
      </section>

      {/* Learning Content */}
      <section className="border-t border-slate-100 pt-8">
        <h2 className="text-xl font-bold text-slate-950">Learning Content</h2>

        <div className="mt-5 space-y-5">
          <Field label="Concept">
            <textarea
              value={form.concept}
              onChange={(event) => updateField("concept", event.target.value)}
              rows={5}
              className={textareaClass}
            />
          </Field>

          <Field label="Approach">
            <textarea
              value={form.approach}
              onChange={(event) => updateField("approach", event.target.value)}
              rows={7}
              className={textareaClass}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Time Complexity">
              <input
                value={form.timeComplexity}
                onChange={(event) =>
                  updateField("timeComplexity", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Space Complexity">
              <input
                value={form.spaceComplexity}
                onChange={(event) =>
                  updateField("spaceComplexity", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="border-t border-slate-100 pt-8">
        <h2 className="text-xl font-bold text-slate-950">Solutions</h2>

        <div className="mt-5 space-y-5">
          <CodeField
            label="Java Solution"
            value={form.javaSolution}
            onChange={(value) => updateField("javaSolution", value)}
          />

          <CodeField
            label="Python Solution"
            value={form.pythonSolution}
            onChange={(value) => updateField("pythonSolution", value)}
          />

          <CodeField
            label="JavaScript Solution"
            value={form.javascriptSolution}
            onChange={(value) => updateField("javascriptSolution", value)}
          />

          <CodeField
            label="C++ Solution"
            value={form.cppSolution}
            onChange={(value) => updateField("cppSolution", value)}
          />
        </div>
      </section>

      {/* Publishing */}
      <section className="border-t border-slate-100 pt-8">
        <h2 className="text-xl font-bold text-slate-950">Publishing</h2>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) =>
              updateField("isPublished", event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-slate-300"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-950">
              Published
            </span>

            <span className="mt-1 block text-sm text-slate-500">
              Published questions will appear on the student DSA page.
            </span>
          </span>
        </label>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/dsa")}
          disabled={saving}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function CodeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Enter ${label.toLowerCase()}...`}
        rows={12}
        spellCheck={false}
        className={`${textareaClass} font-mono text-sm`}
      />
    </Field>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const textareaClass =
  "w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
