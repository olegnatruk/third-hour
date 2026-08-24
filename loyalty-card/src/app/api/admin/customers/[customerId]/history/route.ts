import {
  AccountSuspendedError,
  AuthenticationError,
  AuthorizationError,
  requireRole,
} from "@backend/auth/current-user";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof AccountSuspendedError || error instanceof AuthorizationError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json({ error: "Unable to load customer history." }, { status: 500 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    await requireRole(["admin", "owner"]);
    const { customerId } = await params;

    if (!UUID.test(customerId)) {
      return Response.json({ error: "A valid customer ID is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: cards, error: cardsError } = await supabase
      .from("loyalty_cards")
      .select("id, card_number, stamp_count, status, completed_at, created_at")
      .eq("customer_id", customerId)
      .order("card_number", { ascending: false });

    if (cardsError) {
      throw cardsError;
    }

    const cardIds = cards.map((card) => card.id);
    const [transactionsResult, rewardsResult] = await Promise.all([
      cardIds.length
        ? supabase
            .from("stamp_transactions")
            .select("id, card_id, stamp_change, transaction_type, reason, created_by, created_at")
            .in("card_id", cardIds)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      cardIds.length
        ? supabase
            .from("reward_entitlements")
            .select(
              "id, card_id, reward_name, reward_description, created_at, reward_redemptions(id, redeemed_by, redeemed_at)",
            )
            .in("card_id", cardIds)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (transactionsResult.error) {
      throw transactionsResult.error;
    }

    if (rewardsResult.error) {
      throw rewardsResult.error;
    }

    return Response.json({
      customerId,
      cards,
      transactions: transactionsResult.data,
      rewards: rewardsResult.data,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
