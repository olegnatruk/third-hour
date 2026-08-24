import { createClient } from "@/lib/supabase/server";

export async function getCustomerCards(customerId: string) {
  const supabase = await createClient();
  const { data: activeCard, error: activeCardError } = await supabase
    .from("loyalty_cards")
    .select("id, card_number, stamp_count, status, completed_at, created_at")
    .eq("customer_id", customerId)
    .eq("status", "active")
    .maybeSingle();

  if (activeCardError) {
    throw activeCardError;
  }

  const { data: completedCards, error: completedCardsError } = await supabase
    .from("loyalty_cards")
    .select("id, card_number, stamp_count, status, completed_at, created_at")
    .eq("customer_id", customerId)
    .eq("status", "completed")
    .order("card_number", { ascending: false });

  if (completedCardsError) {
    throw completedCardsError;
  }

  return { activeCard, completedCards };
}
