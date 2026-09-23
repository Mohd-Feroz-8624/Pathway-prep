import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUser from "@/components/SyncUser";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BTech Pathway | Complete BTech Career Preparation Platform",
    template: "%s | BTech Pathway",
  },

  description:
    "BTech Pathway is a complete career preparation platform for BTech students, offering academics, DSA, career roadmaps, resume building, interview preparation, and AI-powered career assistance.",

  keywords: [
    "BTech Pathway",
    "BTech career preparation",
    "BTech students",
    "BTech roadmap",
    "BTech career roadmap",
    "BTech placement preparation",
    "BTech placement roadmap",
    "BTech study platform",
    "BTech learning platform",
    "BTech student platform",
    "engineering student career platform",
    "engineering students placement preparation",
    "DSA for BTech students",
    "DSA practice for students",
    "coding practice for engineering students",
    "BTech resume builder",
    "resume builder for students",
    "ATS resume builder",
    "BTech interview preparation",
    "mock interview for students",
    "AI interview preparation",
    "AI career assistant",
    "career guidance for BTech students",
    "BTech academic resources",
    "semester wise BTech preparation",
    "BTech skills roadmap",
    "software engineering career roadmap",
    "student career preparation",
    "Pathway Prep",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth">
        <body>
          <SyncUser />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
