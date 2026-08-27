/**
 * Response shapes for the Third Hour loyalty-card API.
 * Mirrors `docs/BACKEND.md` and the route handlers under
 * `src/app/api/**` (which are owner-owned and read-only for the frontend).
 */

export type AppRole = "customer" | "cashier" | "admin" | "owner";
export type AccountStatus = "active" | "suspended";
export type CardStatus = "active" | "completed";
export type TransactionType =
  | "earned"
  | "redeemed"
  | "reversal"
  | "manual_adjustment"
  | string;

/** GET /api/auth/me */
export type SessionUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: AppRole;
  status: AccountStatus;
};

export type LoyaltyCard = {
  id: string;
  card_number: number;
  stamp_count: number;
  status: CardStatus;
  completed_at: string | null;
  created_at: string;
};

/** GET /api/loyalty-card */
export type LoyaltyCardResponse = {
  activeCard: LoyaltyCard | null;
  completedCards: LoyaltyCard[];
};

export type StampTransaction = {
  id: string;
  card_id: string;
  stamp_change: number;
  transaction_type: TransactionType;
  reason: string | null;
  created_at: string;
  created_by?: string | null;
};

/** GET /api/loyalty-card/transactions */
export type TransactionsResponse = { transactions: StampTransaction[] };

export type RewardRedemption = {
  id: string;
  redeemed_at: string;
  redeemed_by?: string | null;
};

export type RewardEntitlement = {
  id: string;
  card_id: string;
  reward_name: string;
  reward_description: string | null;
  created_at: string;
  // Supabase returns the embedded row as an object (to-one), null, or an array.
  reward_redemptions: RewardRedemption[] | RewardRedemption | null;
};

/** True when a reward entitlement has been redeemed, regardless of embed shape. */
export function isRewardRedeemed(entitlement: RewardEntitlement): boolean {
  const r = entitlement.reward_redemptions;
  if (!r) return false;
  return Array.isArray(r) ? r.length > 0 : true;
}

/** GET /api/loyalty-card/rewards */
export type CustomerRewardsResponse = {
  customerId: string;
  rewards: RewardEntitlement[];
};

/** POST /api/loyalty-card/qr */
export type QrTokenResponse = { token: string; expiresAt: string };

/** POST /api/qr/scan → { result } */
export type ScanAwardResult = {
  idempotent: boolean;
  awardedCardId: string;
  awardedCardNumber: number;
  awardedCardStampCount: number;
  cardCompleted: boolean;
  nextActiveCardId?: string;
  nextActiveCardNumber?: number;
};

/** POST /api/qr/redeem → { result } */
export type RedeemResult = {
  entitlementId: string;
  cardId: string;
  cardNumber: number;
  rewardName: string;
  rewardDescription: string | null;
  redeemed: boolean;
};

/** POST /api/stamps/adjust → { result } (also POST /api/stamps/award shares the award shape) */
export type AdjustResult = {
  idempotent: boolean;
  cardId: string;
  cardNumber: number;
  stampCount: number;
  cardCompleted?: boolean;
  nextActiveCardId?: string;
};

export type Account = {
  id: string;
  email: string;
  display_name: string | null;
  role: AppRole;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

/** GET /api/admin/accounts */
export type AccountsResponse = { accounts: Account[]; total: number };

/** GET /api/admin/customers/:id/history */
export type CustomerHistoryResponse = {
  customerId: string;
  cards: LoyaltyCard[];
  transactions: StampTransaction[];
  rewards: RewardEntitlement[];
};

export type RewardDefinition = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** GET /api/admin/rewards */
export type RewardDefinitionsResponse = { rewards: RewardDefinition[] };

/** POST /api/auth/sign-up */
export type SignUpResponse = {
  user: { id: string };
  requiresEmailConfirmation: boolean;
};
