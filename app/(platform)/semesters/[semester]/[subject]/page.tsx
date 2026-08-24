import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type SubjectPageProps = {
  params: Promise<{
    semester: string;
    subject: string;
  }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { semester, subject } = await params;

  const semesterNumber = Number(semester);

  if (
    !Number.isInteger(semesterNumber) ||
    semesterNumber < 1 ||
    semesterNumber > 8
  ) {
    notFound();
  }

 const subjectData = await prisma.subject.findFirst({
   where: {
     slug: subject,
     semester: {
       number: semesterNumber,
     },
   },
   include: {
     units: {
       orderBy: {
         number: "asc",
       },
       include: {
         topics: {
           orderBy: {
             title: "asc",
           },
         },
       },
     },
   },
 });
  console.log("SEMESTER:", semesterNumber);
  console.log("SUBJECT SLUG:", subject);
  console.log("SUBJECT DATA:", subjectData);

  if (!subjectData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">
            Semester {semesterNumber}
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {subjectData.name}
          </h1>

          {subjectData.code && (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {subjectData.code}
            </p>
          )}

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Explore units, topics, notes, and learning resources for this
            subject.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {subjectData.units.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="text-lg font-bold text-slate-950">
                No units available
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Units and topics will appear here once they are added.
              </p>
            </div>
          ) : (
            subjectData.units.map((unit) => (
              <section
                key={unit.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                    {unit.number}
                  </div>

                  <h2 className="text-xl font-bold text-slate-950">
                    {unit.title}
                  </h2>
                </div>

                {unit.topics.length === 0 ? (
                  <p className="mt-5 text-sm text-slate-500">
                    No topics available.
                  </p>
                ) : (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {unit.topics.map((topic) => (
                      <a
                        key={topic.id}
                        href={`/semesters/${semesterNumber}/${subject}/${topic.id}`}
                        className="group rounded-xl bg-slate-50 px-4 py-3 transition hover:bg-blue-50"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                            {topic.title}
                          </span>

                          <span className="text-sm font-semibold text-blue-600">
                            View →
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
