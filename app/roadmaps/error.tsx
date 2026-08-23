"use client";

type RoadmapsErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function RoadmapsError({ reset }: RoadmapsErrorProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f9ff] px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
          !
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-950">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          We couldn &apos;t load the roadmaps right now. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
