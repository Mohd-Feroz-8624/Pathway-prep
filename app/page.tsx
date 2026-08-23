"use client";
import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function Home() {
  const platformLinks: string[] = [
    "Roadmaps",
    "DSA Prep",
    "Resume Builder",
    "Mock Interviews",
  ];

  const legalLinks: string[] = [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "Contact Us",
  ];
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <main className="min-h-screen w-98% bg-white ">
      {/* Navbar */}

      <header
        className={`fixed top-0 z-50 w-full border-b border-[#c7c5d4]/10 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "bg-[#f8f9ff]/95 shadow-md" : "bg-[#f8f9ff]/80 shadow-sm"
        } border-b border-slate-200`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900"
          >
            <Image
              src="/icon.png"
              alt="Pathway Prep Logo"
              width={32}
              height={32}
              className="h-10 w-13"
            />
            <span>
              PATHWAY <span className="text-blue-600">PREP</span>
            </span>
          </Link>

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#roadmap"
                className="text-[#464652] transition-colors hover:text-blue-700"
              >
                Roadmap
              </a>

              <a
                href="#features"
                className="text-[#464652] transition-colors hover:text-blue-700"
              >
                Features
              </a>

              <a
                href="#pricing"
                className="text-[#464652] transition-colors hover:text-blue-700"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hidden font-semibold text-blue-500 transition-colors hover:text-blue-700 md:inline-flex"
            >
              Sign In
            </a>

            <a
              href="#"
              className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white shadow-[0_4px_20px_rgba(21,21,125,0.15)] transition-all hover:bg-blue-700 active:scale-95"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden ">
        <div className="mx-auto max-w-7xl px-6 py-2 text-center md:py-32">
          <div className="mx-auto mb-6 inline-flex rounded-full  bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Your complete college-to-career platform
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
            Your journey from <span className="text-blue-600">Semester 1</span>{" "}
            to Job Ready.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Learn, practice, build and prepare for your career — all in one
            platform designed to guide you step by step.
          </p>

          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Step by Step — Success Ahead
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Start Your Journey
            </Link>

            <Link
              href="#features"
              className="rounded-xl border border-slate-300 px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mx-auto mb-6 inline-flex rounded-full px-4  text-5xl font-semibold text-blue-700">
              Everything in one place 
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Everything you need to become job ready
            </h2>

            <p className="mt-4 text-slate-600">
              From academics and DSA to resumes and interviews, Pathway Prep
              brings your entire career preparation journey together.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Academic Roadmap",
                description:
                  "Follow your semester-wise subjects, topics, notes and learning progress.",
              },
              {
                title: "DSA Practice",
                description:
                  "Practice coding problems, track your progress and identify weak topics.",
              },
              {
                title: "Career Roadmaps",
                description:
                  "Get a structured path based on your target role and current skills.",
              },
              {
                title: "Project Guidance",
                description:
                  "Discover projects that progressively build your development skills.",
              },
              {
                title: "Resume Builder",
                description:
                  "Create professional, ATS-friendly resumes with multiple templates.",
              },
              {
                title: "AI Career Assistant",
                description:
                  "Ask questions, get guidance and practice interviews with AI.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className=" border-b w-90% border-[#c7c5d4]/20 bg-[#d3e4fe] py-10 bottom-0">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
          {/* BRAND */}

          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900"
            >
              <Image
                src="/icon.png"
                alt="Pathway Prep Logo"
                width={30}
                height={30}
                className="h-15 w-15 rounded-full"
              />
              <span>
                PATHWAY <span className="text-blue-600">PREP</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-[#464652]">
              Empowering ambitious students to bridge the gap between academic
              learning and industry success.
            </p>

            <div className="mt-4 flex gap-4 text-[#464652]">
              <a
                href="#"
                aria-label="Share"
                className="transition-colors hover:text-[#15157d]"
              >
                <span className="material-symbols-outlined">
                  Linkedin logo
                </span>
              </a>

              <a
                href="#"
                aria-label="Website"
                className="transition-colors hover:text-[#15157d]"
              >
                <span className="material-symbols-outlined">github logo</span>
              </a>
            </div>
          </div>

          {/* PLATFORM */}

          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider">
              Platform
            </h4>

            {platformLinks.map((item: string) => (
              <a
                key={item}
                href="#"
                className="text-sm text-[#464652] transition-colors hover:text-[#15157d]"
              >
                {item}
              </a>
            ))}
          </div>

          {/* LEGAL */}

          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider">
              Legal
            </h4>

            {legalLinks.map((item: string) => (
              <a
                key={item}
                href="#"
                className="text-sm text-[#464652] transition-colors hover:text-[#15157d]"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}

          <div className="flex flex-col gap-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider">
              Ready to start?
            </h4>

            <button
              type="button"
              className="w-fit rounded-lg bg-[#15157d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2e3192]"
            >
              Join for Free
            </button>
          </div>
        </div>

        <div className="mx-auto bottom-0 mt-8 flex justify-center  max-w-7xl border-t border-[#c7c5d4]/10 px-6 pt-8 text-center md:text-left">
          <p className="text-sm text-[#464652] w-full text-center ">
            © 2026 PathWay Prep . Step by step Success Ahead .All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
