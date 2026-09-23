"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { title: "Features", href: "#features" },
  { title: "How It Works", href: "#how-it-works" },
  { title: "Journey", href: "#journey" },
];

const features = [
  {
    number: "01",
    title: "Academic Roadmaps",
    description:
      "Follow structured semester-wise learning paths with subjects, topics, resources and progress tracking.",
  },
  {
    number: "02",
    title: "Career Roadmaps",
    description:
      "Choose your target role and follow a structured path from your current skills to career readiness.",
  },
  {
    number: "03",
    title: "DSA Practice",
    description:
      "Practice coding problems, build consistency and track the questions you have solved.",
  },
  {
    number: "04",
    title: "Resume Builder",
    description:
      "Create professional resumes with structured templates designed for modern job applications.",
  },
  {
    number: "05",
    title: "AI Resume Analysis",
    description:
      "Analyze your resume with AI-powered ATS scoring, keyword feedback and actionable recommendations.",
  },
  {
    number: "06",
    title: "AI Interview Practice",
    description:
      "Practice technical interviews with AI-generated questions, evaluation, feedback and performance scores.",
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Learn",
    description:
      "Build your foundation through academics, structured roadmaps and curated learning resources.",
  },
  {
    number: "02",
    title: "Practice",
    description:
      "Strengthen your problem-solving skills with DSA practice and interview preparation.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Create projects and prepare a professional resume that represents your skills.",
  },
  {
    number: "04",
    title: "Prepare",
    description:
      "Practice interviews, receive AI feedback and identify the areas you need to improve.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight sm:gap-3 sm:text-xl"
            onClick={closeMenu}
          >
            <Image
              src="/icon.png"
              alt="Pathway Prep"
              width={40}
              height={40}
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            />

            <span>
              PATHWAY <span className="text-blue-600">PREP</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  {item.title}
                </a>
              ))}

              <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-4">
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute left-1/2 top-0 -z-10 h-125 w-175 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Your complete college-to-career platform
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              From college learning to{" "}
              <span className="text-blue-600">career ready.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Pathway Prep brings academics, career roadmaps, DSA, resumes and
              AI-powered interview preparation together in one structured
              platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Start Your Journey
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Platform
              </a>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-400">
              Learn. Practice. Build. Prepare.
            </p>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6">
              <div className="rounded-2xl bg-slate-950 p-5 text-white sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Career Readiness</p>
                    <p className="mt-1 text-3xl font-bold">74%</p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-blue-500 text-sm font-bold">
                    74
                  </div>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[74%] rounded-full bg-blue-500" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["Roadmap", "70%"],
                    ["DSA", "60%"],
                    ["Interview", "80%"],
                    ["Resume", "90%"],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-3"
                    >
                      <p className="text-xs text-slate-400">{title}</p>
                      <p className="mt-1 text-lg font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Next Focus
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Practice DSA
                  </p>
                </div>

                <span className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700">
                  Continue
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 bg-slate-50 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to become job ready
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Build your skills, track your progress and prepare for the
              opportunities ahead with one connected platform.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-sm font-bold text-blue-600">
                  {feature.number}
                </span>

                <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                One journey. One platform. One clear direction.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Instead of jumping between different tools for learning, coding,
                resumes and interviews, Pathway Prep connects your preparation
                into one continuous journey.
              </p>

              <Link
                href="/sign-up"
                className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Build Your Pathway
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {journeySteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 p-6"
                >
                  <span className="text-sm font-bold text-blue-600">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-xl font-bold">{step.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Journey */}
      <section
        id="journey"
        className="scroll-mt-20 bg-slate-950 py-20 text-white md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Your pathway
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Every step moves you closer to your goal.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Your progress isn&apos;t just about completing tasks. It&apos;s about
              becoming more prepared for the career you want.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {["Learn", "Practice", "Build", "Get Career Ready"].map(
              (step, index) => (
                <div key={step} className="relative">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <p className="text-sm font-bold text-blue-400">
                      0{index + 1}
                    </p>

                    <h3 className="mt-8 text-xl font-bold">{step}</h3>

                    <div className="mt-6 h-1 rounded-full bg-slate-800">
                      <div className="h-full w-full rounded-full bg-blue-500" />
                    </div>
                  </div>

                  {index < 3 && (
                    <div className="absolute right-0 top-1/2 hidden w-4 translate-x-1/2 border-t border-slate-700 md:block" />
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-20 text-white md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Your career journey starts with one step.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Stop wondering what to learn next. Build your pathway, practice
            consistently and track your progress toward becoming job ready.
          </p>

          <Link
            href="/sign-up"
            className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-3 text-xl font-bold"
            >
              <Image
                src="/icon.png"
                alt="Pathway Prep"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />

              <span>
                PATHWAY <span className="text-blue-600">PREP</span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Empowering students to bridge the gap between academic learning
              and industry readiness through structured preparation and
              intelligent feedback.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Platform
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link className="hover:text-blue-600" href="/roadmaps">
                Roadmaps
              </Link>
              <Link className="hover:text-blue-600" href="/dsa">
                DSA Practice
              </Link>
              <Link className="hover:text-blue-600" href="/resume">
                Resume Builder
              </Link>
              <Link className="hover:text-blue-600" href="/interview">
                Interview Practice
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Get Started
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link className="hover:text-blue-600" href="/sign-in">
                Sign In
              </Link>
              <Link className="hover:text-blue-600" href="/sign-up">
                Create Account
              </Link>
              <a className="hover:text-blue-600" href="#features">
                Features
              </a>
              <a className="hover:text-blue-600" href="#how-it-works">
                How It Works
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
            © 2026 Pathway Prep. Step by step — success ahead.
          </div>
        </div>
      </footer>
    </main>
  );
}
