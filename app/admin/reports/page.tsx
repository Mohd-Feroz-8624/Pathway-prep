import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import ReportStatus from "./ReportStatus";

const issueTypeLabels: Record<string, string> = {
  MISSING_SUBJECT: "Missing Subject / Topic",
  CONTENT_ISSUE: "Content Issue",
  TECHNICAL_ISSUE: "Technical Issue",
  ROADMAP_ISSUE: "Roadmap Issue",
  FEATURE_REQUEST: "Feature Request",
  OTHER: "Other",
};


export default async function AdminReportsPage() {
  await requireAdmin();

  const reports = await prisma.contactReport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div>
          <p className="text-sm font-semibold text-blue-600">Administration</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Reports & Issues
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Review issues, missing content, subject requests, and feedback
            submitted by students.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              No reports yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Student reports will appear here when they are submitted.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {issueTypeLabels[report.type] ?? report.type}
                      </span>

                      <ReportStatus
                        reportId={report.id}
                        initialStatus={report.status}
                      />
                      

                    </div>

                    <h2 className="mt-4 wrap-break-words text-lg font-bold text-slate-950">
                      {report.subject || "No subject provided"}
                    </h2>
                  </div>

                  <p className="shrink-0 text-sm text-slate-400">
                    {new Date(report.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap wrap-break-words text-sm leading-6 text-slate-700">
                    {report.message}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-1 border-t border-slate-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">
                      {report.user.name || "Student"}
                    </span>

                    <span className="mx-2 text-slate-300">•</span>

                    <span className="break-all text-slate-500">
                      {report.user.email}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Report ID: {report.id}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
