"use client";

import { useState } from "react";

export default function DeleteResourceButton({
  resourceId,
}: {
  resourceId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: "DELETE",
      });

      const text = await response.text();

      console.log("DELETE status:", response.status);
      console.log("DELETE response:", text);

      if (!response.ok) {
        window.alert(`Delete failed (${response.status}): ${text}`);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Delete resource error:", error);
      window.alert("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
