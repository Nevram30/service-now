import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export default async function SettingsRedirect() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Redirect to role-specific settings page
  const role = session.user.role ?? "CUSTOMER";
  redirect(`/dashboard/${role.toLowerCase()}/settings`);
}
