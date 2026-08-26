import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }
  // console.log("Admin check for user:",{
  //   id: user.id,
  //   name: user.name,
  //   email: user.email,
  //   role: user.role,
  // });

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}
