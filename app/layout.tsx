import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUser from "@/components/SyncUser";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pathway Prep",
    template: "%s | Pathway Prep",
  },

  description:
    "Your complete journey from Semester 1 to job ready — academics, DSA, projects, resumes, interviews and AI-powered career assistance.",
  keywords: [
    "Pathway Prep",
    "career preparation",
    "DSA",
    "resume builder",
    "mock interviews",
    "student career platform",
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
