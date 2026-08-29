import Link from "next/link";
import InterviewSetup from "./InterviewSetup";


export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">
            Interview Preparation
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Interview Practice
          </h1>

          <p className="mt-3 text-lg leading-8 text-slate-600">
            Practice realistic interviews, improve your answers, and prepare
            yourself for your next opportunity.
          </p>
        </div>

        {/* Main Interview Card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Card Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  🎤
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    AI Mock Interview
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Practice a realistic interview with an AI interviewer.
                    Questions will be tailored to your selected role and
                    difficulty.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                Coming Soon
              </span>
            </div>

           <InterviewSetup/>
          </div>
        </section>

        {/* Interview Activity */}
        <section>
          <div>
            <p className="text-sm font-semibold text-blue-600">Your Progress</p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Interview Activity
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your interview performance will appear here after you complete
              your first interview.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Interviews */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🎯
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Interviews Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
            </div>

            {/* Average Score */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                📊
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Average Score
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">--</p>
            </div>

            {/* Best Score */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                🏆
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Best Score
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">--</p>
            </div>
          </div>
        </section>

        {/* Preparation Tips */}
        {/* Career Preparation CTAs */}
        <section className="grid gap-5 md:grid-cols-2">
          {/* Roadmaps */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
              🧭
            </div>

          

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Follow Your Roadmap
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Follow a structured career path, build the right skills, and
              prepare yourself for your target role.
            </p>

            <Link
              href="/roadmaps"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              View Roadmaps
              <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Resume Builder */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
              📄
            </div>

         

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Create Your Resume
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Build a professional, placement-ready resume using your profile,
              skills, projects, and experience.
            </p>

            <Link
              href="/resume"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create Resume
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
