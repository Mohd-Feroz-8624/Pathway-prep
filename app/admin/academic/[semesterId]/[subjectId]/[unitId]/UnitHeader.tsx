"use client";

import { useState } from "react";

import EditUnitForm from "../EditUnitForm";

type UnitHeaderProps = {
  unitId: string;
  number: number;
  title: string;
  description: string | null;
  difficulty: string | null;
  duration: string | null;
};

export default function UnitHeader({
  unitId,
  number,
  title,
  description,
  difficulty,
  duration,
}: UnitHeaderProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Edit Unit</h2>

        <EditUnitForm
          unitId={unitId}
          initialNumber={number}
          initialTitle={title}
          initialDescription={description}
          initialDifficulty={difficulty}
          initialDuration={duration}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-blue-600">Unit {number}</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="shrink-0 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Edit Unit
      </button>
    </div>
  );
}
