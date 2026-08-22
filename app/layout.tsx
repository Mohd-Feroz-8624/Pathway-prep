import type { Metadata } from "next";
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
