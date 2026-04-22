-- Add a JSONB `data` column to public.trips so the full client state
-- (flights, hotel, events, expenses, documents, checklists, etc.)
-- can be persisted to the cloud keyed by trip.id.
--
-- Idempotent: safe to run multiple times.
--
-- Context: the previous "legacy sync" (lib/sync.ts) tried to write to
-- a `data` column that never existed on the current schema, so every
-- write was silently failing and user data was living only in the
-- browser's localStorage. This migration unblocks cross-device sync.

alter table public.trips
  add column if not exists data jsonb;

-- Optional: index for faster existence checks (not strictly required).
create index if not exists idx_trips_data_not_null
  on public.trips((data is not null));
