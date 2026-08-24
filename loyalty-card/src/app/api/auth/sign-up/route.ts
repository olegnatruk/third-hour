import {
  CredentialsValidationError,
  parseCredentials,
} from "@backend/auth/credentials";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const credentials = parseCredentials(await request.json(), true);
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { display_name: credentials.displayName },
      },
    });

    if (error || !data.user) {
      return Response.json(
        { error: "Unable to create your account." },
        { status: 400 },
      );
    }

    return Response.json(
      {
        user: { id: data.user.id },
        requiresEmailConfirmation: !data.session,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof CredentialsValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(
      { error: "Unable to create your account." },
      { status: 400 },
    );
  }
}
