"use client";

import { useState } from "react";

import EditResourceForm from "./EditResponseFom";

type Resource = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  url: string | null;
};

export default function EditResourceButton({
  resource,
}: {
  resource: Resource;
}) {
  const [isEditing, setIsEditing] = useState(false);

  function handleSuccess() {
    setIsEditing(false);
    window.location.reload();
  }

  if (isEditing) {
    return (
      <EditResourceForm
        resource={resource}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Edit
    </button>
  );
}
