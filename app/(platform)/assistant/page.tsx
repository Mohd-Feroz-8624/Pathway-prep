import AssistantChat from "./AssistantChat";

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">Pathway AI</h1>

          <p className="mt-2 text-sm text-slate-500">
            Your personal career and learning assistant.
          </p>
        </div>

        <AssistantChat />
      </section>
    </main>
  );
}
