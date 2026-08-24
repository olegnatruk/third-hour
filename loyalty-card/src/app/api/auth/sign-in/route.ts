import {
  CredentialsValidationError,
  parseCredentials,
} from "@backend/auth/credentials";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const credentials = parseCredentials(await request.json());
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      return Response.json(
        { error: "Invalid email address or password." },
        { status: 401 },
      );
    }

    return Response.json({ user: { id: data.user.id } });
  } catch (error) {
    if (error instanceof CredentialsValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
