"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

import AssistantChat from "@/app/(platform)/assistant/AssistantChat";

export default function FloatingAssistantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:w-[calc(100vw-3rem)] sm:max-w-md">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Pathway AI assistant"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-950"
            >
              <X className="h-4 w-4" />
            </button>

            <AssistantChat compact />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          open ? "Close Pathway AI assistant" : "Open Pathway AI assistant"
        }
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
