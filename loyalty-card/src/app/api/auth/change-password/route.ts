import {
  AccountSuspendedError,
  AuthenticationError,
  requireUser,
} from "@backend/auth/current-user";
import { validatePassword } from "@backend/auth/credentials";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const currentUser = await requireUser();
    const body = await request.json();
    const password = validatePassword(body?.password);
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw error;
    }

    return Response.json({ userId: currentUser.user.id }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof AccountSuspendedError) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to change password." },
      { status: 400 },
    );
  }
}
