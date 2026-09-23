"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteUnitButtonProps = {
  unitId: string;
  unitTitle: string;
};

export default function DeleteUnitButton({
  unitId,
  unitTitle,
}: DeleteUnitButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${unitTitle}"?\n\nThis will also delete all resources inside this unit.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/academics/units/${unitId}`, {
        method: "DELETE",
      });

      const responseText = await response.text();

      let data: { error?: string };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Unit delete API returned non-JSON:",
          response.status,
          responseText,
        );

        throw new Error(
          `Server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete unit.");
      }

      router.push(
        window.location.pathname.substring(
          0,
          window.location.pathname.lastIndexOf("/"),
        ),
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete unit.",
      );
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete Unit"}
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
