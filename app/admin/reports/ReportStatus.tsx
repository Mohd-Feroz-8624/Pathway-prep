"use client";

import { useState } from "react";

type Status = "PENDING" | "IN_PROGRESS" | "RESOLVED";

type ReportStatusProps = {
  reportId: string;
  initialStatus: Status;
};

const statusStyles: Record<Status, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function ReportStatus({
  reportId,
  initialStatus,
}: ReportStatusProps) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(newStatus: Status) {
    const previousStatus = status;

    setStatus(newStatus);
    setUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/contact/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status.");
      }
    } catch (error) {
      setStatus(previousStatus);

      setError(
        error instanceof Error ? error.message : "Failed to update status.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <label
        htmlFor={`status-${reportId}`}
        className="text-xs font-semibold text-slate-500"
      >
        Status
      </label>

      <select
        id={`status-${reportId}`}
        value={status}
        disabled={updating}
        onChange={(event) => updateStatus(event.target.value as Status)}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 ${statusStyles[status]}`}
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
      </select>

      {updating && <p className="text-xs text-slate-400">Updating...</p>}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
