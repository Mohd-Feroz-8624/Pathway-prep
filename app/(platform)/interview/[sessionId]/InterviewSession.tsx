"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question: string;
};

type InterviewSessionProps = {
  sessionId: string;
  questions: Question[];
};

export default function InterviewSession({
  sessionId,
  questions,
}: InterviewSessionProps) {
  const router  = useRouter(); 

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <h2 className="text-xl font-bold text-slate-950">
          No questions available
        </h2>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  async function saveAnswer() {
    console.log("SAVING ANSWER FOR SESSION:", sessionId);
    console.log("CURRENT QUESTION:", currentQuestion.id);
    const response = await fetch(`/api/interview/${sessionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        answer,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save answer.");
    }
  }

  async function handleNext() {
    try {
      await saveAnswer();

      if (!isLastQuestion) {
        setCurrentIndex((current) => current + 1);
        setAnswer("");
      }
    } catch (error) {
      console.error("Save answer error:", error);

      alert(
        error instanceof Error ? error.message : "Failed to save your answer.",
      );
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);
      setAnswer("");
    }
  }
 async function handleFinish() {
   try {
     // 1. Save the final answer
     await saveAnswer();

     // 2. Mark interview as completed
     const finishResponse = await fetch(`/api/interview/${sessionId}/finish`, {
       method: "POST",
     });

     const finishData = await finishResponse.json();

     if (!finishResponse.ok) {
       throw new Error(finishData.error || "Failed to finish interview.");
     }

     // 3. Evaluate all answers with Gemini
     const evaluateResponse = await fetch(
       `/api/interview/${sessionId}/evaluate`,
       {
         method: "POST",
       },
     );

     const evaluateData = await evaluateResponse.json();

     if (!evaluateResponse.ok) {
       throw new Error(evaluateData.error || "Failed to evaluate interview.");
     }

     // 4. Create overall interview result
     const resultResponse = await fetch(`/api/interview/${sessionId}/result`, {
       method: "POST",
     });

     const resultData = await resultResponse.json();

     if (!resultResponse.ok) {
       throw new Error(
         resultData.error || "Failed to create interview result.",
       );
     }

     // 5. Go to result page
     router.push(`/interview/${sessionId}/result`);
   } catch (error) {
     console.error("Finish interview error:", error);

     alert(
       error instanceof Error ? error.message : "Failed to complete interview.",
     );
   }
 }
  return (
    <section className="mt-10">
      {/* Progress */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <p className="text-sm text-slate-400">
          {Math.round(((currentIndex + 1) / questions.length) * 100)}%
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
            {currentIndex + 1}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Interview Question
            </p>

            <h2 className="mt-2 text-xl font-bold leading-8 text-slate-950">
              {currentQuestion.question}
            </h2>
          </div>
        </div>

        {/* Answer */}
        <div className="mt-8">
          <label
            htmlFor="answer"
            className="text-sm font-semibold text-slate-700"
          >
            Your Answer
          </label>

          <textarea
            id="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer here..."
            rows={8}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={isLastQuestion ? handleFinish : handleNext}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLastQuestion ? "Finish Interview" : "Next Question →"}
          </button>
        </div>
      </article>
    </section>
  );
}
