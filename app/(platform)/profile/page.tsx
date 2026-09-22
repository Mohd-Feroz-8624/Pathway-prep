import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import ProfileForm from "@/components/dashboard/ProfileForm"

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">Your Profile</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Profile Settings
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your academic and career information.
          </p>
        </div>

        <ProfileForm
          name={user.name}
          email={user.email}
          college={user.college}
          branch={user.branch}
          currentSemester={user.currentSemester}
          careerGoal={user.careerGoal}
          github={user.profile?.github ?? null}
          linkedin={user.profile?.linkedin ?? null}
        />
      </section>
    </main>
  );
}
