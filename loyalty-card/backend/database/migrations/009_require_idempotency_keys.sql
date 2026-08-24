-- Apply after 008_manual_stamp_adjustments.sql.
-- Every stamp-changing operation must have a durable replay-protection key.

alter table public.stamp_transactions
  alter column idempotency_key set not null;
