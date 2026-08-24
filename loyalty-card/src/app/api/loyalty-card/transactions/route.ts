import {
  AccountSuspendedError,
  AuthenticationError,
  requireUser,
} from "@backend/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const currentUser = await requireUser();
    const requestedLimit = Number(new URL(request.url).searchParams.get("limit") ?? 50);
    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 50;
    const supabase = await createClient();
    const { data: cards, error: cardsError } = await supabase
      .from("loyalty_cards")
      .select("id")
      .eq("customer_id", currentUser.user.id);

    if (cardsError) {
      throw cardsError;
    }

    const cardIds = cards.map((card) => card.id);

    if (cardIds.length === 0) {
      return Response.json({ transactions: [] });
    }

    const { data, error } = await supabase
      .from("stamp_transactions")
      .select("id, card_id, stamp_change, transaction_type, reason, created_at")
      .in("card_id", cardIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return Response.json({ transactions: data });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof AccountSuspendedError) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ error: "Unable to load transactions." }, { status: 500 });
  }
}
