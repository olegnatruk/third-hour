import {
  AccountSuspendedError,
  AuthenticationError,
  requireUser,
} from "@backend/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const currentUser = await requireUser();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reward_entitlements")
      .select(
        "id, card_id, reward_name, reward_description, created_at, reward_redemptions(id, redeemed_at)",
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return Response.json({ customerId: currentUser.user.id, rewards: data });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof AccountSuspendedError) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ error: "Unable to load rewards." }, { status: 500 });
  }
}
