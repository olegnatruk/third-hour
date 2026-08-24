import {
  AccountSuspendedError,
  AuthenticationError,
  requireUser,
} from "@backend/auth/current-user";
import { getCustomerCards } from "@backend/stamps/cards";

export async function GET() {
  try {
    const currentUser = await requireUser();
    const cards = await getCustomerCards(currentUser.user.id);

    return Response.json(cards);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof AccountSuspendedError) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ error: "Unable to load loyalty cards." }, { status: 500 });
  }
}
