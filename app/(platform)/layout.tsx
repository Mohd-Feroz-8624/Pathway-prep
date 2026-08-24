import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeaderBar from "@/components/dashboard/DashboardHeaderBar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="min-h-screen lg:pl-64">
        <DashboardHeaderBar />

        {children}
      </div>
    </div>
  );
}
