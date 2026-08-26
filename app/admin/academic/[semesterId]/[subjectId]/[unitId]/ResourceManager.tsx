"use client";

import { useState } from "react";

import AddResourceForm from "./AddResourceForm";

export default function ResourceManager({ unitId }: { unitId: string }) {
  const [showForm, setShowForm] = useState(false);

  function handleSuccess() {
    setShowForm(false);

    window.location.reload();
  }

  return (
    <div>
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Resource
        </button>
      ) : (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">Add Resource</h2>

            <p className="mt-1 text-sm text-slate-500">
              Add learning material for this unit.
            </p>
          </div>

          <AddResourceForm
            unitId={unitId}
            onCancel={() => setShowForm(false)}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
}
