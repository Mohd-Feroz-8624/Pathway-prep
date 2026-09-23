"use client";

import {
  FormEvent,
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AssistantChat({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Pathway AI. I can help you with your career, academics, DSA, roadmap, resume, and interview preparation.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const suggestions = [
    "What should I learn next?",
    "How is my DSA progress?",
    "What should I focus on for my career?",
    "Help me prepare for interviews",
  ];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);
  function handleSuggestionClick(suggestion: string) {
    setMessage(suggestion);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.data.answer,
        },
      ]);
    } catch (error) {
      console.error("Assistant error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process your request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "h-[min(600px,70vh)]" : "h-162.5"}`}
    >
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-lg text-white">
            ✨
          </div>

          <div>
            <h2 className="font-semibold text-slate-950">Pathway AI</h2>

            <p className="text-xs text-slate-500">
              Career & learning assistant
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.length === 1 && !loading && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-medium text-slate-500">
              Try asking Pathway AI:
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`flex ${
              item.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl rounded-2xl px-4 py-3 shadow-sm ${
                item.role === "user"
                  ? "rounded-tr-sm bg-slate-950 text-white"
                  : "rounded-tl-sm border border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <div className="text-sm leading-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-3 list-disc space-y-1 pl-5">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-3 list-decimal space-y-1 pl-5">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    h1: ({ children }) => (
                      <h1 className="mb-2 text-lg font-bold">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-2 text-base font-bold">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-2 font-semibold">{children}</h3>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">
                        {children}
                      </code>
                    ),
                    table: ({ children }) => (
                      <div className="my-4 overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full border-collapse text-sm">
                          {children}
                        </table>
                      </div>
                    ),

                    thead: ({ children }) => (
                      <thead className="bg-slate-100">{children}</thead>
                    ),

                    tbody: ({ children }) => <tbody>{children}</tbody>,

                    tr: ({ children }) => (
                      <tr className="border-b border-slate-200 last:border-b-0">
                        {children}
                      </tr>
                    ),

                    th: ({ children }) => (
                      <th className="border-r border-slate-200 px-4 py-2 text-left font-semibold last:border-r-0">
                        {children}
                      </th>
                    ),

                    td: ({ children }) => (
                      <td className="border-r border-slate-200 px-4 py-2 last:border-r-0">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {item.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="max-w-xl rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              loading
                ? "Pathway AI is thinking..."
                : "Ask Pathway AI anything..."
            }
            disabled={loading}
            rows={1}
            className="max-h-32 min-h-12 flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
