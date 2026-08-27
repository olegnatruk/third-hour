import { redirect } from "next/navigation";
import { getSessionUser, homePathForRole } from "@/lib/auth/session";
import { SignUpForm } from "./SignUpForm";

export default async function SignUpPage() {
  const user = await getSessionUser();
  if (user) redirect(homePathForRole(user.role));

  return (
    // Cream theme applies to this route only.
    <div data-theme="cream" className="flex min-h-dvh flex-col bg-background">
      <SignUpForm />
    </div>
  );
}
