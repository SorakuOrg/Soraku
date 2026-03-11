export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

// /profile/me → redirect ke /dashboard/profile (edit)
// atau ke /profile/[username] jika punya username
export default async function ProfileMePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.username) redirect(`/profile/${session.username}`);
  redirect("/dashboard/profile");
}
