import { redirect } from "next/navigation";
import { getSessionUser, homePathForRole } from "@/lib/auth/session";
import { SignInForm } from "./SignInForm";

export default async function SignInPage() {
  const user = await getSessionUser();
  if (user) redirect(homePathForRole(user.role));
  return <SignInForm />;
}
