import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export default async function DashboardRedirect() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Redirect to role-specific dashboard (default to customer if role not set)
  const role = session.user.role ?? "CUSTOMER";
  redirect(`/dashboard/${role.toLowerCase()}`);
}
