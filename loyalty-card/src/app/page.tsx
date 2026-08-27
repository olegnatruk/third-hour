import { redirect } from "next/navigation";
import { getSessionUser, homePathForRole } from "@/lib/auth/session";

export default async function Index() {
  const user = await getSessionUser();
  redirect(user ? homePathForRole(user.role) : "/sign-in");
}
