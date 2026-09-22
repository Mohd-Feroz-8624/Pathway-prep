"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteResumeButtonProps = {
  resumeId: string;
};

export default function DeleteResumeButton({
  resumeId,
}: DeleteResumeButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resume.");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete resume error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the resume.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="mt-3 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete Resume"}
    </button>
  );
}
