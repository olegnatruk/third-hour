import {
  AccountSuspendedError,
  AuthenticationError,
  getCurrentUser,
} from "@backend/auth/current-user";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({
      user: {
        id: currentUser.user.id,
        email: currentUser.profile.email,
        displayName: currentUser.profile.display_name,
        role: currentUser.profile.role,
        status: currentUser.profile.status,
      },
    });
  } catch (error) {
    if (error instanceof AccountSuspendedError) {
      return Response.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof AuthenticationError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({ error: "Unable to load account." }, { status: 500 });
  }
}
