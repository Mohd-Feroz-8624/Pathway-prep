"use client";

import { useState } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeaderBar from "@/components/dashboard/DashboardHeaderBar";
import FloatingAssistantButton from "@/components/assistant/FloatingAssistantButton";

export default function PlatformLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <DashboardHeaderBar />

        {children}
        <FloatingAssistantButton/>
      </div>
    </div>
  );
}
