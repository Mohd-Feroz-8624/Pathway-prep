import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type TopicPageProps = {
  params: Promise<{
    semester: string;
    subject: string;
    topic: string;
  }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { semester, subject, topic } = await params;

  const semesterNumber = Number(semester);

  if (
    !Number.isInteger(semesterNumber) ||
    semesterNumber < 1 ||
    semesterNumber > 8
  ) {
    notFound();
  }

  const topicData = await prisma.topic.findFirst({
    where: {
      id: topic,
      unit: {
        subject: {
          slug: subject,
          semester: {
            number: semesterNumber,
          },
        },
      },
    },
    include: {
      unit: {
        include: {
          subject: true,
        },
      },
      notes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!topicData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Breadcrumb information */}
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Semester {semesterNumber}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {topicData.unit.subject.name} / {topicData.unit.title}
          </p>
        </div>

        {/* Topic header */}
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            {topicData.title}
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Study notes and learning resources for this topic.
          </p>
        </div>

        {/* Notes */}
        {/* Notes & Resources */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Study Materials
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Notes & Resources
              </h2>
            </div>

            <span className="text-sm font-medium text-slate-500">
              {topicData.notes.length}{" "}
              {topicData.notes.length === 1 ? "resource" : "resources"}
            </span>
          </div>

          {topicData.notes.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📚
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-950">
                No notes available yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Study notes and learning resources for this topic will appear
                here once they are added.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {topicData.notes.map((note) => (
                <article
                  key={note.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  {/* Note icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    📄
                  </div>

                  {/* Note content */}
                  <div className="mt-5 flex-1">
                    <h3 className="text-lg font-bold text-slate-950">
                      {note.title}
                    </h3>

                    {note.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {note.description}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="mt-6">
                    {note.fileUrl ? (
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Open Resource
                        <span className="ml-2">↗</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
                        Resource coming soon
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
